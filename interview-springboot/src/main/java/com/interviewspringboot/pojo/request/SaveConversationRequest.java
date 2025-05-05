package com.interviewspringboot.pojo.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.interviewspringboot.pojo.ConversationMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 保存面试对话请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveConversationRequest {
    /**
     * 面试状态：COMPLETED/FAILED
     */
    private String status;
    
    /**
     * 面试结果：PASS/FAIL
     */
    private String result;
    
    /**
     * 面试笔记
     */
    private String notes;
    
    /**
     * 完整的对话记录数组
     * 注意：发送和接收时可能有不同格式的时间戳
     */
    private List<ConversationMessage> conversations;
    
    /**
     * 是否请求AI生成面试总结
     */
    private boolean requestSummary;
} 