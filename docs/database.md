# 数据库设计

数据库：`smart_edu`，字符集 utf8mb4。所有表均含 `created_at` / `updated_at`。

## 1. users 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AI | 主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| password | VARCHAR(255) | 密码(bcrypt) |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| major | VARCHAR(100) | 专业 |
| role | ENUM('student','teacher','admin') | 角色 |
| status | TINYINT | 状态 1启用 0禁用 |
| last_login_at | DATETIME | 最后登录 |

## 2. instructors 讲师表

| 字段 | 说明 |
|------|------|
| id | PK |
| name | 讲师姓名 |
| avatar | 头像 |
| title | 职称 |
| intro | 简介 |
| user_id | 关联用户(可空) |

## 3. courses 课程表

| 字段 | 说明 |
|------|------|
| id | PK |
| title | 课程名称 |
| description | 课程简介 |
| cover | 封面图 |
| tech_system | 技术体系(theory/practice/cert) 理论/实训/认证 |
| tech_direction | 技术方向(ai/bigdata/cloud/web/mobile/other) |
| difficulty | 难度 1-5 |
| is_free | 是否免费 |
| price | 价格 |
| instructor_id | 讲师ID |
| status | 上架状态 1上架 0下架 |
| student_count | 学习人数 |
| rating_avg | 平均评分 |
| published_at | 上架时间 |

## 4. course_chapters 章节表

| 字段 | 说明 |
|------|------|
| id | PK |
| course_id | 课程ID |
| title | 章节标题 |
| content | 内容 |
| video_url | 视频地址 |
| sort | 排序 |

## 5. course_ratings 评分评论表

| 字段 | 说明 |
|------|------|
| id | PK |
| course_id | 课程ID |
| user_id | 用户ID |
| rating | 评分 1-5 |
| comment | 评论内容 |
| reply | 讲师回复 |

## 6. user_courses 用户课程表（收藏/学习进度）

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| course_id | 课程ID |
| is_favorited | 是否收藏 |
| is_learning | 是否在学习 |
| progress | 进度 0-100 |
| last_chapter_id | 最后学习章节 |

## 7. orders 订单表

| 字段 | 说明 |
|------|------|
| id | PK |
| order_no | 订单号 |
| user_id | 用户ID |
| course_id | 课程ID |
| amount | 金额 |
| status | 状态(pending/paid/cancelled/refunded) |
| pay_type | 支付方式 |

## 8. companies 公司表

| 字段 | 说明 |
|------|------|
| id | PK |
| name | 公司名 |
| logo | logo |
| intro | 简介 |
| scale | 规模 |

## 9. jobs 职位表

| 字段 | 说明 |
|------|------|
| id | PK |
| title | 职位名称 |
| company_id | 公司ID |
| category | 职位分类 |
| salary_min/salary_max | 薪资范围 |
| city | 城市 |
| description | 职位描述 |
| requirements | 任职要求 |
| status | 上架状态 |

## 10. job_applications 职位申请表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| job_id | 职位ID |
| status | 状态(applied/interview/offer/rejected) |
| resume | 简历 |
| ai_interview_score | AI面试评分 |
| ai_interview_feedback | AI面试反馈 |

## 11. user_jobs 用户职位收藏表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| job_id | 职位ID |
| is_favorited | 是否收藏 |

## 12. ai_conversations AI对话表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| course_id | 关联课程(可空) |
| title | 会话标题 |

## 13. ai_messages AI消息表

| 字段 | 说明 |
|------|------|
| id | PK |
| conversation_id | 会话ID |
| role | 角色(user/assistant) |
| content | 内容 |

## 14. learning_plans 学习计划表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| plan_json | 计划内容(JSON) |
| expire_at | 到期时间 |

## 15. assignments 作业表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| course_id | 课程ID |
| title | 题目 |
| code | 提交代码 |
| score | AI评分 |
| feedback | AI反馈 |

## 16. notifications 通知表

| 字段 | 说明 |
|------|------|
| id | PK |
| user_id | 用户ID |
| type | 类型(course_update/plan_expire/system) |
| title | 标题 |
| content | 内容 |
| is_read | 是否已读 |

## 17. community_posts 社区帖子/问答表

| 字段 | 说明 |
|------|------|
| id | PK |
| course_id | 关联课程(可空) |
| user_id | 用户ID |
| type | 类型(discuss/qa) |
| title | 标题 |
| content | 内容 |
| parent_id | 父帖(回复) |