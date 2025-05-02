package com.interviewspringboot.controller;

import com.interviewspringboot.pojo.LoginRequest;
import com.interviewspringboot.pojo.LoginResponse;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.User;
import com.interviewspringboot.service.UserService;
import com.interviewspringboot.utils.ThreadLocalUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户登录或注册
     */
    @PostMapping("/loginOrRegister")
    public Result<LoginResponse> loginOrRegister(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            // 调用服务层处理登录或注册
            LoginResponse loginResponse = userService.loginOrRegister(loginRequest);
            
            // 返回成功响应
            String message = loginResponse.getIsNewUser() ? "注册成功" : "登录成功";
            return Result.success(message, loginResponse);
        } catch (Exception e) {
            // 处理异常
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/userInfo")
    public Result<User> userInfo() {
        // 从ThreadLocal中获取用户信息
        Map<String, Object> claims = ThreadLocalUtil.get();
        String username = (String) claims.get("username");
        
        // 查询用户信息
        User user = userService.findByUsername(username);
        
        // 返回成功响应
        return Result.success(user);
    }
} 