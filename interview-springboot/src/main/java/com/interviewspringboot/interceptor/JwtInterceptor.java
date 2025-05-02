package com.interviewspringboot.interceptor;

import com.interviewspringboot.utils.JwtUtil;
import com.interviewspringboot.utils.ThreadLocalUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

/**
 * JWT拦截器，用于验证请求中的JWT令牌
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 从请求头中获取Authorization
        String token = request.getHeader("Authorization");
        
        // 验证token格式
        if (!StringUtils.hasLength(token) || !token.startsWith("Bearer ")) {
            // 令牌格式不正确，返回401
            response.setStatus(401);
            return false;
        }
        
        // 提取令牌内容
        token = token.substring(7);
        
        try {
            // 验证并解析令牌
            Map<String, Object> claims = jwtUtil.parseToken(token);
            
            // 将用户信息存入ThreadLocal
            ThreadLocalUtil.set(claims);
            
            // 允许请求继续
            return true;
        } catch (Exception e) {
            // 令牌验证失败，返回401
            response.setStatus(401);
            return false;
        }
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 清除ThreadLocal数据，防止内存泄漏
        ThreadLocalUtil.remove();
    }
} 