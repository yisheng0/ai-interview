package com.interviewspringboot.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 会话响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    /**
     * 会话ID
     */
    private String sessionId;
} 