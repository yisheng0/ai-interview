package com.interviewspringboot.pojo.request;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 创建面试请求DTO
 */
@Data
public class CreateInterviewRequest {
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
     * 第一轮面试计划时间
     */
    private LocalDateTime scheduledTime;
} 