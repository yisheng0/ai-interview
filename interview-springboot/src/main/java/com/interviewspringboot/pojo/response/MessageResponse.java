package com.interviewspringboot.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * 消息响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    /**
     * AI回复内容
     */
    private String reply;
    
    /**
     * 是否包含图片分析
     */
    private Boolean containsImageAnalysis;
    
    /**
     * 图片分析结果
     */
    private ImageAnalysis imageAnalysis;
    
    /**
     * 图片分析结果内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageAnalysis {
        /**
         * 识别出的文本
         */
        private String recognizedText;
        
        /**
         * 额外信息
         */
        private Map<String, Object> additionalInfo;
    }
} 