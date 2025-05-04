package com.interviewspringboot.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewspringboot.mapper.ResumeMapper;
import com.interviewspringboot.pojo.Resume;
import com.interviewspringboot.pojo.Result;
import com.interviewspringboot.pojo.request.ResumeRequest;
import com.interviewspringboot.service.ResumeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 简历服务实现类
 */
@Service
@Slf4j
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;
    
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 保存简历（创建或更新）
     *
     * @param userId 用户ID
     * @param request 简历请求对象
     * @return 操作结果
     */
    @Override
    public Result<Resume> saveResume(Long userId, ResumeRequest request) {
        try {
            // 将请求对象转换为实体对象
            Resume resume = new Resume();
            resume.setUserId(userId);
            resume.setName(request.getName());
            resume.setPhone(request.getPhone());
            resume.setEmail(request.getEmail());
            resume.setSelfDescription(request.getSelfDescription());
            resume.setResumeFileUrl(request.getResumeFileUrl());
            
            // 将复杂对象转换为JSON字符串
            if (request.getEducation() != null) {
                resume.setEducation(objectMapper.writeValueAsString(request.getEducation()));
            }
            
            if (request.getWorkExperience() != null) {
                resume.setWorkExperience(objectMapper.writeValueAsString(request.getWorkExperience()));
            }
            
            if (request.getSkills() != null) {
                resume.setSkills(objectMapper.writeValueAsString(request.getSkills()));
            }
            
            // 根据是否有ID判断是新增还是更新
            if (request.getId() != null) {
                // 更新操作
                resume.setId(request.getId());
                
                // 先检查简历是否存在且属于当前用户
                Resume existingResume = resumeMapper.selectById(request.getId());
                if (existingResume == null) {
                    return Result.error(404, "简历不存在");
                }
                
                if (!existingResume.getUserId().equals(userId)) {
                    return Result.error(403, "无权修改他人简历");
                }
                
                // 执行更新
                resumeMapper.update(resume);
            } else {
                // 新增操作
                resumeMapper.insert(resume);
            }
            
            // 查询最新数据
            Resume updatedResume = resumeMapper.selectById(resume.getId());
            return Result.success(updatedResume);
        } catch (JsonProcessingException e) {
            log.error("JSON处理异常", e);
            return Result.error(500, "数据处理错误");
        } catch (Exception e) {
            log.error("保存简历异常", e);
            return Result.error(500, "服务器内部错误: " + e.getMessage());
        }
    }

    /**
     * 获取简历详情
     *
     * @param userId 用户ID
     * @param id 简历ID
     * @return 简历详情结果
     */
    @Override
    public Result<Resume> getResumeDetail(Long userId, Long id) {
        try {
            Resume resume = resumeMapper.selectById(id);
            if (resume == null) {
                return Result.error(404, "简历不存在");
            }
            
            // 检查权限
            if (!resume.getUserId().equals(userId)) {
                return Result.error(403, "无权查看他人简历");
            }
            
            return Result.success(resume);
        } catch (Exception e) {
            log.error("获取简历详情异常", e);
            return Result.error(500, "服务器内部错误: " + e.getMessage());
        }
    }

    /**
     * 获取用户简历列表
     *
     * @param userId 用户ID
     * @return 简历列表结果
     */
    @Override
    public Result<List<Resume>> getResumeList(Long userId) {
        try {
            List<Resume> resumes = resumeMapper.selectByUserId(userId);
            return Result.success(resumes);
        } catch (Exception e) {
            log.error("获取简历列表异常", e);
            return Result.error(500, "服务器内部错误: " + e.getMessage());
        }
    }

    /**
     * 删除简历
     *
     * @param userId 用户ID
     * @param id 简历ID
     * @return 操作结果
     */
    @Override
    public Result<Void> deleteResume(Long userId, Long id) {
        try {
            // 检查简历是否存在
            Resume resume = resumeMapper.selectById(id);
            if (resume == null) {
                return Result.error(404, "简历不存在");
            }
            
            // 检查权限
            if (!resume.getUserId().equals(userId)) {
                return Result.error(403, "无权删除他人简历");
            }
            
            // 执行删除
            resumeMapper.deleteById(id, userId);
            return Result.success();
        } catch (Exception e) {
            log.error("删除简历异常", e);
            return Result.error(500, "服务器内部错误: " + e.getMessage());
        }
    }
} 