package com.interviewspringboot.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 对话消息实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConversationMessage {
    /**
     * 消息角色：用户或助手
     */
    private String role;
    
    /**
     * 消息内容
     */
    private String content;
    
    /**
     * 消息时间戳
     * 多种格式注解确保可以处理不同格式的时间表示
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", shape = JsonFormat.Shape.STRING)
    @JsonProperty(required = false)
    private LocalDateTime timestamp;
    
    /**
     * 两参数的构造函数，自动设置当前时间戳
     */
    public ConversationMessage(String role, String content) {
        this.role = role;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
} 