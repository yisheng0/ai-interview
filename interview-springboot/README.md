# Interview Spring Boot 项目

## 配置指南

### 阿里云OSS配置
本项目使用阿里云OSS进行文件存储，请按照以下步骤配置：

1. 复制 `src/main/resources/application-dev.properties.example` 为 `src/main/resources/application-dev.properties`
2. 在新文件中填入你的阿里云OSS配置信息：
   - `aliyun.oss.endpoint`：OSS的地域节点
   - `aliyun.oss.access-key-id`：阿里云AccessKey ID
   - `aliyun.oss.secret-access-key`：阿里云AccessKey Secret
   - `aliyun.oss.bucket-name`：OSS存储桶名称

3. 配置环境变量（推荐生产环境使用）：
   - `OSS_ACCESS_KEY_ID`：阿里云AccessKey ID
   - `OSS_SECRET_ACCESS_KEY`：阿里云AccessKey Secret
   - `OSS_BUCKET_NAME`：OSS存储桶名称

注意：请勿将包含真实AccessKey的配置文件提交到Git仓库！ 