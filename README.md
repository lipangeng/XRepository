# XNexus - Artifact Repository Manager

基于 Go + React 微前端的制品仓库管理平台。

## 架构

- **后端**: Go 1.22 + 标准库 net/http
- **前端**: React 19 + Vite 6 + Module Federation 微前端
- **UI**: shadcn/ui + TailwindCSS 4
- **状态管理**: TanStack Query 5 + Zustand 5

## 快速开始

### 后端

```bash
go run ./cmd/server
```

服务监听 `:8080`

### 前端

```bash
cd web

# 安装依赖
npm install

# 开发模式运行所有服务
npm run dev:all

# 单独运行
npm run dev:host    # Host :3000
npm run dev:repo    # Repo MFE :3001
npm run dev:task    # Task MFE :3002
npm run dev:setting # Setting MFE :3003
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
curl -s http://localhost:8080/api/repos \
  -X POST -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"name":"docker-local","type":"hosted","format":"docker"}'
```

### 上传制品

```bash
curl -s "http://localhost:8080/api/repos/docker-local/artifacts/library/nginx/latest" \
  -X POST -H "authorization: Bearer $TOKEN" --data-binary 'payload'
```

### 触发任务

```bash
curl -s http://localhost:8080/api/tasks/trigger \
  -X POST -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
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
│   ├── mfe-repo/         # 仓库管理 MFE
│   ├── mfe-task/         # 任务管理 MFE
│   └── mfe-setting/      # 系统设置 MFE
└── docs/                 # 文档
    ├── plans/            # 设计文档
    └── decision-log.md   # 决策记录
```

## 功能特性

- ✅ 本地账号认证 (admin/admin) + Bearer Token
- ✅ 仓库管理：Hosted / Proxy / Group
- ✅ 仓库格式：Docker / Helm / Maven
- ✅ 制品上传/下载
- ✅ 自动化任务系统
- ✅ 微前端架构 (独立开发部署)
- ✅ 响应式 UI 设计

## 文档

- [产品设计文档](docs/plans/2026-03-23-frontend-architecture-design.md)
- [决策记录](docs/decision-log.md)
- [产品规划](PRODUCT_PLAN.md)
