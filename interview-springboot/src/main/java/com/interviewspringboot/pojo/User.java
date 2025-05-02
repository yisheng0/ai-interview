package com.interviewspringboot.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
public class User {
    
    /**
     * 用户ID
     */
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码哈希
     * JsonIgnore注解确保密码不会在JSON响应中返回
     */
    @JsonIgnore
    private String passwordHash;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}
