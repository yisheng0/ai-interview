package com.interviewspringboot.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Slf4j
@Component
public class AliOssUtil {
    
    // 从配置文件中读取配置信息
    private static String ENDPOINT;
    private static String ACCESS_KEY_ID;
    private static String SECRET_ACCESS_KEY;
    private static String BUCKET_NAME;
    
    @Value("${aliyun.oss.endpoint}")
    public void setEndpoint(String endpoint) {
        ENDPOINT = endpoint;
    }
    
    @Value("${aliyun.oss.access-key-id}")
    public void setAccessKeyId(String accessKeyId) {
        ACCESS_KEY_ID = accessKeyId;
    }
    
    @Value("${aliyun.oss.secret-access-key}")
    public void setSecretAccessKey(String secretAccessKey) {
        SECRET_ACCESS_KEY = secretAccessKey;
    }
    
    @Value("${aliyun.oss.bucket-name}")
    public void setBucketName(String bucketName) {
        BUCKET_NAME = bucketName;
    }

    //上传文件,返回文件的公网访问地址
    public static String uploadFile(String objectName, InputStream inputStream) throws Exception {
        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY);
        try {
            // 上传文件
            ossClient.putObject(BUCKET_NAME, objectName, inputStream);
            // 返回访问URL
            return String.format("https://%s.%s/%s", BUCKET_NAME, ENDPOINT, objectName);
        } catch (OSSException oe) {
            log.error("OSS服务异常：", oe);
            throw new Exception("文件上传失败：" + oe.getErrorMessage());
        } catch (ClientException ce) {
            log.error("OSS客户端异常：", ce);
            throw new Exception("文件上传失败：" + ce.getMessage());
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
} 