package com.interviewspringboot.service;

import com.interviewspringboot.pojo.LoginRequest;
import com.interviewspringboot.pojo.LoginResponse;
import com.interviewspringboot.pojo.User;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户对象，不存在则返回null
     */
    User findByUsername(String username);
    
    /**
     * 注册新用户
     * @param username 用户名
     * @param password 密码（明文）
     * @return 注册成功的用户对象
     */
    User register(String username, String password);
    
    /**
     * 验证用户密码
     * @param password 明文密码
     * @param passwordHash 密码哈希
     * @return 验证是否通过
     */
    boolean verifyPassword(String password, String passwordHash);
    
    /**
     * 处理用户登录或注册
     * @param loginRequest 登录/注册请求
     * @return 登录/注册响应结果，包含用户信息和JWT令牌
     */
    LoginResponse loginOrRegister(LoginRequest loginRequest);
}
