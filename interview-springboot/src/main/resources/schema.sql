-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
  `password_hash` VARCHAR(128) NOT NULL COMMENT '密码哈希',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 简历表
CREATE TABLE IF NOT EXISTS `resume` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `name` VARCHAR(64) COMMENT '姓名',
  `phone` VARCHAR(20) COMMENT '电话',
  `email` VARCHAR(128) COMMENT '邮箱',
  `education` JSON COMMENT '教育经历JSON',
  `work_experience` JSON COMMENT '工作经验/项目经验JSON',
  `skills` JSON COMMENT '技能列表JSON',
  `self_description` TEXT COMMENT '自我介绍',
  `resume_file_url` VARCHAR(256) COMMENT '原始简历文件链接',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_resume_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 面试主表
CREATE TABLE IF NOT EXISTS `interview` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE COMMENT '面试唯一业务标识',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `resume_id` BIGINT COMMENT '关联的简历ID',
  `company` VARCHAR(64) NOT NULL COMMENT '面试公司',
  `position` VARCHAR(64) NOT NULL COMMENT '面试岗位',
  `description` TEXT COMMENT '岗位介绍',
  `status` VARCHAR(16) NOT NULL DEFAULT 'ONGOING' COMMENT '整体状态：ONGOING/COMPLETED/FAILED',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_interview_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_interview_resume` FOREIGN KEY (`resume_id`) REFERENCES `resume` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 面试轮次表
CREATE TABLE IF NOT EXISTS `interview_round` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `interview_id` BIGINT NOT NULL COMMENT '关联的面试ID',
  `round_number` INT NOT NULL COMMENT '面试轮次：1=一面，2=二面',
  `scheduled_time` DATETIME NOT NULL COMMENT '计划面试时间',
  `session_id` VARCHAR(64) COMMENT 'AI会话ID',
  `status` VARCHAR(16) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING/ONGOING/COMPLETED/FAILED',
  `result` VARCHAR(16) COMMENT '结果：PASS/FAIL',
  `notes` TEXT COMMENT '面试笔记',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_round_interview` FOREIGN KEY (`interview_id`) REFERENCES `interview` (`id`),
  CONSTRAINT `uk_interview_round` UNIQUE (`interview_id`, `round_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 面试对话记录
CREATE TABLE IF NOT EXISTS `interview_conversation` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `interview_id` BIGINT NOT NULL COMMENT '关联的面试ID',
  `round_id` BIGINT NOT NULL COMMENT '关联面试轮次ID',
  `session_id` VARCHAR(64) NOT NULL COMMENT '会话ID',
  `conversation_text` JSON COMMENT '对话记录JSON',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_conversation_round` FOREIGN KEY (`round_id`) REFERENCES `interview_round` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 