# 多阶段构建 Dockerfile
#
# 构建参数:
#   QIANKUN_MODE - 微前端模式: standalone(默认) | main(主应用) | micro(子应用)
#   MODE         - Vite 模式, 默认 production (保留兼容)
#
# 示例:
#   docker build --build-arg QIANKUN_MODE=standalone .
#   docker build --build-arg QIANKUN_MODE=main .
#   docker build --build-arg QIANKUN_MODE=micro .
#
# 阶段 1: 构建阶段
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm（使用 npm 直接安装，更可靠）
RUN npm install -g pnpm@10.28.0

# 构建参数: QIANKUN_MODE 决定构建主应用/子应用/独立应用
ARG QIANKUN_MODE=standalone
ARG MODE=production

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 pnpm 的冻结锁文件）
RUN pnpm install --frozen-lockfile

# 复制项目文件（含 .env.main / .env.micro 供按模式构建）
COPY . .

# 按 QIANKUN_MODE 选择构建命令
RUN if [ "$QIANKUN_MODE" = "main" ]; then \
      pnpm build:main; \
    elif [ "$QIANKUN_MODE" = "micro" ]; then \
      pnpm build:micro; \
    else \
      pnpm build -- --mode=${MODE}; \
    fi

# 阶段 2: 运行阶段
FROM nginx:alpine AS runner

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
