package com.interviewspringboot.controller;

import com.interviewspringboot.pojo.Resume;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.ResumeRequest;
import com.interviewspringboot.service.ResumeService;
import com.interviewspringboot.utils.ThreadLocalUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 简历控制器
 */
@RestController
@RequestMapping("/api/resume")
@Slf4j
public class ResumeController {
    
    @Autowired
    private ResumeService resumeService;
    
    /**
     * 保存简历（创建或更新）
     * 
     * @param request 简历请求对象
     * @return 操作结果
     */
    @PostMapping("/save")
    public Result<Resume> saveResume(@RequestBody ResumeRequest request) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 保存简历", userId);
        return resumeService.saveResume(userId, request);
    }
    
    /**
     * 获取简历详情
     * 
     * @param id 简历ID
     * @return 简历详情结果
     */
    @GetMapping("/{id}")
    public Result<Resume> getResumeDetail(@PathVariable Long id) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 获取简历详情: id={}", userId, id);
        return resumeService.getResumeDetail(userId, id);
    }
    
    /**
     * 获取用户简历列表
     * 
     * @return 简历列表结果
     */
    @GetMapping("/list")
    public Result<List<Resume>> getResumeList() {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 获取简历列表", userId);
        return resumeService.getResumeList(userId);
    }
    
    /**
     * 删除简历
     * 
     * @param id 简历ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<Void> deleteResume(@PathVariable Long id) {
        // 从ThreadLocal中获取用户信息Map
        Map<String, Object> userMap = ThreadLocalUtil.get();
        // 从Map中获取用户ID，键名为"userId"
        Long userId = Long.valueOf(userMap.get("userId").toString());
        
        log.info("用户 {} 删除简历: id={}", userId, id);
        return resumeService.deleteResume(userId, id);
    }
} 