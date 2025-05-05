package com.interviewspringboot.service;

import com.interviewspringboot.pojo.ConversationMessage;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.CreateSessionRequest;
import com.interviewspringboot.pojo.request.SaveConversationRequest;
import com.interviewspringboot.pojo.request.SendMessageRequest;
import com.interviewspringboot.pojo.response.MessageResponse;
import com.interviewspringboot.pojo.response.SessionResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

/**
 * AI服务接口
 */
public interface AIService {
    
    /**
     * 创建AI会话
     * 
     * @param userId 用户ID
     * @param request 创建会话请求
     * @return 会话响应
     */
    Result<SessionResponse> createSession(Long userId, CreateSessionRequest request);
    
    /**
     * 发送消息并获取回复
     * 
     * @param userId 用户ID
     * @param request 发送消息请求
     * @return 消息响应
     */
    Result<MessageResponse> sendMessage(Long userId, SendMessageRequest request);
    
    /**
     * 获取对话历史
     * 
     * @param userId 用户ID
     * @param sessionId 会话ID
     * @return 对话消息列表
     */
    Result<List<ConversationMessage>> getConversationHistory(Long userId, String sessionId);
    
    /**
     * 流式对话
     * 
     * @param userId 用户ID
     * @param sessionId 会话ID
     * @param message 消息内容
     * @return SSE发射器
     */
    SseEmitter streamChat(Long userId, String sessionId, String message);
    
    /**
     * 保存面试对话并完成会话
     * 
     * @param userId 用户ID
     * @param sessionId 会话ID
     * @param request 保存对话请求
     * @return 保存结果
     */
    Result<Map<String, Object>> saveConversation(Long userId, String sessionId, SaveConversationRequest request);
} 