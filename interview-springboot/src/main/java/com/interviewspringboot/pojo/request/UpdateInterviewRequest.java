package com.interviewspringboot.pojo.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 更新面试请求DTO
 */
@Data
public class UpdateInterviewRequest {
    /**
     * 面试ID
     */
    private Long id;
    
    /**
     * 面试公司
     */
    private String company;
    
    /**
     * 面试岗位
     */
    private String position;
    
    /**
     * 岗位描述
     */
    private String description;
    
    /**
     * 关联的简历ID
     */
    private Long resumeId;
    
    /**
     * 面试状态：ONGOING/COMPLETED/FAILED
     */
    private String status;
    
    /**
     * 面试轮次列表
     */
    private List<InterviewRoundRequest> rounds;
    
    /**
     * 面试轮次请求DTO
     */
    @Data
    public static class InterviewRoundRequest {
        /**
         * 轮次ID(更新已有轮次时必传)
         */
        private Long id;
        
        /**
         * 计划面试时间
         */
        private LocalDateTime scheduledTime;
        
        /**
         * 轮次状态：PENDING/ONGOING/COMPLETED/FAILED
         */
        private String status;
    }
} 