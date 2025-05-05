package com.interviewspringboot.pojo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 发送消息请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 消息内容
     */
    private String message;
    
    /**
     * 可选的语音文件URL
     */
    private String audioUrl;
} 