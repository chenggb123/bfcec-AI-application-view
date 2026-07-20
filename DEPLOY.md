# BFCEC AI Center — Docker 部署文档

## 目录

- [前置条件](#前置条件)
- [项目文件说明](#项目文件说明)
- [环境变量配置](#环境变量配置)
- [本地构建与运行](#本地构建与运行)
- [数据持久化](#数据持久化)
- [生产服务器部署](#生产服务器部署)
- [常用运维命令](#常用运维命令)
- [更新与回滚](#更新与回滚)
- [故障排查](#故障排查)

---

## 前置条件

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| Docker | 20.10+ | [Docker Desktop](https://www.docker.com/products/docker-desktop/)（Windows/Mac）或 Docker Engine（Linux） |
| Docker Compose | 2.0+ | Docker Desktop 已内置；Linux 需单独安装 `docker-compose-plugin` |
| Node.js | 20.x | 仅本地开发需要，容器内已内置 |

验证安装：

```bash
docker --version        # Docker version 24.0.x
docker compose version   # Docker Compose version v2.x
```

---

## 项目文件说明

部署涉及 4 个文件（3 新建 + 1 修改），缺一不可：

```
项目根目录/
├── Dockerfile          # 镜像构建定义（三阶段构建）
├── docker-compose.yml  # 容器编排（端口/环境变量/数据卷/健康检查）
├── .dockerignore       # 排除不进入镜像的文件
├── .env.local          # 敏感配置（不入镜像，通过 env_file 注入）
└── next.config.ts      # 已添加 output: 'standalone'（Docker 必需）
```

### Dockerfile 三阶段架构

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Stage 1     │     │  Stage 2     │     │  Stage 3         │
│  deps        │────▶│  builder     │────▶│  runner          │
│              │     │              │     │                  │
│  npm ci      │     │  npm build   │     │  仅保留:          │
│  production  │     │  Next.js     │     │  .next/standalone │
│  依赖        │     │  完整构建     │     │  .next/static     │
│              │     │              │     │  public/          │
│  node:20     │     │  node:20     │     │  data/            │
│  alpine      │     │  alpine      │     │                  │
└──────────────┘     └──────────────┘     │  node:20-alpine   │
                                          │  USER nextjs      │
                                          │  EXPOSE 3000      │
                                          └──────────────────┘
```

---

## 环境变量配置

### 必需变量（3 个）

应用代码从 `process.env` 读取以下变量，缺一不可：

| 变量名 | 用途 | 代码位置 |
|--------|------|---------|
| `ADMIN_USERNAME` | 后台登录用户名 | `src/lib/data/auth.ts:5` |
| `ADMIN_PASSWORD` | 后台登录密码 | `src/lib/data/auth.ts:6` |
| `SESSION_SECRET` | Cookie HMAC 签名密钥 | `src/lib/auth/session.ts:12` |

### 配置方式

**方式一：env_file（推荐，docker-compose.yml 已配置）**

直接引用宿主机 `.env.local`，容器启动时注入：

```yaml
# docker-compose.yml
services:
  portal:
    env_file:
      - .env.local
```

确保 `.env.local` 包含（示例）：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Bfcec@2026
SESSION_SECRET=change-me-to-a-long-random-secret-string
```

> `.env.local` 已在 `.dockerignore` 中排除（`.env*` 规则），**不会进入镜像**。

**方式二：environment 逐条写入**

在 `docker-compose.yml` 中直接声明：

```yaml
services:
  portal:
    environment:
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=Bfcec@2026
      - SESSION_SECRET=a1b2c3d4e5f6...（生成方法见下）
```

### SESSION_SECRET 生成

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# 输出示例: 7f3a9b1c8e2d5f4a6b0c3d1e8f2a5b7c9d0e3f1a4b6c8d2e5f7a0b3c6d9e1f
```

将生成的值替换 `.env.local` 中的占位值。

---

## 本地构建与运行

### 1. 构建镜像

```bash
# 在项目根目录执行
docker compose build
```

首次构建约 2-5 分钟（取决于网络）。后续构建会利用 Docker 层缓存，仅变更部分重新构建。

### 2. 启动容器

```bash
# 后台运行
docker compose up -d

# 查看启动日志
docker compose logs -f
```

看到以下输出表示启动成功：

```
bfcec-portal  |   ▲ Next.js 16.x.x
bfcec-portal  |   - Local:        http://localhost:3000
bfcec-portal  |   - Network:      http://0.0.0.0:3000
```

### 3. 验证

```bash
# 健康检查
docker compose ps
# STATUS 应为 "healthy"

# 验证页面可访问
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# 应返回 200

# 验证环境变量注入
docker compose exec portal node -e "console.log(process.env.ADMIN_USERNAME)"
# 应输出: admin

# 测试后台登录
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Bfcec@2026"}'
# 应返回 200 + Set-Cookie
```

### 4. 浏览器访问

| 页面 | 地址 |
|------|------|
| 首页 | http://localhost:3000 |
| 产品目录 | http://localhost:3000/products |
| 后台登录 | http://localhost:3000/login |
| 管理面板 | http://localhost:3000/admin |

### 5. 停止

```bash
# 停止并保留容器
docker compose stop

# 停止并删除容器（保留数据卷）
docker compose down
```

---

## 数据持久化

### 数据结构

项目使用 JSON 文件作为数据库，位于 `data/` 目录：

```
data/
├── products.json        # 产品数据（CRUD 操作）
├── products_batch1.json # 种子数据
├── products_batch2.json
├── products_batch3.json
├── products_batch4.json
├── categories.json      # 分类数据
└── scenarios.json       # 场景数据
```

### 配置数据卷

在 `docker-compose.yml` 中添加 `volumes`：

```yaml
services:
  portal:
    # ... 其他配置 ...
    volumes:
      - ./data:/app/data   # 宿主机 data/ ↔ 容器 /app/data
```

> **工作原理**：容器内对 `data/` 的所有读写操作（如新增产品、修改分类）会直接落盘到宿主机的 `data/` 目录。容器删除后数据不丢失。

### 初始化数据

首次部署时，宿主机 `data/` 目录已包含种子数据，Docker 卷挂载后容器可直接使用。无需额外初始化步骤。

### 备份数据

```bash
# 直接备份宿主机 data/ 目录即可
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
```

---

## 生产服务器部署

### 1. 上传项目到服务器

```bash
# 方式一：git clone
git clone <your-repo-url> /opt/bfcec-portal
cd /opt/bfcec-portal

# 方式二：rsync 上传
rsync -avz --exclude 'node_modules' --exclude '.next' ./ user@server:/opt/bfcec-portal/
```

### 2. 创建生产环境变量文件

```bash
# 在服务器上创建 .env.local（不要提交到 git）
cat > /opt/bfcec-portal/.env.local << 'EOF'
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<强密码>
SESSION_SECRET=<生成的随机密钥>
EOF
```

### 3. 构建与启动

```bash
cd /opt/bfcec-portal

# 构建
docker compose build

# 后台启动
docker compose up -d
```

### 4. 配置反向代理（可选）

使用 Nginx 反向代理示例（80 端口 → 容器 3000）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. 配置 HTTPS（推荐）

```bash
# 使用 Certbot + Nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. 设置开机自启

`docker-compose.yml` 已配置 `restart: unless-stopped`，Docker 服务启动后容器会自动启动：

```bash
# 确保 Docker 开机自启
sudo systemctl enable docker
```

---

## 常用运维命令

### 服务管理

```bash
docker compose up -d              # 后台启动
docker compose up -d --build      # 重新构建并启动
docker compose stop               # 停止服务
docker compose down               # 停止并删除容器
docker compose restart            # 重启服务
docker compose restart portal     # 仅重启 portal 服务
```

### 状态查看

```bash
docker compose ps                 # 容器状态（healthy/unhealthy）
docker compose logs -f            # 实时日志（Ctrl+C 退出）
docker compose logs --tail=100    # 最近 100 行日志
docker stats bfcec-portal         # CPU/内存占用
```

### 进入容器调试

```bash
docker compose exec portal sh                # 进入容器 shell
docker compose exec portal node -e "..."     # 在容器内执行 Node 代码
docker compose exec portal ls -la /app/data  # 查看容器内数据目录
```

### 镜像管理

```bash
docker images | grep bfcec        # 查看镜像
docker compose build --no-cache   # 无缓存构建（完全重新构建）
docker image prune -a             # 清理未使用的镜像
```

---

## 更新与回滚

### 更新部署

```bash
cd /opt/bfcec-portal

# 拉取最新代码
git pull origin master

# 重新构建并重启
docker compose up -d --build

# 清理旧镜像（可选）
docker image prune -f
```

### 回滚

```bash
# 查看镜像历史
docker images bfcec-portal

# 修改 docker-compose.yml 指定镜像版本
# image: bfcec-portal:v1.2.3

docker compose up -d
```

---

## 故障排查

### 容器无法启动

```bash
# 查看完整日志
docker compose logs portal

# 常见原因：
# 1. 端口被占用 → 修改 docker-compose.yml 中 ports 映射
# 2. 构建失败 → docker compose build --no-cache 重试
# 3. .env.local 缺失 → 确保文件存在且包含必需变量
```

### 页面 500 错误

```bash
# 查看容器日志
docker compose logs portal --tail=50

# 常见原因：
# 1. SESSION_SECRET 未设置 → 检查 env_file 是否正确加载
# 2. data/ 目录权限问题 → chmod 755 data/
```

### 后台登录失败

```bash
# 确认环境变量已注入
docker compose exec portal node -e "
  console.log('USER:', process.env.ADMIN_USERNAME)
  console.log('PASS:', process.env.ADMIN_PASSWORD ? '***set***' : 'MISSING')
  console.log('SECRET:', process.env.SESSION_SECRET ? '***set***' : 'MISSING')
"

# 如果变量为空，检查：
# 1. docker-compose.yml 中 env_file 路径是否正确
# 2. .env.local 是否存在于项目根目录
```

### 健康检查失败

```bash
# 健康检查等待 start_period 后才会开始，确认启动完成：
docker compose logs portal | grep -i "ready\|started\|listening"

# 手动测试
curl http://localhost:3000
```

### 构建慢或失败

```bash
# 清除 Docker 构建缓存
docker builder prune -a

# 检查网络连接（Alpine 需要下载依赖）
docker compose build --no-cache 2>&1 | tail -20
```
