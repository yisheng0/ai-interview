package com.interviewspringboot.mapper;

import com.interviewspringboot.pojo.Interview;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 面试Mapper接口
 */
@Mapper
public interface InterviewMapper {
    
    /**
     * 插入面试记录
     * 
     * @param interview 面试对象
     * @return 影响的行数
     */
    @Insert("INSERT INTO interview (uuid, user_id, resume_id, company, position, description, status) " +
            "VALUES (#{uuid}, #{userId}, #{resumeId}, #{company}, #{position}, #{description}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Interview interview);
    
    /**
     * 根据用户ID查询面试列表
     * 
     * @param userId 用户ID
     * @return 面试列表
     */
    @Select("SELECT * FROM interview WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Interview> selectByUserId(Long userId);
    
    /**
     * 根据ID查询面试
     * 
     * @param id 面试ID
     * @return 面试对象
     */
    @Select("SELECT * FROM interview WHERE id = #{id}")
    Interview selectById(Long id);
    
    /**
     * 更新面试信息
     * 
     * @param interview 面试对象
     * @return 影响的行数
     */
    @Update("UPDATE interview SET company = #{company}, position = #{position}, " +
            "description = #{description}, resume_id = #{resumeId}, status = #{status} " +
            "WHERE id = #{id}")
    int update(Interview interview);
    
    /**
     * 删除面试
     * 
     * @param id 面试ID
     * @return 影响的行数
     */
    @Delete("DELETE FROM interview WHERE id = #{id}")
    int deleteById(Long id);
} 