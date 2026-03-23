# XNexus - Artifact Repository Manager

基于 Go + React 微内核架构的制品仓库管理平台。

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Host (:3000) - 唯一用户入口               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Repo MFE    │  │ Task MFE    │  │ Setting MFE │         │
│  │ (动态加载)   │  │ (动态加载)   │  │ (动态加载)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Go Backend     │
                    │  (:8080)        │
                    └─────────────────┘
```

### 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Go 1.22 + 标准库 net/http |
| 前端 | React 19 + Vite 6 + Module Federation |
| UI | shadcn/ui + TailwindCSS 4 |
| 状态管理 | TanStack Query 5 + Zustand 5 |
| 微前端 | @originjs/vite-plugin-federation |

### 微内核架构说明

**核心原则**：
- **1 个用户入口**：Host 应用 (:3000)，用户只访问这一个端口
- **N 个插件模块**：MFEs 作为可插拔组件，开发时在独立端口提供资源
- **动态加载**：Host 通过 Module Federation 运行时加载 MFE 代码

**开发工作流**：
```bash
# 启动所有服务（Host + MFEs）
cd web && npm run dev:all

# 用户访问：http://localhost:3000
# MFEs 在后台运行 (:3001/:3002/:3003)，用户不可直接访问
```

**生产部署**：
```bash
# 构建所有模块
npm run build:all

# 所有 dist 产物部署到同一 CDN/服务器
# Host 统一服务所有静态资源
```

## 快速开始

### 1. 启动后端

```bash
go run ./cmd/server
```

服务监听 `:8080`

### 2. 启动前端

```bash
cd web

# 安装依赖
npm install

# 开发模式（启动所有服务）
npm run dev:all

# 访问：http://localhost:3000
```

### 3. 生产构建

```bash
cd web
npm run build:all

# 产物位置:
# web/host/dist/       - Host 应用
# web/mfe-*/dist/      - MFE 插件模块
```

## API 示例

### 登录

```bash
curl -s http://localhost:8080/api/auth/login \
  -X POST -H 'content-type: application/json' \
  -d '{"username":"admin","password":"admin"}'
```

### 创建仓库

```bash
TOKEN="your-token-here"
curl -s http://localhost:8080/api/repos \
  -X POST -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"name":"docker-local","type":"hosted","format":"docker"}'
```

### 上传制品

```bash
curl -s "http://localhost:8080/api/repos/docker-local/artifacts/app/v1.0.tar.gz" \
  -X POST -H "authorization: Bearer $TOKEN" \
  --data-binary @file.tar.gz
```

### 触发任务

```bash
curl -s http://localhost:8080/api/tasks/trigger \
  -X POST -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"type":"sync","repo":"docker-local"}'
```

## 测试

### 后端测试

```bash
go test ./...
```

### 前端测试

```bash
cd web
npm test
```

### E2E 测试

```bash
cd e2e
npm install
npx playwright test
```

## 项目结构

```
.
├── cmd/server/           # Go 后端入口
├── internal/             # Go 后端代码
│   ├── api/              # HTTP API 服务器
│   ├── auth/             # 认证模块
│   ├── format/           # 格式适配器
│   ├── model/            # 数据模型
│   ├── service/          # 业务服务
│   └── store/            # 数据存储
├── web/                  # 前端根目录
│   ├── host/             # Host 应用 (主容器)
│   │   ├── src/
│   │   │   ├── components/  # 共享组件
│   │   │   ├── layouts/     # 布局组件
│   │   │   ├── pages/       # 页面
│   │   │   ├── stores/      # 状态管理
│   │   │   └── services/    # API 服务
│   │   └── vite.config.ts   # Module Federation Host 配置
│   ├── mfe-repo/         # 仓库管理 MFE (插件)
│   ├── mfe-task/         # 任务管理 MFE (插件)
│   └── mfe-setting/      # 系统设置 MFE (插件)
├── e2e/                  # Playwright E2E 测试
├── docs/                 # 文档
│   ├── plans/            # 设计文档
│   └── decision-log.md   # 决策记录
├── Dockerfile            # 生产镜像构建
└── docker-compose.yml    # 容器编排
```

## 功能特性

- ✅ 本地账号认证 (admin/admin) + JWT Token
- ✅ 仓库管理：Hosted / Proxy / Group
- ✅ 仓库格式：Docker / Helm / Maven
- ✅ 制品上传/下载
- ✅ 自动化任务系统
- ✅ 微内核 + 插件化架构
- ✅ 响应式 UI 设计

## Docker 部署

```bash
# 构建并启动
docker-compose up -d

# 访问：http://localhost:8080
```

## 文档

- [架构设计文档](docs/plans/2026-03-23-frontend-architecture-design.md)
- [决策记录](docs/decision-log.md)
- [产品规划](PRODUCT_PLAN.md)
