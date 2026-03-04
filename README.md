# 古风舞蹈视频背景生成器

一个纯前端静态网页，用于快速生成古风舞蹈视频背景提示词（中英文）。

## 需要什么环境

- 浏览器（Chrome / Edge / Safari / Firefox 任一）
- 本地运行可选：
  - Python 3（用于临时静态服务）
  - 或 Docker（用于容器部署）

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

## 如何使用网页

1. 在“场景主题”中输入核心场景（必填）。
2. 选择时间氛围、视觉风格、镜头运动、画面比例。
3. 可选填写主色调、细节元素、负面提示词。
4. 调整“运动强度”和“动态光效”。
5. 点击“生成背景提示词”或直接实时查看生成结果。
6. 使用“复制 / 复制英文”粘贴到文生视频工具。
7. 可使用“随机灵感”快速给出一组可用参数。
8. 历史记录会自动保存最近 8 条，可点击复用。

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
