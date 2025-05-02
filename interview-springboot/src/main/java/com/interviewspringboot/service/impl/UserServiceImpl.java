package com.interviewspringboot.service.impl;

import com.interviewspringboot.mapper.UserMapper;
import com.interviewspringboot.pojo.LoginRequest;
import com.interviewspringboot.pojo.LoginResponse;
import com.interviewspringboot.pojo.User;
import com.interviewspringboot.service.UserService;
import com.interviewspringboot.utils.JwtUtil;
import com.interviewspringboot.utils.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
    
    @Override
    public User register(String username, String password) {
        // 创建新用户对象
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(MD5Util.encrypt(password));
        
        // 保存用户到数据库
        userMapper.insert(user);
        
        return user;
    }
    
    @Override
    public boolean verifyPassword(String password, String passwordHash) {
        return MD5Util.encrypt(password).equals(passwordHash);
    }
    
    @Override
    public LoginResponse loginOrRegister(LoginRequest loginRequest) {
        // 从请求中获取用户名和密码
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        
        // 根据用户名查询用户
        User user = findByUsername(username);
        boolean isNewUser = false;
        
        // 用户不存在，执行注册
        if (user == null) {
            user = register(username, password);
            isNewUser = true;
        } 
        // 用户存在但密码不正确，抛出异常
        else if (!verifyPassword(password, user.getPasswordHash())) {
            throw new RuntimeException("密码错误");
        }
        
        // 生成JWT令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        String token = jwtUtil.genToken(claims);
        
        // 构建登录响应
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                token,
                isNewUser
        );
    }
}
