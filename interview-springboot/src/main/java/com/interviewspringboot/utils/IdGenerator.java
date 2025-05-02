package com.interviewspringboot.utils;

import java.util.UUID;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 唯一ID生成工具类
 * 提供多种生成唯一标识符的方法
 */
public class IdGenerator {
    
    // 雪花算法相关常量
    private static final long EPOCH = 1714732800000L; // 2024-05-01 作为起始时间戳
    private static final long WORKER_ID_BITS = 5L;
    private static final long DATACENTER_ID_BITS = 5L;
    private static final long SEQUENCE_BITS = 12L;
    
    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);
    private static final long MAX_DATACENTER_ID = ~(-1L << DATACENTER_ID_BITS);
    
    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;
    private static final long DATACENTER_ID_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS + DATACENTER_ID_BITS;
    
    private static final long SEQUENCE_MASK = ~(-1L << SEQUENCE_BITS);
    
    private static long workerId = 1;
    private static long datacenterId = 1;
    private static long sequence = 0L;
    private static long lastTimestamp = -1L;
    
    private static final AtomicLong atomicCounter = new AtomicLong(0);
    
    /**
     * 获取UUID字符串（无连字符）
     * @return 32位UUID字符串
     */
    public static String getUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    /**
     * 获取UUID字符串（带连字符）
     * @return 36位标准UUID字符串
     */
    public static String getUUIDWithHyphen() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * 基于雪花算法生成分布式唯一ID
     * @return 唯一ID
     */
    public synchronized static long nextId() {
        long timestamp = timeGen();
        
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("时钟回拨错误，拒绝生成ID");
        }
        
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & SEQUENCE_MASK;
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        
        return ((timestamp - EPOCH) << TIMESTAMP_SHIFT)
                | (datacenterId << DATACENTER_ID_SHIFT)
                | (workerId << WORKER_ID_SHIFT)
                | sequence;
    }
    
    /**
     * 获取自增序列号（非分布式安全）
     * @return 自增ID
     */
    public static long getIncrement() {
        return atomicCounter.incrementAndGet();
    }
    
    /**
     * 获取基于当前时间的简单唯一ID
     * @return 时间戳+随机数组合的ID字符串
     */
    public static String getSimpleId() {
        return String.valueOf(Instant.now().toEpochMilli()) +
                String.format("%04d", (int)(Math.random() * 10000));
    }
    
    private static long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }
    
    private static long timeGen() {
        return System.currentTimeMillis();
    }
    
    /**
     * 设置工作机器ID
     * @param newWorkerId 工作机器ID (0-31)
     */
    public static void setWorkerId(long newWorkerId) {
        if (newWorkerId > MAX_WORKER_ID || newWorkerId < 0) {
            throw new IllegalArgumentException("工作机器ID不能大于" + MAX_WORKER_ID + "或小于0");
        }
        workerId = newWorkerId;
    }
    
    /**
     * 设置数据中心ID
     * @param newDatacenterId 数据中心ID (0-31)
     */
    public static void setDatacenterId(long newDatacenterId) {
        if (newDatacenterId > MAX_DATACENTER_ID || newDatacenterId < 0) {
            throw new IllegalArgumentException("数据中心ID不能大于" + MAX_DATACENTER_ID + "或小于0");
        }
        datacenterId = newDatacenterId;
    }
}