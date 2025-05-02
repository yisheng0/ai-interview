package com.interviewspringboot.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5密码加密工具类
 */
public class MD5Util {
    /**
     * 默认的密码字符串组合，用来将字节转换成16进制表示的字符
     */
    private static final char[] hexDigits = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    private static MessageDigest md;

    static {
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5工具类初始化失败", e);
        }
    }

    /**
     * 生成字符串的MD5值
     * @param str 要加密的字符串
     * @return 字符串的MD5值
     */
    public static String encrypt(String str) {
        if (str == null) {
            return null;
        }
        
        try {
            byte[] bytes = str.getBytes("UTF-8");
            md.update(bytes);
            return bytesToHex(md.digest());
        } catch (Exception e) {
            throw new RuntimeException("MD5加密失败", e);
        }
    }

    /**
     * 将字节数组转换为16进制字符串
     * @param bytes 字节数组
     * @return 16进制字符串
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(hexDigits[(b >> 4) & 0xf]);
            sb.append(hexDigits[b & 0xf]);
        }
        return sb.toString();
    }
} 