package com.interviewspringboot.pojo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 面试实体类
 */
@Data
public class Interview {
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 面试唯一业务标识
     */
    private String uuid;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 关联的简历ID
     */
    private Long resumeId;
    
    /**
     * 面试公司
     */
    private String company;
    
    /**
     * 面试岗位
     */
    private String position;
    
    /**
     * 岗位介绍
     */
    private String description;
    
    /**
     * 整体状态：ONGOING/COMPLETED/FAILED
     */
    private String status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 面试轮次列表（非数据库字段）
     */
    private List<InterviewRound> rounds;
} 