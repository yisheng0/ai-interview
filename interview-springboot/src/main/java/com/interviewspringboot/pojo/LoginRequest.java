package com.interviewspringboot.pojo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录/注册请求参数
 */
@Data
public class LoginRequest {
    
    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    private String password;
} 