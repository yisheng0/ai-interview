package com.interviewspringboot.service.impl;

import com.interviewspringboot.mapper.InterviewMapper;
import com.interviewspringboot.mapper.InterviewRoundMapper;
import com.interviewspringboot.pojo.Interview;
import com.interviewspringboot.pojo.InterviewRound;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.CreateInterviewRequest;
import com.interviewspringboot.pojo.request.UpdateInterviewRequest;
import com.interviewspringboot.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 面试服务实现类
 */
@Service
public class InterviewServiceImpl implements InterviewService {

    @Autowired
    private InterviewMapper interviewMapper;
    
    @Autowired
    private InterviewRoundMapper roundMapper;
    
    /**
     * 创建面试
     *
     * @param userId 用户ID
     * @param request 创建面试请求
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Interview> createInterview(Long userId, CreateInterviewRequest request) {
        // 创建面试记录
        Interview interview = new Interview();
        interview.setUserId(userId);
        interview.setUuid(UUID.randomUUID().toString());
        interview.setCompany(request.getCompany());
        interview.setPosition(request.getPosition());
        interview.setDescription(request.getDescription());
        interview.setResumeId(request.getResumeId());
        interview.setStatus("ONGOING"); // 默认状态为进行中
        
        // 插入面试记录
        interviewMapper.insert(interview);
        
        // 创建第一轮面试
        InterviewRound round = new InterviewRound();
        round.setInterviewId(interview.getId());
        round.setRoundNumber(1); // 第一轮
        round.setScheduledTime(request.getScheduledTime());
        round.setStatus("PENDING"); // 默认状态为待面试
        
        // 插入面试轮次
        roundMapper.insert(round);
        
        // 查询面试轮次
        List<InterviewRound> rounds = roundMapper.selectByInterviewId(interview.getId());
        interview.setRounds(rounds);
        
        return Result.success(interview);
    }
    
    /**
     * 获取用户面试列表
     *
     * @param userId 用户ID
     * @return 面试列表结果
     */
    @Override
    public Result<List<Interview>> getInterviewList(Long userId) {
        // 查询用户的所有面试
        List<Interview> interviews = interviewMapper.selectByUserId(userId);
        
        // 填充每个面试的轮次信息
        for (Interview interview : interviews) {
            List<InterviewRound> rounds = roundMapper.selectByInterviewId(interview.getId());
            interview.setRounds(rounds);
        }
        
        return Result.success(interviews);
    }
    
    /**
     * 更新面试信息
     *
     * @param userId 用户ID
     * @param request 更新面试请求
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Interview> updateInterview(Long userId, UpdateInterviewRequest request) {
        // 查询面试信息
        Interview interview = interviewMapper.selectById(request.getId());
        if (interview == null) {
            return Result.error(404, "面试不存在");
        }
        
        // 验证权限
        if (!interview.getUserId().equals(userId)) {
            return Result.error(403, "无权修改此面试");
        }
        
        // 更新面试基本信息
        interview.setCompany(request.getCompany());
        interview.setPosition(request.getPosition());
        interview.setDescription(request.getDescription());
        interview.setResumeId(request.getResumeId());
        interview.setStatus(request.getStatus());
        
        // 更新面试记录
        interviewMapper.update(interview);
        
        // 处理面试轮次
        if (request.getRounds() != null && !request.getRounds().isEmpty()) {
            // 获取当前最大轮次号
            Integer maxRoundNumber = roundMapper.getMaxRoundNumber(interview.getId());
            if (maxRoundNumber == null) {
                maxRoundNumber = 0;
            }
            
            for (UpdateInterviewRequest.InterviewRoundRequest roundRequest : request.getRounds()) {
                if (roundRequest.getId() != null) {
                    // 更新已有轮次
                    InterviewRound round = roundMapper.selectById(roundRequest.getId());
                    if (round != null && round.getInterviewId().equals(interview.getId())) {
                        round.setScheduledTime(roundRequest.getScheduledTime());
                        round.setStatus(roundRequest.getStatus());
                        roundMapper.update(round);
                    }
                } else {
                    // 添加新轮次
                    InterviewRound round = new InterviewRound();
                    round.setInterviewId(interview.getId());
                    round.setRoundNumber(maxRoundNumber + 1); // 新轮次号
                    round.setScheduledTime(roundRequest.getScheduledTime());
                    round.setStatus("PENDING"); // 默认状态为待面试
                    roundMapper.insert(round);
                    maxRoundNumber++; // 更新最大轮次号
                }
            }
        }
        
        // 查询更新后的面试轮次
        List<InterviewRound> rounds = roundMapper.selectByInterviewId(interview.getId());
        interview.setRounds(rounds);
        
        return Result.success(interview);
    }
    
    /**
     * 删除面试
     *
     * @param userId 用户ID
     * @param interviewId 面试ID
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Void> deleteInterview(Long userId, Long interviewId) {
        // 查询面试信息
        Interview interview = interviewMapper.selectById(interviewId);
        if (interview == null) {
            return Result.error(404, "面试不存在");
        }
        
        // 验证权限
        if (!interview.getUserId().equals(userId)) {
            return Result.error(403, "无权删除此面试");
        }
        
        // 先删除面试轮次
        roundMapper.deleteByInterviewId(interviewId);
        
        // 再删除面试
        interviewMapper.deleteById(interviewId);
        
        return Result.success();
    }
    
    /**
     * 删除面试轮次
     *
     * @param userId 用户ID
     * @param roundId 面试轮次ID
     * @return 操作结果
     */
    @Override
    @Transactional
    public Result<Void> deleteInterviewRound(Long userId, Long roundId) {
        // 查询面试轮次
        InterviewRound round = roundMapper.selectById(roundId);
        if (round == null) {
            return Result.error(404, "面试轮次不存在");
        }
        
        // 查询面试信息，验证权限
        Interview interview = interviewMapper.selectById(round.getInterviewId());
        if (interview == null || !interview.getUserId().equals(userId)) {
            return Result.error(403, "无权删除此面试轮次");
        }
        
        // 删除面试轮次
        roundMapper.deleteById(roundId);
        
        return Result.success();
    }
} 