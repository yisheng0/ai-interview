package com.interviewspringboot.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 流式响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StreamResponse {
    /**
     * 响应类型
     */
    private String type;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 是否完成
     */
    private boolean finished;
} 