package com.interviewspringboot.pojo.request;

import lombok.Data;
import java.util.List;

/**
 * 简历请求DTO
 */
@Data
public class ResumeRequest {
    /**
     * 简历ID(更新时必传)
     */
    private Long id;
    
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
     * 教育经历
     */
    private List<Education> education;
    
    /**
     * 工作经验
     */
    private List<WorkExperience> workExperience;
    
    /**
     * 技能列表
     */
    private List<String> skills;
    
    /**
     * 自我介绍
     */
    private String selfDescription;
    
    /**
     * 原始简历文件链接
     */
    private String resumeFileUrl;
    
    /**
     * 教育经历
     */
    @Data
    public static class Education {
        /**
         * 学校名称
         */
        private String school;
        
        /**
         * 专业
         */
        private String major;
        
        /**
         * 学位
         */
        private String degree;
        
        /**
         * 开始日期
         */
        private String startDate;
        
        /**
         * 结束日期
         */
        private String endDate;
    }
    
    /**
     * 工作经验
     */
    @Data
    public static class WorkExperience {
        /**
         * 公司名称
         */
        private String company;
        
        /**
         * 职位
         */
        private String position;
        
        /**
         * 开始日期
         */
        private String startDate;
        
        /**
         * 结束日期
         */
        private String endDate;
        
        /**
         * 工作描述
         */
        private String description;
    }
} 