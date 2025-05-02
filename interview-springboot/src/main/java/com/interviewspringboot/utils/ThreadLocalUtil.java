package com.interviewspringboot.utils;

/**
 * ThreadLocal工具类，用于存储和获取当前线程的数据
 */
public class ThreadLocalUtil {
    
    private static final ThreadLocal<Object> THREAD_LOCAL = new ThreadLocal<>();
    
    /**
     * 获取当前线程的数据
     */
    @SuppressWarnings("unchecked")
    public static <T> T get() {
        return (T) THREAD_LOCAL.get();
    }
    
    /**
     * 设置当前线程的数据
     */
    public static void set(Object value) {
        THREAD_LOCAL.set(value);
    }
    
    /**
     * 清除当前线程的数据，防止内存泄漏
     */
    public static void remove() {
        THREAD_LOCAL.remove();
    }
}
