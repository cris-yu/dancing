# 古风舞蹈视频背景生成器

一个纯前端静态网页，用于快速生成古风舞蹈视频背景提示词（中英文）。

## 本地运行

### 方式一：Python 静态服务

```bash
python3 -m http.server 4173
```

打开：`http://localhost:4173`

### 方式二：Docker（推荐部署）

```bash
docker build -t dance-bg-generator .
docker run --rm -p 8080:80 dance-bg-generator
```

打开：`http://localhost:8080`

## 生产部署建议

本项目为静态站点，可直接部署到：

- Nginx
- Vercel / Netlify / Cloudflare Pages
- 任意对象存储静态托管（如 OSS / COS / S3）

若使用容器部署，直接复用仓库内 `Dockerfile` 即可。

## 文件说明

- `index.html`：页面结构
- `styles.css`：页面样式
- `script.js`：交互逻辑
- `Dockerfile`：容器化部署配置
- `nginx.conf`：Nginx 静态服务配置
