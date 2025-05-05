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
     * 发送消息并获取回复
     * 
     * @param request 发送消息请求
     * @return 消息响应
     */
    @PostMapping("/message/send")
    public Result<MessageResponse> sendMessage(@RequestBody SendMessageRequest request) {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> userMap = ThreadLocalUtil.get();
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 发送消息: sessionId={}, message={}", userId, request.getSessionId(), request.getMessage());
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