# qiankun 部署指南

本文档说明主应用与子应用的生产构建、Docker 镜像、nginx 及 CI/CD 的配置与流程。

## 构建命令

| 模式 | 命令 | 说明 |
|------|------|------|
| 独立应用 | `pnpm build` | 标准 SPA 构建，输出 `dist/` |
| 主应用 | `pnpm build:main` | 主应用构建，依赖 `.env.main`（或 `vite build --mode main`） |
| 子应用 | `pnpm build:micro` | 子应用 UMD 构建，依赖 `.env.micro` 及 `VITE_APP_NAME`、`VITE_APP_PUBLIC_PATH` |

构建前请确保对应环境变量正确（子应用尤其注意 `VITE_APP_NAME`、`VITE_APP_PUBLIC_PATH` 与线上部署路径一致）。

## Docker 镜像构建

通过构建参数 `QIANKUN_MODE` 选择构建模式：

```bash
# 独立应用（默认）
docker build -t my-app:standalone .

# 主应用
docker build --build-arg QIANKUN_MODE=main -t my-app:main .

# 子应用
docker build --build-arg QIANKUN_MODE=micro -t my-app:micro .
```

镜像内使用 nginx 提供静态资源，默认复制 `nginx.conf`。若主应用/子应用需单独配置，可在 Dockerfile 中改为复制 `nginx.main.conf` 或 `nginx.micro.conf`（子应用配置含 CORS 头，便于被主应用跨域加载）。

## nginx 配置

- **通用**：项目根目录 `nginx.conf` 适用于独立应用与主应用，支持 History 路由（`try_files $uri $uri/ /index.html`）。
- **主应用**：可直接使用 `nginx.conf`；子应用通常部署在其它域名/路径，无需在主应用 nginx 中配置子应用代理。
- **子应用**：若被主应用跨域加载，建议使用 `nginx.micro.conf`，其包含 `Access-Control-Allow-Origin` 等 CORS 头；部署路径需与子应用 `VITE_APP_PUBLIC_PATH` 及主应用 `apps.js` 中 `entry` 一致。

资源路径：子应用构建产物中资源会按 `base`（即 `VITE_APP_PUBLIC_PATH`）生成引用路径，部署时需保证 nginx 的 `root`/`alias` 与该路径一致。

## 环境变量与 CORS

- 生产环境通过 nginx 或运行时注入的方式提供环境变量（如 API 地址）；前端仅能使用以 `VITE_` 开头的构建时变量。
- 子应用若与主应用不同域，子应用所在域名必须返回 CORS 头（使用 `nginx.micro.conf` 或等效配置），否则主应用无法加载子应用脚本。

## CI/CD 配置

- **CI**（`.github/workflows/ci.yml`）：对 `standalone`、`main`、`micro` 三种模式分别执行构建，验证均能通过。
- **Release**（`.github/workflows/release.yml`）：按 tag 触发后，对三种模式分别构建并上传产物，发布时提供三个 zip：`asgard-frontend-template-{standalone,main,micro}-{version}.zip`。

如需在 CI 中构建并推送 Docker 镜像，可增加 job：使用 `matrix` 传入 `QIANKUN_MODE`，执行 `docker build --build-arg QIANKUN_MODE=${{ matrix.mode }}`，并按需打 tag（如 `${{ matrix.mode }}-v${{ version }}`）推送到镜像仓库。

## 多环境部署示例

- **开发**：主应用 5174、子应用 5173，`apps.js` 中 entry 使用 `//localhost:5173/` 等。
- **预发/生产**：主应用与子应用分别部署到不同路径或域名，`apps.js` 中生产 entry 使用完整 URL（如 `https://sub.example.com/micro-app-1/`）；子应用构建时 `VITE_APP_PUBLIC_PATH` 与部署路径一致，并确保 nginx 配置 CORS（子应用）及 History 路由（主应用）。
