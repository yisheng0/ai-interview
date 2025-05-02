package com.interviewspringboot.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String key;
    
    @Value("${jwt.expire}")
    private long expire;

    /**
     * 生成JWT令牌
     * @param claims 要存储在令牌中的数据
     * @return JWT令牌字符串
     */
    public String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + expire * 1000))
                .sign(Algorithm.HMAC256(key));
    }

    /**
     * 解析JWT令牌
     * @param token JWT令牌字符串
     * @return 存储在令牌中的数据
     */
    public Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(key))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }
}
