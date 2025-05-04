package com.interviewspringboot.service;

import com.interviewspringboot.pojo.Interview;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.CreateInterviewRequest;
import com.interviewspringboot.pojo.request.UpdateInterviewRequest;

import java.util.List;

/**
 * 面试服务接口
 */
public interface InterviewService {
    
    /**
     * 创建面试
     * 
     * @param userId 用户ID
     * @param request 创建面试请求
     * @return 操作结果
     */
    Result<Interview> createInterview(Long userId, CreateInterviewRequest request);
    
    /**
     * 获取用户面试列表
     * 
     * @param userId 用户ID
     * @return 面试列表结果
     */
    Result<List<Interview>> getInterviewList(Long userId);
    
    /**
     * 更新面试信息
     * 
     * @param userId 用户ID
     * @param request 更新面试请求
     * @return 操作结果
     */
    Result<Interview> updateInterview(Long userId, UpdateInterviewRequest request);
    
    /**
     * 删除面试
     * 
     * @param userId 用户ID
     * @param interviewId 面试ID
     * @return 操作结果
     */
    Result<Void> deleteInterview(Long userId, Long interviewId);
    
    /**
     * 删除面试轮次
     * 
     * @param userId 用户ID
     * @param roundId 面试轮次ID
     * @return 操作结果
     */
    Result<Void> deleteInterviewRound(Long userId, Long roundId);
} 