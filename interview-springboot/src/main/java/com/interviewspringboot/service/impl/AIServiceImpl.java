package com.interviewspringboot.service.impl;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.aigc.generation.models.QwenParam;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.MessageManager;
import com.alibaba.dashscope.common.Role;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.interviewspringboot.mapper.InterviewConversationMapper;
import com.interviewspringboot.mapper.InterviewMapper;
import com.interviewspringboot.mapper.InterviewRoundMapper;
import com.interviewspringboot.pojo.*;
import com.interviewspringboot.pojo.request.CreateSessionRequest;
import com.interviewspringboot.pojo.request.SaveConversationRequest;
import com.interviewspringboot.pojo.request.SendMessageRequest;
import com.interviewspringboot.pojo.response.MessageResponse;
import com.interviewspringboot.pojo.response.SessionResponse;
import com.interviewspringboot.pojo.response.StreamResponse;
import com.interviewspringboot.service.AIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import io.reactivex.Flowable;

/**
 * AI服务实现类
 */
@Slf4j
@Service
public class AIServiceImpl implements AIService {

    @Value("${llm.dashscope.apiKey}")
    private String apiKey;
    
    @Autowired
    private InterviewMapper interviewMapper;
    
    @Autowired
    private InterviewRoundMapper interviewRoundMapper;
    
    @Autowired
    private InterviewConversationMapper conversationMapper;
    
    private final ObjectMapper objectMapper;
    
    // 存储会话上下文
    private final Map<String, MessageManager> sessionContexts = new ConcurrentHashMap<>();
    
