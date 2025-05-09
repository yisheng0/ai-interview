package com.interviewspringboot.controller;

import com.interviewspringboot.pojo.ConversationMessage;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.CreateSessionRequest;
import com.interviewspringboot.pojo.request.SaveConversationRequest;
import com.interviewspringboot.pojo.request.SendMessageRequest;
import com.interviewspringboot.pojo.response.MessageResponse;
import com.interviewspringboot.pojo.response.SessionResponse;
import com.interviewspringboot.service.AIService;
import com.interviewspringboot.utils.ThreadLocalUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.multipart.MultipartFile;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

/**
 * AI面试控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;
    
    /**
     * Tika实例，用于文件内容分析
     */
    private final Tika tika = new Tika();
    
    /**
     * 创建AI会话
     * 
     * @param request 创建会话请求
     * @return 会话响应
     */
    @PostMapping("/session/create")
    public Result<SessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 创建AI会话: interviewId={}, roundId={}", userId, request.getInterviewId(), request.getRoundId());
        return aiService.createSession(userId, request);
    }
    
    /**
     * 发送消息并获取回复，支持可选的文件上传
     * 
     * @param message 消息内容
     * @param file 可选的上传文件
     * @return 消息响应
     */
    @PostMapping("/message/send")
    public Result<MessageResponse> sendMessage(
            @RequestParam("message") String message,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 发送消息: message={}, file={}", userId, message, 
                file != null ? file.getOriginalFilename() : "无文件");
        
        // 创建请求对象
        SendMessageRequest request = new SendMessageRequest();
        // 设置默认会话ID，因为接口不再需要传入sessionId
        request.setSessionId("default-session-" + userId);
        
        // 如果有文件上传，处理文件内容
        if (file != null && !file.isEmpty()) {
            try {
                // 保存文件到临时目录
                Path tempFile = Files.createTempFile("ai-chat-", file.getOriginalFilename());
                Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

                // 提取文件内容
                String fileContent;
                try {
                    fileContent = tika.parseToString(tempFile);
                } catch (TikaException e) {
                    log.error("无法解析文件内容: ", e);
                    throw new RuntimeException("文件内容解析失败: " + e.getMessage());
                }
                String mimeType = tika.detect(tempFile);

                // 构建带有文件内容的提示信息
                String prompt = String.format("""
                    用户发送了一个文件，类型是：%s
                    文件内容如下：
                    ---
                    %s
                    ---
                    %s
                    
                    请理解文件内容，并结合用户的问题进行回答。
                    """, 
                    mimeType,
                    fileContent.substring(0, Math.min(fileContent.length(), 2000)),
                    message);

                // 删除临时文件
                Files.deleteIfExists(tempFile);
                
                // 设置处理后的消息
                request.setMessage(prompt);
                
            } catch (IOException e) {
                log.error("文件处理失败: ", e);
                throw new RuntimeException("文件处理失败: " + e.getMessage());
            }
        } else {
            // 无文件上传，直接设置消息
            request.setMessage(message);
        }
        
        return aiService.sendMessage(userId, request);
    }
    
    /**
     * 获取对话历史
     * 
     * @param sessionId 会话ID
     * @return 对话消息列表
     */
    @GetMapping("/conversation/{sessionId}")
    public Result<List<ConversationMessage>> getConversationHistory(@PathVariable String sessionId) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 获取对话历史: sessionId={}", userId, sessionId);
        return aiService.getConversationHistory(userId, sessionId);
    }
    
    /**
     * 流式对话接口
     * 
     * @param sessionId 会话ID
     * @param request 包含消息内容的请求体
     * @return SSE发射器
     */
    @PostMapping(value = "/conversation/{sessionId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@PathVariable String sessionId, @RequestBody Map<String, String> request) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        String message = request.get("message");
        log.info("用户 {} 请求流式对话: sessionId={}, message={}", userId, sessionId, message);
        
        return aiService.streamChat(userId, sessionId, message);
    }
    
    /**
     * 保存面试对话并完成会话
     * 
     * @param sessionId 会话ID
     * @param request 保存对话请求
     * @return 保存结果
     */
    @PostMapping("/conversation/{sessionId}/save")
    public Result<Map<String, Object>> saveConversation(@PathVariable String sessionId, @RequestBody SaveConversationRequest request) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 保存面试对话: sessionId={}, status={}", userId, sessionId, request.getStatus());
        return aiService.saveConversation(userId, sessionId, request);
    }
} 