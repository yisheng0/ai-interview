package com.interviewspringboot.pojo;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 面试轮次实体类
 */
@Data
public class InterviewRound {
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 关联的面试ID
     */
    private Long interviewId;
    
    /**
     * 面试轮次：1=一面，2=二面
     */
    private Integer roundNumber;
    
    /**
     * 计划面试时间
     */
    private LocalDateTime scheduledTime;
    
    /**
     * AI会话ID
     */
    private String sessionId;
    
    /**
     * 状态：PENDING/ONGOING/COMPLETED/FAILED
     */
    private String status;
    
    /**
     * 结果：PASS/FAIL
     */
    private String result;
    
    /**
     * 面试笔记
     */
    private String notes;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
} 