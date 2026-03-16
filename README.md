# XNexus MVP (Go)

这是一个基于 Go 的 Nexus OSS 复刻 MVP，实现了最小可运行闭环：

- 本地账号认证（`admin/admin`）+ Bearer Token
- 仓库管理：Hosted / Proxy / Group
- 仓库格式注册：Docker / Helm / Maven（基础适配器）
- 制品上传/下载（流式读写，文件落盘）
- 自动化任务：触发任务与执行状态查询

## Quick Start

```bash
go run ./cmd/server
```

服务启动后监听 `:8080`。

## API 快速示例

### 1. 登录

```bash
curl -s http://localhost:8080/api/auth/login \
  -X POST -H 'content-type: application/json' \
  -d '{"username":"admin","password":"admin"}'
```

### 2. 创建仓库

```bash
curl -s http://localhost:8080/api/repos \
  -X POST -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"name":"docker-local","type":"hosted","format":"docker"}'
```

### 3. 上传制品

```bash
curl -s "http://localhost:8080/api/repos/docker-local/artifacts/library/nginx/latest" \
  -X POST -H "authorization: Bearer $TOKEN" --data-binary 'payload'
```

### 4. 下载制品

```bash
curl -s "http://localhost:8080/api/repos/docker-local/artifacts/library/nginx/latest" \
  -H "authorization: Bearer $TOKEN"
```

### 5. 触发任务

```bash
curl -s http://localhost:8080/api/tasks/trigger \
  -X POST -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"type":"sync","repo":"docker-local"}'
```

## 测试

```bash
go test ./...
```
