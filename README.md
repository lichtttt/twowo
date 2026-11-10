# 智慧教育平台 (Smart Edu Platform)

面向教育平台的智能体开发项目。采用敏捷开发方法论，借助大语言模型辅助开发。

## 技术栈

- **前端**：Vue 3 + Vite + Element Plus + Pinia + Vue Router + Axios
- **后端**：Node.js + Express + Sequelize + MySQL + JWT
- **AI**：对接 OpenAI 兼容大模型 API（智能答疑 / 学习路径 / 作业批改 / 学习报告 / AI 面试）
- **适配**：响应式布局，同时适配 PC 与移动端

## 项目结构

```
two/
├── backend/      # 后端 Express + Sequelize
│   └── src/
│       ├── config/       # 配置
│       ├── models/       # 数据模型
│       ├── routes/       # 路由
│       ├── controllers/  # 控制器
│       ├── services/     # 业务/AI 服务
│       ├── middlewares/  # 中间件
│       └── utils/        # 工具
├── frontend/     # 前端 Vue3
│   └── src/
│       ├── api/          # 接口请求
│       ├── layouts/      # 布局
│       ├── views/        # 页面
│       ├── components/   # 组件
│       ├── stores/       # Pinia
│       └── router/       # 路由
├── docs/         # 设计文档
└── package.json  # 聚合脚本
```

## 快速开始

```bash
# 1. 安装全部依赖
npm run install:all

# 2. 配置环境变量
cp backend/.env.example backend/.env   # 按需修改数据库与 AI 配置
cp frontend/.env.example frontend/.env

# 3. 初始化数据库（需先在 MySQL 中创建数据库 smart_edu）
npm run db:init      # 同步表结构
npm run db:seed      # 写入演示数据

# 4. 启动开发服务
npm run dev          # 同时启动前后端
# 或分别启动：
npm run dev:backend
npm run dev:frontend
```

- 前端默认地址：http://localhost:5173
- 后端默认地址：http://localhost:3000
- 默认管理员账号：admin / admin123

## 功能模块

| 模块 | 说明 |
|------|------|
| 用户系统 | 注册、登录、密码重置、个人信息修改、角色（学生/教师/管理员） |
| 课程资源 | 多维筛选、排序、模糊搜索、详情、收藏、学习进度、后台上下架 |
| 实习就业 | 职位筛选搜索、详情、收藏、申请、AI 面试 |
| AI 学习助手 | 智能答疑、学习路径推荐、作业自动批改、学习报告 |
| 后台管理 | 用户/订单/课程/职位/申请管理 |
| 加分项 | 通知推送、学习社区、响应式移动端适配 |

## 文档

- 数据库设计：[docs/database.md](docs/database.md)
- 接口文档：[docs/api.md](docs/api.md)