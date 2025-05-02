package com.interviewspringboot.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一响应结果类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    /**
     * 状态码
     */
    private Integer code;
    
    /**
     * 提示信息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 成功响应
     */
    public static <E> Result<E> success() {
        return new Result<>(200, "成功", null);
    }
    
    /**
     * 成功响应（带数据）
     */
    public static <E> Result<E> success(E data) {
        return new Result<>(200, "成功", data);
    }
    
    /**
     * 成功响应（带消息和数据）
     */
    public static <E> Result<E> success(String message, E data) {
        return new Result<>(200, message, data);
    }
    
    /**
     * 失败响应
     */
    public static <E> Result<E> error(String message) {
        return new Result<>(500, message, null);
    }
    
    /**
     * 失败响应（带状态码）
     */
    public static <E> Result<E> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}
