package com.interviewspringboot.service;

import com.interviewspringboot.pojo.Resume;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.ResumeRequest;

import java.util.List;

/**
 * 简历服务接口
 */
public interface ResumeService {
    
    /**
     * 保存简历（创建或更新）
     * 
     * @param userId 用户ID
     * @param request 简历请求对象
     * @return 操作结果
     */
    Result<Resume> saveResume(Long userId, ResumeRequest request);
    
    /**
     * 获取简历详情
     * 
     * @param userId 用户ID
     * @param id 简历ID
     * @return 简历详情结果
     */
    Result<Resume> getResumeDetail(Long userId, Long id);
    
    /**
     * 获取用户简历列表
     * 
     * @param userId 用户ID
     * @return 简历列表结果
     */
    Result<List<Resume>> getResumeList(Long userId);
    
    /**
     * 删除简历
     * 
     * @param userId 用户ID
     * @param id 简历ID
     * @return 操作结果
     */
    Result<Void> deleteResume(Long userId, Long id);
} 