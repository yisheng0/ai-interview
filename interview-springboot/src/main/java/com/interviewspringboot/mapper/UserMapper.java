package com.interviewspringboot.mapper;

import com.interviewspringboot.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

/**
 * 用户数据访问接口
 */
@Mapper
public interface UserMapper {
    
    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户对象，不存在则返回null
     */
    @Select("SELECT id, username, password_hash as passwordHash, created_at as createdAt FROM users WHERE username = #{username}")
    User findByUsername(String username);
    
    /**
     * 新增用户
     * @param user 用户对象
     * @return 影响的行数
     */
    @Insert("INSERT INTO users(username, password_hash, created_at) VALUES(#{username}, #{passwordHash}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
} 