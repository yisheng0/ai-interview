package com.interviewspringboot.controller;

import com.interviewspringboot.pojo.Interview;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.CreateInterviewRequest;
import com.interviewspringboot.pojo.request.UpdateInterviewRequest;
import com.interviewspringboot.service.InterviewService;
import com.interviewspringboot.utils.ThreadLocalUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 面试控制器
 */
@RestController
@RequestMapping("/api/interview")
@Slf4j
public class InterviewController {
    
    @Autowired
    private InterviewService interviewService;
    
    /**
     * 创建面试
     * 
     * @param request 创建面试请求
     * @return 操作结果
     */
    @PostMapping("/create")
    public Result<Interview> createInterview(@RequestBody CreateInterviewRequest request) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 创建面试: 公司={}, 岗位={}", userId, request.getCompany(), request.getPosition());
        return interviewService.createInterview(userId, request);
    }
    
    /**
     * 获取面试列表
     * 
     * @return 面试列表结果
     */
    @GetMapping("/list")
    public Result<List<Interview>> getInterviewList() {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 获取面试列表", userId);
        return interviewService.getInterviewList(userId);
    }
    
    /**
     * 更新面试
     * 
     * @param request 更新面试请求
     * @return 操作结果
     */
    @PostMapping("/update")
    public Result<Interview> updateInterview(@RequestBody UpdateInterviewRequest request) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 更新面试: id={}", userId, request.getId());
        return interviewService.updateInterview(userId, request);
    }
    
    /**
     * 删除面试
     * 
     * @param id 面试ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<Void> deleteInterview(@PathVariable Long id) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 删除面试: id={}", userId, id);
        return interviewService.deleteInterview(userId, id);
    }
    
    /**
     * 删除面试轮次
     * 
     * @param id 面试轮次ID
     * @return 操作结果
     */
    @DeleteMapping("/round/delete/{id}")
    public Result<Void> deleteInterviewRound(@PathVariable Long id) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 删除面试轮次: id={}", userId, id);
        return interviewService.deleteInterviewRound(userId, id);
    }
} 