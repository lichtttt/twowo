# 接口文档

基础地址：`/api`，除登录/注册外需在 Header 携带 `Authorization: Bearer <token>`。

统一响应格式：
```json
{ "code": 0, "message": "ok", "data": {} }
```
错误时 `code` 非 0。

## 1. 认证 /api/auth
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /register | 注册 |
| POST | /login | 登录 |
| POST | /reset-password | 密码重置 |
| GET | /me | 当前用户信息 |

## 2. 用户 /api/user
| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | /profile | 修改个人信息(昵称/头像/专业) |
| PUT | /password | 修改密码 |
| GET | /courses | 我的课程 |
| GET | /favorites | 我的收藏(课程/职位) |
| GET | /orders | 我的订单 |

## 3. 课程 /api/course
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 列表(筛选/排序/搜索) |
| GET | /:id | 详情 |
| POST | /:id/favorite | 收藏/取消收藏 |
| POST | /:id/learn | 开始学习 |
| PUT | /:id/progress | 更新进度 |
| GET | /:id/ratings | 评分评论列表 |
| POST | /:id/ratings | 提交评分评论 |

查询参数：tech_system, tech_direction, difficulty, is_free, sort(newest/students/rating), keyword

## 4. 职位 /api/job
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 列表(筛选/搜索) |
| GET | /:id | 详情 |
| POST | /:id/favorite | 收藏/取消收藏 |
| POST | /:id/apply | 申请职位 |
| POST | /:id/ai-interview | AI 面试 |

## 5. AI 助手 /api/ai
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /chat | 智能答疑(多轮) |
| GET | /conversations | 会话列表 |
| GET | /conversations/:id | 会话详情 |
| POST | /learning-path | 学习路径推荐 |
| POST | /grade | 作业自动批改 |
| GET | /report | 学习报告 |

## 6. 社区 /api/community
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 帖子列表 |
| POST | / | 发帖/回复 |

## 7. 通知 /api/notification
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | / | 通知列表 |
| PUT | /:id/read | 标记已读 |

## 8. 后台管理 /api/admin (需 admin 角色)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET/PUT/DELETE | /users | 用户管理 |
| GET | /orders | 订单管理 |
| GET/PUT | /courses/:id/status | 课程上下架 |
| GET/PUT | /jobs/:id/status | 职位上下架 |
| GET/PUT | /applications | 申请管理 |
| GET/POST/PUT | /instructors | 讲师管理 |