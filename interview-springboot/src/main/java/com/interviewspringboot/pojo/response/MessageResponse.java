package com.interviewspringboot.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 消息响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    /**
     * AI回复内容
     */
    private String reply;
} 