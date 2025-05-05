package com.interviewspringboot.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 面试对话记录实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewConversation {
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 关联的面试ID
     */
    private Long interviewId;
    
    /**
     * 关联的面试轮次ID
     */
    private Long roundId;
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 对话记录JSON字符串
     */
    private String conversationText;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
} 