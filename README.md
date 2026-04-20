# SetuLot

> 🎰 一个基于 Lolicon API v2 的随机色图抽取网页

![Preview](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Preview](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Preview](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## ✨ 特性

- 🎨 **参数化抽取** — 支持 R18 模式、标签 AND/OR 组合、关键词搜索、长宽比筛选等
- 🖼️ **多规格图片** — 自由选择 original / regular / small / thumb / mini 五种尺寸
- 🔍 **详情展示** — 卡片展示标题、作者、标签、PID、原图分辨率及原作链接
- 💡 **灯箱预览** — 点击图片全屏查看，ESC 或点击遮罩关闭
- 📱 **响应式布局** — 适配桌面端与移动端
- ⚡ **异步请求** — 无刷新获取数据，加载状态反馈

---

## 🚀 快速开始

### 环境要求

任意现代浏览器（Chrome、Firefox、Safari、Edge 最新版）

> ⚠️ 由于浏览器跨域限制，请务必通过 **本地 HTTP 服务器** 访问页面

### 运行方式

**方式一：VS Code（推荐）**

1. 安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 扩展
2. 右键 `index.html` → **"Open with Live Server"**

**方式二：Python**

```bash
# Python 3
python -m http.server 8080

# 然后访问 http://localhost:8080
```

**方式三：Node.js**

```bash
npx serve .
# 然后访问 http://localhost:3000
```

**方式四：直接打开**

> 仅适合 API 支持 CORS 的情况，兼容性不稳定

双击 `index.html` 打开

---

## 📖 使用指南

### 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| **R18 模式** | `0` 非 R18 / `1` R18 / `2` 混合 | `0` |
| **返回数量** | 范围 1~20 | `1` |
| **关键词 (keyword)** | 模糊匹配标题、作者名、标签 | — |
| **标签 (tag)** | 支持 AND/OR 组合，详见 [API 文档](#api-参考) | — |
| **图片规格 (size)** | original / regular / small / thumb / mini | `["original"]` |
| **排除 AI 作品** | 是否过滤 AI 生成图 | `false` |
| **长宽比 (aspectRatio)** | 例：`lt1` 竖图 / `gt1` 横图 / `eq1` 正方形 | — |
| **图片代理 (proxy)** | 默认 `i.pixiv.re`，可自定义反代 | `i.pixiv.re` |

### 标签组合示例

```
标签: 萝莉|少女, 白丝|黑丝
```
表示 **(萝莉 OR 少女) AND (白丝 OR 黑丝)**

---

## 🔌 API 参考

本项目使用 [Lolicon API v2](https://github.com/Tsuk1ko/lolicon-api-docs) 提供数据。

<details>
<summary>请求示例</summary>

```http
POST https://api.lolicon.app/setu/v2
Content-Type: application/json

{
  "r18": 0,
  "num": 3,
  "tag": ["萝莉|少女", "白丝|黑丝"],
  "size": ["original", "regular"],
  "excludeAI": true
}
```

**响应示例：**

```json
{
  "error": "",
  "data": [
    {
      "pid": 90551655,
      "p": 0,
      "uid": 43454954,
      "title": "白丝少女",
      "author": "artist_name",
      "r18": false,
      "width": 2894,
      "height": 4093,
      "tags": ["萝莉", "白丝", "少女"],
      "ext": "jpg",
      "aiType": 1,
      "uploadDate": 1623639959000,
      "urls": {
        "original": "https://i.pixiv.re/img-original/img/...",
        "regular": "https://i.pixiv.re/img-master/img/..._master1200.jpg"
      }
    }
  ]
}
```

</details>

---

## ⚠️ 免责声明

1. 所有图片均来自 [Pixiv](https://www.pixiv.net/)，版权归属作品原作者
2. API 仅储存作品基本信息，不提供图片代理或储存服务
3. 本工具仅供学习与个人娱乐使用，请**理智冲浪**，**节制使用**
4. 本项目产生的任何问题与原作者无关

---

## 📂 项目结构

```
SetuLot/
├── index.html    # 主页面结构
├── style.css     # 样式表
├── app.js        # 核心逻辑（API 请求、渲染、灯箱）
└── README.md     # 本文件
```

---

## 🛠️ 技术栈

- **HTML5** — 语义化标签，结构清晰
- **CSS3** — Flexbox + Grid 布局，CSS 变量，动画
- **Vanilla JavaScript** — ES6+ 语法，无框架依赖，原生 Fetch API
- **Lolicon API v2** — 数据来源

---

## 📄 License

[apc License](LICENSE) — 可自由使用，但请保留本声明。

> 🎰 **SetuLot** — 抽卡一时爽，一直抽一直爽
