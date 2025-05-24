# **简历与面试系统接口设计**

## **1. 用户认证模块**

### **1.1 用户登录或注册(二合一)**

- **路径**: \`/api/auth/loginOrRegister\`
- **方法**: POST
- **参数**:

```JSON
{
  "username": "用户名",
  "password": "密码"
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "登录/注册成功",
  "data": {
    "userId": "用户ID",
    "username": "用户名",
    "token": "JWT令牌",
    "isNewUser": true // 如果是新注册用户为true，否则为false
  }
}
```

### **1.2 获取当前用户信息**

- **路径**: \`/api/auth/userInfo\`
- **方法**: GET
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": {
    "userId": "用户ID",
    "username": "用户名"
  }
}
```

## **2. 简历模块**

### **2.1 创建/更新简历**

- **路径**: \`/api/resume/save\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

```JSON
{
  "id": "简历ID(更新时必传)",
  "name": "姓名",
  "phone": "电话",
  "email": "邮箱",
  "education": [
    {
      "school": "学校名称",
      "major": "专业",
      "degree": "学位",
      "startDate": "开始日期",
      "endDate": "结束日期"
    }
  ],
  "workExperience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "开始日期",
      "endDate": "结束日期",
      "description": "工作描述"
    }
  ],
  "skills": ["技能1", "技能2"],
  "selfDescription": "自我介绍"
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "保存成功",
  "data": {
    "id": "简历ID",
    "name": "姓名",
    "...": "其他字段"
  }
}
```

### **2.2 获取简历详情**

- **路径**: \`/api/resume/{id}\`
- **方法**: GET
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "简历ID",
    "name": "姓名",
    "...": "其他字段"
  }
}
```

### **2.3 获取用户简历**

- **路径**: \`/api/resume/list\`
- **方法**: GET
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "简历ID",
      "name": "姓名",
      "email": "邮箱",
      "phone": "电话",
      "updatedAt": "更新时间"
    }
  ]
}
```

### **2.4 删除简历**

- **路径**: \`/api/resume/delete/{id}\`
- **方法**: DELETE
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### **2.5 OCR解析简历**

- **路径**: \`/api/resume/ocr\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

* 使用`multipart/form-data`格式
* `file`: 简历文件(PDF)

- **返回**:

```JSON
{
  "code": 200,
  "message": "解析成功",
  "data": {
    "name": "姓名",
    "phone": "电话",
    "email": "邮箱",
    "education": [],
    "workExperience": [],
    "skills": [],
    "selfDescription": "自我介绍"
  }
}
```

## **3. 面试日程模块**

### **3.1 创建面试**

- **路径**: \`/api/interview/create\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

```JSON
{
  "company": "面试公司",
  "position": "面试岗位",
  "description": "岗位描述",
  "resumeId": "关联的简历ID",
  "scheduledTime": "第一轮面试计划时间" // 创建时会自动创建第一轮面试
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "面试ID",
    "uuid": "面试业务标识",
    "company": "面试公司",
    "position": "面试岗位",
    "rounds": [
      {
        "id": "轮次ID",
        "roundNumber": 1, // 第一轮
        "scheduledTime": "计划面试时间",
        "status": "PENDING"
      }
    ]
  }
}
```

### **3.2 获取面试列表（包含详情）**

- **路径**: \`/api/interview/list\`
- **方法**: GET
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "面试ID",
      "company": "面试公司",
      "position": "面试岗位",
      "description": "岗位描述",
      "status": "面试状态",
      "resumeId": "关联的简历ID",
      "createdAt": "创建时间",
      "rounds": [
        {
          "id": "轮次ID",
          "roundNumber": "面试轮次",
          "scheduledTime": "计划面试时间",
          "status": "轮次状态",
          "sessionId": "AI会话ID"
        }
      ]
    }
  ]
}
```

### **3.3 更新面试（包含添加/更新轮次）**

- **路径**: \`/api/interview/update\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

```JSON
{
  "id": "面试ID",
  "company": "面试公司",
  "position": "面试岗位",
  "description": "岗位描述",
  "resumeId": "关联的简历ID",
  "status": "面试状态", // ONGOING/COMPLETED/FAILED
  "rounds": [
    {
      "id": "轮次ID(更新已有轮次时必传)",
      "scheduledTime": "计划面试时间",
      "status": "轮次状态" // PENDING/ONGOING/COMPLETED/FAILED
    },
    {
      "scheduledTime": "新轮次计划时间" // 不传id时视为添加新轮次
    }
  ]
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "面试ID",
    "company": "面试公司",
    "position": "面试岗位",
    "status": "面试状态",
    "rounds": [
      {
        "id": "轮次ID",
        "roundNumber": "面试轮次",
        "status": "轮次状态"
      }
    ]
  }
}
```

### **3.4 删除面试**

- **路径**: \`/api/interview/delete/{id}\`
- **方法**: DELETE
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### **3.5 删除面试轮次**

- **路径**: \`/api/interview/round/delete/{id}\`
- **方法**: DELETE
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## **4. AI面试功能**

### **4.1 创建AI会话**

- **路径**: \`/api/ai/session/create\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

```JSON
{
  "interviewId": "面试ID",
  "roundId": "轮次ID"
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "sessionId": "会话ID"
  }
}
```

### **4.2 发送消息并获取回复**

- **路径**: \`/api/ai/message/send\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

```JSON
{
  "sessionId": "会话ID",
  "message": "用户消息内容",
}
```

- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": {
    "reply": "AI回复内容"
  }
}
```

