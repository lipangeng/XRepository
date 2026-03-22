# XNexus Web Frontend

基于 Vite + Module Federation 的微前端架构。

## 目录结构

```
web/
├── host/          # Host 应用 (主容器)
├── mfe-repo/      # 仓库管理 MFE
├── mfe-task/      # 任务管理 MFE
└── mfe-setting/   # 系统设置 MFE
```

## 开发

```bash
# 安装依赖
npm install

# 运行所有服务
npm run dev:all

# 单独运行某个服务
npm run dev:host    # Host :3000
npm run dev:repo    # Repo MFE :3001
npm run dev:task    # Task MFE :3002
npm run dev:setting # Setting MFE :3003
```

## 构建

```bash
# 构建所有
npm run build:all

# 单独构建
npm run build:host
```

## 技术栈

- Vite 6
- React 19
- TypeScript 5
- shadcn/ui
- TailwindCSS 4
- Module Federation