    public AIServiceImpl() {
        // 初始化ObjectMapper，添加JavaTimeModule支持
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
    
    /**
     * 创建AI会话
     */
    @Override
    public Result<SessionResponse> createSession(Long userId, CreateSessionRequest request) {
        // 验证面试和轮次是否存在
        Interview interview = interviewMapper.selectById(request.getInterviewId());
        if (interview == null || !Objects.equals(interview.getUserId(), userId)) {
            return Result.error("面试不存在或无权访问");
        }
        
        InterviewRound round = interviewRoundMapper.selectById(request.getRoundId());
        if (round == null || !Objects.equals(round.getInterviewId(), request.getInterviewId())) {
            return Result.error("面试轮次不存在或不属于该面试");
        }
        
        // 生成会话ID
        String sessionId = UUID.randomUUID().toString();
        
        // 初始化会话上下文
        MessageManager messageManager = new MessageManager(20);
        
        // 添加系统提示语
        String systemPrompt = getInterviewSystemPrompt(interview, round);
        Message systemMsg = Message.builder()
                .role(Role.SYSTEM.getValue())
                .content(systemPrompt)
                .build();
        messageManager.add(systemMsg);
        
        // 保存会话上下文
        sessionContexts.put(sessionId, messageManager);
        
        // 更新面试轮次的会话ID
        round.setSessionId(sessionId);
        round.setStatus("ONGOING");
        interviewRoundMapper.update(round);
        
        // 创建对话记录
        InterviewConversation conversation = new InterviewConversation();
        conversation.setInterviewId(request.getInterviewId());
        conversation.setRoundId(request.getRoundId());
        conversation.setSessionId(sessionId);
        conversation.setConversationText(serializeMessages(new ArrayList<>()));
        conversationMapper.save(conversation);
        
        return Result.success(new SessionResponse(sessionId));
    }

    /**
     * 发送消息并获取回复
     */
    @Override
    public Result<MessageResponse> sendMessage(Long userId, SendMessageRequest request) {
        // 获取会话上下文
        MessageManager messageManager = getOrCreateMessageManager(request.getSessionId());
        
        try {
            // 添加用户消息
            Message userMsg = Message.builder()
                    .role(Role.USER.getValue())
                    .content(request.getMessage())
                    .build();
            messageManager.add(userMsg);
            
            // 获取会话记录
            InterviewConversation conversation = conversationMapper.selectBySessionId(request.getSessionId());
            if (conversation == null) {
                return Result.error("会话不存在");
            }
            
            // 验证用户权限
            Interview interview = interviewMapper.selectById(conversation.getInterviewId());
            if (interview == null || !Objects.equals(interview.getUserId(), userId)) {
                return Result.error("无权访问该会话");
            }
            
            // 调用通义千问API
            Generation generation = new Generation();
            QwenParam param = QwenParam.builder()
                    .model(Generation.Models.QWEN_TURBO)
                    .messages(messageManager.get())
                    .apiKey(apiKey)
                    .resultFormat(QwenParam.ResultFormat.MESSAGE)
                    .build();
            
            GenerationResult result = generation.call(param);
            String response = result.getOutput().getChoices().get(0).getMessage().getContent();
            
            // 添加助手响应到消息历史（仅内存中）
            Message assistantMsg = Message.builder()
                    .role(Role.ASSISTANT.getValue())
                    .content(response)
                    .build();
            messageManager.add(assistantMsg);
            
            // 注意：不再更新数据库中的对话记录
            // 对话记录将只在saveConversation方法中更新
            
            return Result.success(new MessageResponse(response));
            
        } catch (Exception e) {
            log.error("发送消息失败", e);
            return Result.error("发送消息失败: " + e.getMessage());
        }
    }

    /**
     * 获取对话历史
     */
    @Override
    public Result<List<ConversationMessage>> getConversationHistory(Long userId, String sessionId) {
        // 获取会话记录
        InterviewConversation conversation = conversationMapper.selectBySessionId(sessionId);
        if (conversation == null) {
            return Result.error("会话不存在");
        }
        
        // 验证用户权限
        Interview interview = interviewMapper.selectById(conversation.getInterviewId());
        if (interview == null || !Objects.equals(interview.getUserId(), userId)) {
            return Result.error("无权访问该会话");
        }
        
        // 记录原始会话文本
        log.info("获取会话 {} 的原始对话内容: {}", sessionId, conversation.getConversationText());
        
        // 反序列化消息历史
        List<ConversationMessage> messages = deserializeMessages(conversation.getConversationText());
        log.info("反序列化后的消息条数: {}", messages.size());
        
        if (messages.isEmpty()) {
            log.warn("反序列化后消息列表为空，可能存在格式问题");
        } else {
            // 记录部分消息内容用于调试
            int sampleSize = Math.min(messages.size(), 2);
            for (int i = 0; i < sampleSize; i++) {
                ConversationMessage msg = messages.get(i);
                log.info("示例消息 {}: role={}, timestamp={}, content={}...", 
                        i, msg.getRole(), msg.getTimestamp(), 
                        msg.getContent() != null && msg.getContent().length() > 30 ? 
                        msg.getContent().substring(0, 30) : msg.getContent());
            }
        }
        
        return Result.success(messages);
    }

    /**
     * 流式对话
     */
    @Override
    public SseEmitter streamChat(Long userId, String sessionId, String message) {
        SseEmitter emitter = new SseEmitter(120000L); // 2分钟超时
        
        try {
            // 获取会话记录
            InterviewConversation conversation = conversationMapper.selectBySessionId(sessionId);
            if (conversation == null) {
                completeWithError(emitter, "会话不存在");
                return emitter;
            }
            
            // 验证用户权限
            Interview interview = interviewMapper.selectById(conversation.getInterviewId());
            if (interview == null || !Objects.equals(interview.getUserId(), userId)) {
                completeWithError(emitter, "无权访问该会话");
                return emitter;
            }
            
            // 获取会话上下文
            MessageManager messageManager = getOrCreateMessageManager(sessionId);
            
            // 添加用户消息
            Message userMsg = Message.builder()
                    .role(Role.USER.getValue())
                    .content(message)
                    .build();
            messageManager.add(userMsg);
            
            // 使用CompletableFuture异步处理
            CompletableFuture.runAsync(() -> {
                StringBuilder fullResponse = new StringBuilder(); // 用于收集完整响应以供后续存储
                try {
                    Generation generation = new Generation(); // 可以考虑是否在类级别注入或复用

                    // 构建流式调用参数，参考官方文档
                    GenerationParam param = GenerationParam.builder()
                            .apiKey(apiKey) // 使用您配置的apiKey
                            .model(Generation.Models.QWEN_TURBO) // 您当前使用的模型，或按需更改，如 "qwen-plus"
                            .messages(messageManager.get()) // 获取当前对话历史
                            .resultFormat(GenerationParam.ResultFormat.MESSAGE) // 按消息格式返回
                            .incrementalOutput(true) // 启用增量输出
                            .build();
                    
                    log.info("用户 {} 请求流式对话 (真流式): sessionId={}, message={}", userId, sessionId, message);
                    Flowable<GenerationResult> resultFlowable = generation.streamCall(param);
                    
                    // 使用 RxJava Flowable 的 blockingForEach 来处理每个流式返回的结果
                    // 这会在当前 CompletableFuture 的线程中阻塞执行，直到流结束
                    resultFlowable.blockingForEach(generationResult -> {
                        if (generationResult.getOutput() != null && 
                            generationResult.getOutput().getChoices() != null && 
                            !generationResult.getOutput().getChoices().isEmpty()) {
                            
                            String contentChunk = generationResult.getOutput().getChoices().get(0).getMessage().getContent();
                            String finishReason = generationResult.getOutput().getChoices().get(0).getFinishReason();
                            boolean isLastChunk = "stop".equalsIgnoreCase(finishReason);

                            if (contentChunk != null) {
                                fullResponse.append(contentChunk);
                                StreamResponse streamResponse = new StreamResponse("message", contentChunk, isLastChunk);
                                try {
                                    emitter.send(objectMapper.writeValueAsString(streamResponse));
                                } catch (IOException e) {
                                    log.error("SSE发送错误 during stream for session {}: {}", sessionId, e.getMessage());
                                    // 如果发送失败，需要中断Flowable的进一步处理
                                    // 通过抛出RuntimeException，会被外层的catch捕获
                                    throw new RuntimeException("SSE send error", e); 
                                }
                            }
                            if (isLastChunk) {
                                log.info("流式对话结束 (finishReason=stop): sessionId={}", sessionId);
                            }
                        }
                    });
                    
                    // 流处理完毕后（成功或因错误中断后），添加助手完整响应到内存中的消息历史
                    Message assistantMsg = Message.builder()
                            .role(Role.ASSISTANT.getValue())
                            .content(fullResponse.toString())
                            .build();
                    messageManager.add(assistantMsg);
                    
                    // 注意：数据库中的对话记录仍然只在saveConversation方法中更新
                    
                    emitter.complete(); // 正常完成SSE流
                    log.info("流式对话正常完成: sessionId={}", sessionId);
                    
                } catch (Exception e) { //捕获 streamCall 或 blockingForEach 或 emitter.send 抛出的异常
                    log.error("流式对话处理失败: sessionId={}, error={}", sessionId, e.getMessage(), e);
                    try {
                        emitter.completeWithError(e);
                    } catch (Exception ex) {
                        log.error("完成emitter出错 (after stream error): sessionId={}, error={}", sessionId, ex.getMessage());
                    }
                }
            });
            
        } catch (Exception e) { // 捕获 streamChat 方法初始化阶段的错误
            log.error("初始化流式对话失败: sessionId={}, error={}", sessionId, e.getMessage(), e);
            completeWithError(emitter, "初始化流式对话失败: " + e.getMessage());
        }
        
        return emitter;
    }
    
    /**
     * 获取面试系统提示词
     */
    private String getInterviewSystemPrompt(Interview interview, InterviewRound round) {
        return String.format("""
                你是一位专业的面试官，正在进行%s公司%s岗位的第%d轮面试。
                请根据以下岗位描述进行面试：
                %s
                
                面试规则：
                1. 你应该像真实的面试官一样提问，专业、有深度
                2. 根据应聘者的回答进行追问，不要一次性问太多问题
                3. 根据岗位需求评估应聘者的技能和经验
                4. 提问应该从基础到进阶，逐步深入
                5. 面试结束时给出简要的评价
                
                请开始面试，先简单介绍自己，然后提出第一个问题。
                """,
                interview.getCompany(),
                interview.getPosition(),
                round.getRoundNumber(),
                interview.getDescription() != null ? interview.getDescription() : "该岗位需要相关专业知识和技能。"
        );
    }
    
    /**
     * 获取或创建消息管理器
     */
    private MessageManager getOrCreateMessageManager(String sessionId) {
        // 如果已有会话上下文，直接返回
        if (sessionContexts.containsKey(sessionId)) {
            return sessionContexts.get(sessionId);
        }
        
        // 否则尝试从数据库恢复会话上下文
        InterviewConversation conversation = conversationMapper.selectBySessionId(sessionId);
        if (conversation != null) {
            List<ConversationMessage> messages = deserializeMessages(conversation.getConversationText());
            
            MessageManager messageManager = new MessageManager(20);
            
            // 获取面试和轮次
            Interview interview = interviewMapper.selectById(conversation.getInterviewId());
            InterviewRound round = interviewRoundMapper.selectById(conversation.getRoundId());
            
            // 添加系统提示语
            if (interview != null && round != null) {
                String systemPrompt = getInterviewSystemPrompt(interview, round);
                Message systemMsg = Message.builder()
                        .role(Role.SYSTEM.getValue())
                        .content(systemPrompt)
                        .build();
                messageManager.add(systemMsg);
            }
            
            // 添加历史消息
            for (ConversationMessage msg : messages) {
                Message dashscopeMsg = Message.builder()
                        .role(msg.getRole())
                        .content(msg.getContent())
                        .build();
                messageManager.add(dashscopeMsg);
            }
            
            // 保存到会话上下文
            sessionContexts.put(sessionId, messageManager);
            return messageManager;
        }
        
        // 如果都不存在，创建新的
        MessageManager messageManager = new MessageManager(20);
        sessionContexts.put(sessionId, messageManager);
        return messageManager;
    }
    
    /**
     * 序列化消息列表
     */
    private String serializeMessages(List<ConversationMessage> messages) {
        try {
            return objectMapper.writeValueAsString(messages);
        } catch (JsonProcessingException e) {
            log.error("序列化消息失败", e);
            return "[]";
        }
    }
    
    /**
     * 反序列化消息列表
     */
    private List<ConversationMessage> deserializeMessages(String json) {
        if (json == null || json.isEmpty()) {
            log.info("对话记录为空，返回空列表");
            return new ArrayList<>();
        }
        
        log.info("准备反序列化对话记录: {}", json);
        
        try {
            // 配置专用的ObjectMapper处理时间戳
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            // 允许从字符串反序列化为日期
            mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
            mapper.configure(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL, true);
            
            // 尝试从JSON反序列化对话消息
            List<ConversationMessage> messages = mapper.readValue(json, new TypeReference<List<ConversationMessage>>() {});
            log.info("成功反序列化 {} 条消息", messages.size());
            
            // 如果时间戳为null，设置为当前时间
            for (ConversationMessage message : messages) {
                if (message.getTimestamp() == null) {
                    message.setTimestamp(LocalDateTime.now());
                    log.info("为消息设置默认时间戳: {}", message.getContent());
                }
            }
            
            return messages;
        } catch (JsonProcessingException e) {
            log.error("反序列化消息失败: {}", e.getMessage(), e);
            log.error("尝试反序列化的JSON: {}", json);
            
            // 尝试使用更宽松的方式解析
            try {
                log.info("尝试使用备选方式解析对话记录");
                // 如果是保存对话接口已经写入了数据，可能是用另一种格式
                if (json.contains("\"role\"") && json.contains("\"content\"")) {
                    log.info("检测到conversation_text中包含对话数据，尝试直接反序列化");
                    List<Map<String, Object>> rawMessages = objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
                    List<ConversationMessage> messages = new ArrayList<>();
                    
                    for (Map<String, Object> rawMsg : rawMessages) {
                        String role = (String) rawMsg.get("role");
                        String content = (String) rawMsg.get("content");
                        
                        // 创建新的消息对象
                        ConversationMessage msg = new ConversationMessage();
                        msg.setRole(role);
                        msg.setContent(content);
                        msg.setTimestamp(LocalDateTime.now());
                        messages.add(msg);
                        log.info("成功解析消息: role={}, content={}", role, 
                                 content != null && content.length() > 30 ? content.substring(0, 30) + "..." : content);
                    }
                    
                    return messages;
                }
            } catch (Exception ex) {
                log.error("备选解析方式也失败: {}", ex.getMessage());
            }
            
            return new ArrayList<>();
        }
    }
    
    /**
     * 用错误完成SSE
     */
    private void completeWithError(SseEmitter emitter, String errorMessage) {
        try {
            emitter.completeWithError(new RuntimeException(errorMessage));
        } catch (Exception e) {
            log.error("Error completing emitter with error: {}", e.getMessage());
        }
    }

    /**
     * 保存面试对话并完成会话
     */
    @Override
    public Result<Map<String, Object>> saveConversation(Long userId, String sessionId, SaveConversationRequest request) {
        log.info("开始保存会话 {}, 请求中包含 {} 条对话消息", sessionId, 
                request.getConversations() != null ? request.getConversations().size() : 0);
        
        // 获取会话记录
        InterviewConversation conversation = conversationMapper.selectBySessionId(sessionId);
        if (conversation == null) {
            log.error("会话 {} 不存在", sessionId);
            return Result.error("会话不存在");
        }
        
        // 验证用户权限
        Interview interview = interviewMapper.selectById(conversation.getInterviewId());
        if (interview == null || !Objects.equals(interview.getUserId(), userId)) {
            log.error("用户 {} 无权访问会话 {}", userId, sessionId);
            return Result.error("无权访问该会话");
        }
        
        // 获取面试轮次
        InterviewRound round = interviewRoundMapper.selectById(conversation.getRoundId());
        if (round == null) {
            log.error("面试轮次 {} 不存在", conversation.getRoundId());
            return Result.error("面试轮次不存在");
        }
        
        // 更新对话记录
        if (request.getConversations() != null && !request.getConversations().isEmpty()) {
            try {
                // 处理传入的对话记录，确保时间戳正确
                processConversationTimestamps(request.getConversations());
                log.info("保存对话：处理后的消息记录数量为 {}", request.getConversations().size());
                
                // 检查消息格式
                for (int i = 0; i < Math.min(2, request.getConversations().size()); i++) {
                    ConversationMessage msg = request.getConversations().get(i);
                    log.debug("示例消息 {}: role={}, timestamp={}, content长度={}", 
                            i, msg.getRole(), msg.getTimestamp(), 
                            msg.getContent() != null ? msg.getContent().length() : 0);
                }
                
                // 将对话序列化并保存
                String serializedText = serializeMessages(request.getConversations());
                conversation.setConversationText(serializedText);
                conversationMapper.updateConversation(conversation);
                log.info("已成功更新会话 {} 的对话记录，序列化后长度为 {}", sessionId, serializedText.length());
            } catch (Exception e) {
                log.error("保存对话记录失败", e);
                return Result.error("保存对话记录失败: " + e.getMessage());
            }
        } else {
            log.warn("保存对话：请求中未包含对话消息");
        }
        
        // 更新面试轮次状态
        try {
            boolean updated = false;
            if (request.getStatus() != null) {
                round.setStatus(request.getStatus());
                updated = true;
                log.info("更新会话 {} 状态为: {}", sessionId, request.getStatus());
            }
            if (request.getResult() != null) {
                round.setResult(request.getResult());
                updated = true;
                log.info("更新会话 {} 结果为: {}", sessionId, request.getResult());
            }
            if (request.getNotes() != null) {
                round.setNotes(request.getNotes());
                updated = true;
                log.info("更新会话 {} 备注信息", sessionId);
            }
            
            if (updated) {
                interviewRoundMapper.update(round);
                log.info("已更新面试轮次 {} 的信息", round.getId());
            }
        } catch (Exception e) {
            log.error("更新面试轮次信息失败", e);
            return Result.error("更新面试轮次信息失败: " + e.getMessage());
        }
        
        // 生成面试总结（如果需要）
        String summary = null;
        if (request.isRequestSummary()) {
            try {
                log.info("开始生成会话 {} 的面试总结", sessionId);
                summary = generateInterviewSummary(interview, round, request.getConversations());
                log.info("已成功生成面试总结，长度为 {}", summary.length());
            } catch (Exception e) {
                log.error("生成面试总结失败", e);
                // 继续执行，不因总结生成失败而中断整个保存流程
            }
        }
        
        // 清理内存中的会话上下文
        sessionContexts.remove(sessionId);
        log.info("已清理会话 {} 的内存上下文", sessionId);
        
        // 返回结果
        Map<String, Object> data = new HashMap<>();
        data.put("interviewId", interview.getId());
        data.put("roundId", round.getId());
        data.put("status", round.getStatus());
        data.put("result", round.getResult());
        if (summary != null) {
            data.put("summary", summary);
        }
        
        log.info("会话 {} 保存完成", sessionId);
        return Result.success(data);
    }
    
    /**
     * 处理对话列表中的时间戳
     * 确保所有消息都有有效的时间戳，并按时间顺序排序
     */
    private void processConversationTimestamps(List<ConversationMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            log.warn("处理时间戳时收到空消息列表");
            return;
        }
        
        log.info("开始处理 {} 条消息的时间戳", messages.size());
        int fixedCount = 0;
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime defaultTime = now.minusMinutes(messages.size()); // 为没有时间戳的消息设置一个递增的默认时间
        
        for (ConversationMessage message : messages) {
            // 检查消息完整性
            if (message.getRole() == null || message.getContent() == null) {
                log.warn("发现不完整的消息: role={}, content={}",
                        message.getRole(), message.getContent() != null ? "有内容" : "无内容");
            }
            
            // 如果时间戳为null，设置一个默认的时间戳
            if (message.getTimestamp() == null) {
                message.setTimestamp(defaultTime);
                defaultTime = defaultTime.plusMinutes(1); // 每条消息间隔1分钟
                fixedCount++;
                
                log.debug("为消息设置默认时间戳: role={}, time={}, content={}", 
                         message.getRole(), message.getTimestamp(),
                         message.getContent() != null && message.getContent().length() > 30 ? 
                         message.getContent().substring(0, 30) + "..." : message.getContent());
            }
        }
        
        if (fixedCount > 0) {
            log.info("已为 {} 条消息设置默认时间戳", fixedCount);
        }
        
        // 可选：按时间戳排序消息
        messages.sort(Comparator.comparing(ConversationMessage::getTimestamp));
        log.info("消息处理完成，按时间戳排序后共 {} 条", messages.size());
    }
    