### **4.3 获取对话历史**

- **路径**: \`/api/ai/conversation/{sessionId}\`
- **方法**: GET
- **头部**: \`Authorization: Bearer {token}\`
- **返回**:

```JSON
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "role": "user",
      "content": "用户消息",
      "timestamp": "时间戳"
    },
    {
      "role": "assistant",
      "content": "AI回复",
      "timestamp": "时间戳"
    }
  ]
}
```

### **4.4 流式对话接口**

- **路径**: \`/api/conversation/{sessionId}\`
- **协议**: fetch流式     post
- **发送消息格式**:

```JSON
{
  "message": "用户消息"
}
```

- **接收消息格式**:

```JSON
{
  "type": "message",
  "content": "AI回复的片段",
  "finished": false
}
```

### 4.5 保存对话历史

- **路径**: /api/ai/conversation/save
- **协议**: POST
- **发送消息格式**:

```json
{
  "sessionId": "会话ID",
  "conversations": [
    {
      "role": "user",
      "content": "用户消息",
      "timestamp": "2024-05-05T10:00:00" // 可选，缺失时会自动生成
    },
    {
      "role": "assistant", 
      "content": "AI回复",
      "timestamp": "2024-05-05T10:01:00" // 可选，缺失时会自动生成
    }
  ],
  "status": "COMPLETED", // 可选，更新面试轮次状态
  "result": "PASS", // 可选，更新面试结果
  "notes": "面试笔记", // 可选，更新面试笔记
  "requestSummary": true // 可选，是否请求生成面试总结
}
```

- **接收消息格式**:

```json
{
  "code": 200,
  "message": "保存成功",
  "data": {
    "interviewId": "面试ID",
    "roundId": "轮次ID",
    "status": "轮次状态",
    "result": "面试结果",
    "summary": "面试总结" // 仅当requestSummary=true时返回
  }
}
```

## **5. 文件上传**

### **5.1 上传简历文件**

- **路径**: \`/api/upload/resume\`
- **方法**: POST
- **头部**: \`Authorization: Bearer {token}\`
- **参数**:

* 使用`multipart/form-data`格式
* `file`: 简历文件(PDF)

- **返回**:

```JSON
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileUrl": "文件访问URL",
    "fileName": "文件名"
  }
}
```

# 数据库设计

> 利用AI完善
>
> 我们接下来反复检验这个表是否可行，接下来我会说我要执行什么操作，你告诉我你会怎么做，如果数据库无法执行，咱们就修改数据库

## 要实现的业务操作

### 登入模块

用户密码登入，没有就默认注册

### 简历编辑

ocr识别后填写，也可以自己编辑

分为自我介绍、教育经历、工作经验/项目经验、工作技能

### 面试日程管理

创建一个面试日程，设置要面试的公司、岗位、时间，岗位介绍，当前为第几面。初次创建时都为一面，后序可根据自己是否通过继续添加，比如后面添加二面，前面已经面过的一面也可以拿到历史对话

### AI对话

## 1. 用户认证（JWT）

```javascript
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
  `password_hash` VARCHAR(128) NOT NULL COMMENT '密码哈希',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 2. 个人简历信息（OCR识别结果或用户编辑）

```javascript
CREATE TABLE `resume` (
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
  CONSTRAINT `fk_resume_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `uk_user_resume` UNIQUE (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 3. 面试主表

```javascript
CREATE TABLE `interview` (
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
```

## 4.面试轮次表

```sql
CREATE TABLE `interview_round` (
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
```

## 5.面试对话记录

```javascript
CREATE TABLE `interview_conversation` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `interview_id` BIGINT NOT NULL COMMENT '关联的面试ID',
  `round_id` BIGINT NOT NULL COMMENT '关联面试轮次ID',
  `session_id` VARCHAR(64) NOT NULL COMMENT '会话ID',
  `conversation_text` JSON COMMENT '对话记录JSON',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_conversation_round` FOREIGN KEY (`round_id`) REFERENCES `interview_round` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
