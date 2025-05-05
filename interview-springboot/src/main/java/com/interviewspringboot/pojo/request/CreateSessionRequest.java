package com.interviewspringboot.pojo.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 创建AI会话请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionRequest {
    /**
     * 面试ID
     */
    private Long interviewId;
    
    /**
     * 轮次ID
     */
    private Long roundId;
} 