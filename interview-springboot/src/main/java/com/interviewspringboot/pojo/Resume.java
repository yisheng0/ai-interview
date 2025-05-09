package com.interviewspringboot.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 简历实体类
 */
@Data
public class Resume {
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 姓名
     */
    private String name;
    
    /**
     * 电话
     */
    private String phone;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 教育经历JSON
     */
    private String education;
    
    /**
     * 工作经验JSON
     */
    private String workExperience;
    
    /**
     * 技能列表JSON
     */
    private String skills;
    
    /**
     * 自我介绍
     */
    private String selfDescription;
    
    /**
     * 原始简历文件链接
     */
    private String resumeFileUrl;
    
    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;
} 