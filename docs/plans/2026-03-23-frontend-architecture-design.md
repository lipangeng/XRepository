# XNexus 前端架构设计文档

**日期**: 2026-03-23  
**状态**: 已批准  
**作者**: XNexus Team

---

## 1. 概述

本文档描述 XNexus 前端架构设计，采用 Vite + Module Federation 微前端架构，支持插件化扩展和独立部署。

---

## 2. 架构目标

- **插件化扩展**: 支持按业务域独立开发和部署前端模块
- **技术现代化**: 使用 React 19 + Vite 6 + TypeScript 5 最新技术栈
- **可维护性**: 清晰的模块边界，避免循环依赖
- **性能优化**: 共享依赖按需加载，避免重复打包
- **向后兼容**: 保留升级到其他微前端方案的能力

---

## 3. 架构设计

### 3.1 整体架构

```
┌──────────────────────────────────────────────────────────────┐
│  Host 应用 (xnexus-host) - :3000                              │
│  ├── 全局认证 (Auth Context)                                  │
│  ├── 主导航 (Sidebar + Header)                                │
│  ├── 主题配置 (Theme Provider)                                │
│  ├── 通用组件库 (Button/Table/Form/Modal)                     │
│  ├── 状态管理 (QueryClient + Stores)                          │
│  └── MFE 加载器 (Module Federation Runtime)                   │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Repo MFE        │ │  Task MFE        │ │  Setting MFE     │
│  (仓库管理域)     │ │  (任务管理域)     │ │  (系统设置域)     │
│  - 仓库列表       │ │  - 任务列表       │ │  - 用户管理       │
│  - 仓库详情       │ │  - 执行历史       │ │  - 系统配置       │
│  - 制品浏览       │ │  - 任务触发       │ │  - 权限设置       │
│  - 制品上传       │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### 3.2 模块职责

| 模块 | 职责 | 路由前缀 |
|------|------|----------|
| Host | 认证/导航/布局/共享组件 | `/` |
| Repo MFE | 仓库管理、制品管理 | `/repos/*` |
| Task MFE | 任务调度、执行历史 | `/tasks/*` |
| Setting MFE | 系统配置、权限管理 | `/settings/*` |

### 3.3 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 微前端 | @originjs/vite-plugin-federation | ^2.0.0 |
| 构建 | Vite | ^6.x |
| 框架 | React | ^19.x |
| 语言 | TypeScript | ^5.x |
| UI | shadcn/ui | latest |
| 样式 | TailwindCSS | ^4.x |
| 路由 | React Router | ^7.x |
| 状态 | TanStack Query | ^5.x |
| 状态 | Zustand | ^5.x |
| HTTP | Axios | ^1.x |

---

## 4. 目录结构

```
/workspace/opensource/XRepository/
├── cmd/server/                 # Go 后端
├── internal/                   # Go 后端代码
├── web/                        # 前端根目录
│   ├── host/                   # Host 应用
│   │   ├── src/
│   │   │   ├── components/     # 共享组件
│   │   │   │   ├── ui/         # shadcn/ui 基础组件
│   │   │   │   ├── Layout/     # 布局组件
│   │   │   │   └── common/     # 通用业务组件
│   │   │   ├── layouts/        # 页面布局
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── hooks/          # 共享 hooks
│   │   │   ├── services/       # API 服务封装
│   │   │   ├── types/          # TypeScript 类型
│   │   │   ├── lib/            # 工具函数
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts      # Federation 配置
│   │   ├── tailwind.config.js
│   │   └── package.json
│   ├── mfe-repo/               # 仓库管理 MFE
│   │   ├── src/
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── components/     # MFE 私有组件
│   │   │   ├── hooks/          # MFE hooks
│   │   │   └── index.tsx       # MFE 入口 (导出 App)
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── mfe-task/               # 任务管理 MFE
│   │   └── ...
│   └── mfe-setting/            # 系统设置 MFE
│       └── ...
└── docs/
    ├── plans/                  # 设计文档
    └── decision-log.md         # 决策记录
```

---

## 5. Module Federation 配置

### 5.1 Host 配置 (vite.config.ts)

```typescript
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'xnexus-host',
      remotes: {
        'mfe-repo': 'http://localhost:3001/assets/remoteEntry.js',
        'mfe-task': 'http://localhost:3002/assets/remoteEntry.js',
        'mfe-setting': 'http://localhost:3003/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios', 'zustand'],
    }),
  ],
}
```

### 5.2 MFE 配置 (vite.config.ts)

```typescript
import federation from '@originjs/vite-plugin-federation'

export default {
  plugins: [
    federation({
      name: 'mfe-repo',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './routes': './src/routes.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios', 'zustand'],
    }),
  ],
}
```

---

## 6. 通信机制

### 6.1 Host → MFE (Props)

```typescript
// Host 加载 MFE
const RepoApp = lazy(() => import('mfe-repo/App'))

function App() {
  const { token, user } = useAuth()
  
  return (
    <RepoApp 
      authToken={token} 
      currentUser={user}
      onLogout={handleLogout}
    />
  )
}
```

### 6.2 MFE → Host (Custom Events)

```typescript
// MFE 发送事件
window.dispatchEvent(new CustomEvent('xnexus:navigate', {
  detail: { to: '/repos/docker-local' }
}))

// Host 监听事件
window.addEventListener('xnexus:navigate', (e) => {
  navigate(e.detail.to)
})
```

---

## 7. 认证流程

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  用户   │     │  Host   │     │  MFE    │     │  Go API │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │ 1. 访问登录页  │               │               │
     │──────────────>│               │               │
     │               │               │               │
     │ 2. 提交凭证   │               │               │
     │──────────────>│               │               │
     │               │ 3. POST /api/auth/login       │
     │               │──────────────────────────────>│
     │               │ 4. 返回 token │               │
     │               │<──────────────────────────────│
     │               │               │               │
     │ 5. 存储 token  │               │               │
     │<──────────────│               │               │
     │               │               │               │
     │ 6. 导航到首页  │               │               │
     │──────────────>│               │               │
     │               │ 7. 加载 MFE   │               │
     │               │──────────────>│               │
     │               │ 8. 传递 token │               │
     │               │──────────────>│               │
     │               │               │ 9. API 请求   │
     │               │               │──────────────>│
     │               │               │               │
```

---

## 8. 页面清单

### 8.1 Host 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录页 | `/login` | 用户认证 |
| 首页 | `/` | 仪表盘/快捷入口 |
| 404 | `*` | 未找到页面 |

### 8.2 Repo MFE 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 仓库列表 | `/repos` | 展示所有仓库 |
| 创建仓库 | `/repos/new` | 新建仓库表单 |
| 仓库详情 | `/repos/:name` | 仓库信息 + 制品列表 |
| 制品浏览 | `/repos/:name/artifacts/*` | 制品树形浏览 |
| 制品上传 | `/repos/:name/upload` | 上传表单 |

### 8.3 Task MFE 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 任务列表 | `/tasks` | 展示所有任务 |
| 任务详情 | `/tasks/:id` | 执行日志 |
| 触发任务 | `/tasks/trigger` | 触发表单 |

### 8.4 Setting MFE 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 用户管理 | `/settings/users` | 用户 CRUD |
| 权限设置 | `/settings/roles` | 角色权限配置 |
| 系统配置 | `/settings/system` | 全局配置 |

---

## 9. API 接口契约

### 9.1 认证接口

```typescript
POST /api/auth/login
{ username: string, password: string }
→ { token: string, user: User }
```

### 9.2 仓库接口

```typescript
GET  /api/repos → Repository[]
POST /api/repos → Repository
GET  /api/repos/:name → Repository
DELETE /api/repos/:name → void
```

### 9.3 制品接口

```typescript
GET  /api/repos/:repo/artifacts/:path → Blob
POST /api/repos/:repo/artifacts/:path → Artifact
```

### 9.4 任务接口

```typescript
GET  /api/tasks → Task[]
POST /api/tasks/trigger → Task
GET  /api/tasks/:id → Task
```

---

## 10. 错误处理

### 10.1 HTTP 错误

| 状态码 | 处理 |
|--------|------|
| 401 | 跳转登录页 |
| 403 | 显示无权限提示 |
| 404 | 显示资源不存在 |
| 500 | 显示服务器错误 |

### 10.2 全局错误边界

```typescript
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null)
  
  if (error) {
    return <ErrorPage error={error} onRetry={() => setError(null)} />
  }
  
  return <ErrorCatcher onError={setError}>{children}</ErrorCatcher>
}
```

---

## 11. 测试策略

| 类型 | 工具 | 覆盖率目标 |
|------|------|------------|
| 单元测试 | Vitest | >80% |
| 组件测试 | Testing Library | 关键组件 |
| E2E 测试 | Playwright | 关键流程 |

---

## 12. 构建与部署

### 12.1 开发环境

```bash
# Host :3000
cd web/host && npm run dev

# MFE-Repo :3001
cd web/mfe-repo && npm run dev

# MFE-Task :3002
cd web/mfe-task && npm run dev
```

### 12.2 生产构建

```bash
# 构建所有模块
npm run build:all

# 输出目录
web/host/dist/       # Host 静态文件
web/mfe-*/dist/      # MFE 静态文件
```

### 12.3 部署

- Host 和 MFE 可独立部署到 CDN/Nginx
- 通过 `remoteEntry.js` URL 实现动态加载
- 支持灰度发布和版本回滚

---

## 13. 扩展点

### 13.1 新增 MFE

1. 复制 `mfe-repo` 模板
2. 修改 `vite.config.ts` 名称和端口
3. 在 Host 配置中添加 remote
4. 注册路由

### 13.2 新增共享组件

1. 在 `host/src/components` 添加组件
2. 通过 Federation exposes 导出
3. MFE 通过 `import('host/components/Button')` 引入

---

## 14. 验收标准

- [ ] Host 应用可独立运行
- [ ] 所有 MFE 可独立开发和热更新
- [ ] 认证流程完整可用
- [ ] 共享组件正确加载
- [ ] 生产构建无错误
- [ ] E2E 测试通过关键流程

---

## 15. 后续演进

- [ ] 支持 MFE 独立部署到 CDN
- [ ] 添加 MFE 版本管理
- [ ] 实现 MFE 插件市场
- [ ] 支持 SSR 预渲染
