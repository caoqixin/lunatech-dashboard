# XinTech Dashboard

基于 Next.js 14 + App Router 构建的现代化企业管理系统。该系统集成了 Supabase 进行后端数据管理和身份验证，并使用 Shadcn UI 组件库构建了美观且易用的界面。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **数据库/后端**: Supabase
- **UI 组件**: Shadcn UI
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod 验证
- **数据可视化**: Chart.js, Recharts
- **请求处理**: SWR
- **数据表格**: TanStack Table

## 项目结构

```
src/
├── app/                  # Next.js App Router页面
│   ├── auth/             # 认证相关页面
│   ├── dashboard/        # 主要应用页面
│   │   ├── (overview)/   # 概览/仪表盘
│   │   ├── categories/   # 分类管理
│   │   ├── customers/    # 客户管理
│   │   ├── orders/       # 订单管理
│   │   ├── phones/       # 手机管理
│   │   ├── profile/      # 用户档案
│   │   ├── repairs/      # 维修管理
│   │   ├── settings/     # 系统设置
│   │   ├── suppliers/    # 供应商管理
│   │   └── warranties/   # 保修管理
│   └── login/            # 登录页面
├── components/           # 共享UI组件
│   ├── custom/           # 自定义业务组件
│   ├── data-table/       # 数据表格组件
│   ├── layout/           # 布局组件
│   └── ui/               # 基础UI组件
├── hooks/                # 自定义React Hooks
├── lib/                  # 工具库和类型定义
│   └── supabase/         # Supabase客户端和服务端实现
├── route/                # 路由帮助程序
├── server/               # 服务器端逻辑
├── store/                # Zustand状态管理
└── views/                # 视图组件
```

## 主要功能

- 用户认证与授权
- 仪表盘概览与数据分析
- 客户管理
- 订单管理
- 手机设备管理
- 维修管理
- 供应商管理
- 保修管理
- 分类管理
- 个人资料设置
- 系统设置

## 开始使用

### 环境要求

- Node.js 18+
- PNPM 包管理器

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

创建`.env.local`文件并添加以下配置：

```
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名密钥

# Redis配置(如使用)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# 用户创建脚本使用
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_PASSWORD=
NEXT_PUBLIC_NAME=
```

### 开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
pnpm build
pnpm start
```

## 用户创建

系统提供了创建用户的脚本，可通过以下命令运行：

```bash
pnpm create-user
```

此脚本使用`.env.local`中的凭据创建一个新用户。

## 项目特性

- **App Router**: 使用 Next.js 14 的新路由系统，支持服务器组件和客户端组件
- **自适应设计**: 响应式 UI 设计，适配各种设备屏幕
- **黑暗模式**: 内置深色/浅色主题切换
- **类型安全**: 完整的 TypeScript 支持和类型定义
- **组件驱动**: 基于可复用组件的开发方式
- **高性能**: 利用 Next.js 优化的性能特性
- **数据表格**: 功能丰富的数据表格，支持排序、筛选和分页
- **表单处理**: 集成 React Hook Form 和 Zod 进行表单验证
- **状态管理**: 使用 Zustand 进行简洁的状态管理