    /**
     * 生成面试总结
     */
    private String generateInterviewSummary(Interview interview, InterviewRound round, List<ConversationMessage> conversations) {
        try {
            // 构建提示词
            StringBuilder prompt = new StringBuilder();
            prompt.append("请根据以下面试对话，为").append(interview.getCompany())
                  .append("公司的").append(interview.getPosition())
                  .append("岗位第").append(round.getRoundNumber())
                  .append("轮面试生成一份简短的总结，包括候选人表现、技能评估和建议。\n\n对话内容：\n");
            
            // 添加对话内容
            for (ConversationMessage msg : conversations) {
                prompt.append(msg.getRole().equals("user") ? "应聘者: " : "面试官: ");
                prompt.append(msg.getContent()).append("\n");
            }
            
            // 调用通义千问API
            Generation generation = new Generation();
            MessageManager messageManager = new MessageManager(5);
            
            Message systemMsg = Message.builder()
                    .role(Role.SYSTEM.getValue())
                    .content("你是一位专业的HR助手，擅长分析面试结果并生成总结报告。")
                    .build();
            messageManager.add(systemMsg);
            
            Message userMsg = Message.builder()
                    .role(Role.USER.getValue())
                    .content(prompt.toString())
                    .build();
            messageManager.add(userMsg);
            
            QwenParam param = QwenParam.builder()
                    .model(Generation.Models.QWEN_TURBO)
                    .messages(messageManager.get())
                    .apiKey(apiKey)
                    .resultFormat(QwenParam.ResultFormat.MESSAGE)
                    .build();
            
            GenerationResult result = generation.call(param);
            return result.getOutput().getChoices().get(0).getMessage().getContent();
            
        } catch (Exception e) {
            log.error("生成面试总结失败", e);
            return "无法生成面试总结：" + e.getMessage();
        }
    }
} 