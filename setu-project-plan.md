# 🎨 Setu Modern Gallery — 项目计划书

> 基于 Lolicon API v2（随机色图 API）的现代化网页项目

---

## 一、项目概述

### 1.1 项目背景
基于 [Lolicon.app](https://api.lolicon.app/setu/v2) 提供的随机色图 API v2，构建一个现代化、高颜值、功能完整的插画作品浏览网页应用。该 API 提供丰富的 Pixiv 作品数据，支持多维度检索、标签匹配、图片多规格输出等功能。

### 1.2 项目目标
- 打造**视觉惊艳**的插画浏览体验
- 完整覆盖 API 所有功能，提供直观的交互界面
- 采用现代前端技术栈，保证**高性能**与**可维护性**
- 全平台适配（桌面端 / 平板 / 移动端）
- 支持深色 / 浅色模式

### 1.3 目标用户
- 插画爱好者、Pixiv 用户
- 二次元文化爱好者
- 需要批量检索插画素材的设计师 / 创作者

---

## 二、技术选型

### 2.1 核心技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | **React 18** | 组件化开发，生态丰富 |
| 语言 | **TypeScript** | 类型安全，提升代码质量 |
| 构建 | **Vite** | 极速 HMR，现代构建工具 |
| 样式 | **Tailwind CSS 3** | 原子化 CSS，快速构建 UI |
| 动画 | **Framer Motion** | 流畅的动画过渡效果 |
| 状态 | **Zustand** | 轻量级状态管理 |
| 请求 | **Axios** | HTTP 请求封装 |
| 路由 | **React Router 6** | SPA 路由管理 |
| 图标 | **Lucide React** | 现代化图标库 |
| 工具 | **ESLint + Prettier** | 代码规范与格式化 |

### 2.2 可选后端增强（按需）

| 服务 | 用途 | 说明 |
|------|------|------|
| Redis | 缓存层 | 缓存 API 响应，减少请求频率 |
| Vercel / Cloudflare | 部署 | 静态站 + Serverless Functions |

---

## 三、功能模块设计

### 3.1 核心功能

#### 3.1.1 随机浏览模式
- 首次进入展示随机作品
- "换一换"按钮随机刷新
- 瀑布流无限滚动加载

#### 3.1.2 高级搜索系统
- **标签搜索**：支持 AND / OR 逻辑（`tag[]` 数组 + `|` 分隔符）
- **关键词搜索**：标题 / 作者名模糊匹配
- **作者筛选**：指定 uid 数组
- **日期范围**：`dateAfter` / `dateBefore` 时间戳筛选
- **比例筛选**：`aspectRatio` 参数，支持竖图 / 横图 / 16:9 等

#### 3.1.3 R18 内容管理
- 三种模式：`0` 非 R18、`1` 仅 R18、`2` 混合
- 首次进入弹窗确认年龄（合规性）
- R18 作品默认模糊处理，点击后确认查看

#### 3.1.4 图片多规格切换
- 支持 5 种规格：`original` / `regular` / `small` / `thumb` / `mini`
- 一键切换显示分辨率
- 下载原图功能

#### 3.1.5 AI 作品标记
- 根据 `aiType` 字段显示 AI 标识
- 支持 `excludeAI` 参数过滤 AI 作品

### 3.2 辅助功能

| 功能 | 说明 |
|------|------|
| **自定义反代** | 支持配置 `proxy` 参数，替换默认 `i.pixiv.re` |
| **标签自动转换** | `dsc` 参数控制缩写转换（如 vtb → VTuber） |
| **收藏夹** | 本地 localStorage 存储喜欢的作品 |
| **图片分享** | 复制链接 / 二维码生成 |
| **全屏模式** | 沉浸式浏览体验 |
| **键盘导航** | 方向键切换、ESC 退出 |

### 3.3 数据展示

每张作品卡片展示：

```
┌──────────────────────┐
│        🖼️           │  ← 图片（懒加载）
│     [R18] [AI]      │  ← 标识徽章
├──────────────────────┤
│ 作品标题              │
│ 作者名                │
│ 🏷️ 标签1 标签2 标签3 │
│ 1280×720  │  2024-01  │
│ ♥ 收藏     🔗 分享   │
└──────────────────────┘
```

---

## 四、UI/UX 设计

### 4.1 设计理念
- **简约但不简单**：大留白、精致排版、细腻动效
- **沉浸式体验**：暗色背景衬托画作，减少视觉干扰
- **质感细节**：毛玻璃效果、微渐变、柔和阴影
- **响应式至上**：从手机到大屏显示器无缝适配

### 4.2 页面结构

```
┌──────────────────────────────────────────────┐
│  🎨 Setu Gallery     🔍 [搜索框]   🌙 设置  │  ← 顶栏
├──────────────────────────────────────────────┤
│  [筛选面板]                                   │  ← 可折叠
│  R18: ○关闭 ●仅R18 ○混合                      │
│  数量: [1-20]  比例: [全部/竖图/横图]         │
│  标签: [输入框 + 标签列表]                     │
│  AI过滤: [✓ 排除AI作品]                       │
│  [应用筛选] [重置]                            │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │ 🖼️  │ │ 🖼️  │ │ 🖼️  │ │ 🖼️  │           │  ← 瀑布流
│  └─────┘ └─────┘ └─────┘ └─────┘           │  ← 网格布局
│  ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │ 🖼️  │ │ 🖼️  │ │ 🖼️  │                    │
│  └─────┘ └─────┘ └─────┘                    │
│                                              │
│              [ 加载更多... ]                  │
├──────────────────────────────────────────────┤
│  共 42 张  |  Page 1/3  |  ◀ ▶              │  ← 底栏
└──────────────────────────────────────────────┘
```

### 4.3 配色方案

| 用途 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 背景 | `#FAFAFA` | `#0A0A0F` |
| 卡片 | `#FFFFFF` | `#1A1A2E` |
| 主色 | `#6C63FF` | `#7C73FF` |
| 渐变 | `#6C63FF → #E040FB` | 同左 |
| 文字 | `#1A1A2E` | `#E8E8F0` |
| 次要 | `#666680` | `#9999B0` |

### 4.4 字体系统
- **主字体**：Inter（英文） / Noto Sans SC（中文）
- **标题**：font-bold, tracking-tight
- **正文**：font-normal, leading-relaxed
- **标签**：font-mono, text-xs

### 4.5 响应式断点

| 断点 | 列数 | 图片尺寸 |
|------|------|----------|
| < 640px | 1 | mini |
| 640-768px | 2 | thumb |
| 768-1024px | 3 | small |
| 1024-1280px | 4 | regular |
| > 1280px | 5-6 | regular/original |

---

## 五、API 集成设计

### 5.1 API 端点
```
GET  https://api.lolicon.app/setu/v2
POST https://api.lolicon.app/setu/v2
Content-Type: application/json
```

### 5.2 请求参数映射

```typescript
interface SetuRequestParams {
  r18?: 0 | 1 | 2;           // R18 过滤
  num?: number;               // 数量 1-20
  uid?: number[];             // 作者 ID 数组
  keyword?: string;           // 关键词模糊搜索
  tag?: string[] | string[][]; // 标签 AND/OR
  size?: string[];            // 图片规格
  proxy?: string;             // 反代地址
  dateAfter?: number;         // 起始日期（毫秒时间戳）
  dateBefore?: number;        // 截止日期（毫秒时间戳）
  dsc?: boolean;              // 禁用缩写转换
  excludeAI?: boolean;        // 排除 AI 作品
  aspectRatio?: string;       // 长宽比
}
```

### 5.3 响应数据结构

```typescript
interface SetuResponse {
  error: string;           // 错误信息
  data: SetuItem[];        // 作品数组
}

interface SetuItem {
  pid: number;             // 作品 ID
  p: number;               // 页数
  uid: number;             // 作者 ID
  title: string;           // 作品标题
  author: string;          // 作者名
  r18: boolean;            // 是否 R18
  width: number;           // 原图宽度
  height: number;          // 原图高度
  tags: string[];          // 标签列表
  ext: string;             // 扩展名
  aiType: number;          // AI 类型 0/1/2
  uploadDate: number;      // 上传时间戳
  urls: Record<string, string>; // 各规格图片地址
}
```

### 5.4 请求封装层设计

```
src/services/
├── api/
│   ├── client.ts          # Axios 实例（拦截器、超时、重试）
│   ├── setuApi.ts         # API 方法封装
│   └── types.ts           # 类型定义
├── cache/
│   └── storage.ts         # 本地缓存策略
├── hooks/
│   ├── useSetuImages.ts   # 图片数据获取 Hook
│   ├── useFilters.ts      # 筛选状态 Hook
│   └── useLazyLoad.ts     # 懒加载 Hook
└── utils/
    ├── proxy.ts           # 反代地址处理
    └── format.ts          # 数据格式化
```

### 5.5 缓存策略
- **请求缓存**：相同的请求参数缓存 5 分钟（内存缓存）
- **图片缓存**：浏览器原生 `<img>` 缓存 + Service Worker
- **偏好缓存**：用户偏好设置存 localStorage

---

## 六、项目结构

```
setu-gallery/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── gallery/
│   │   │   ├── ImageGrid.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   └── MasonryLayout.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── TagInput.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── Toast.tsx
│   ├── hooks/
│   ├── services/
│   ├── store/
│   │   ├── useGalleryStore.ts
│   │   └── usePreferencesStore.ts
│   ├── types/
│   ├── utils/
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 七、开发计划

### Phase 1 — 基础设施（第 1 周）
| 任务 | 产出 |
|------|------|
| 项目初始化（Vite + React + TS） | 可运行项目模板 |
| 配置 Tailwind + 主题系统 | 深色/浅色切换 |
| 配置 ESLint + Prettier | 代码规范 |
| 搭建基础布局组件 | Header / Footer / 布局骨架 |

### Phase 2 — API 集成（第 2 周）
| 任务 | 产出 |
|------|------|
| 封装 Axios 客户端 | 请求/响应拦截器 |
| 实现 Setu API 调用方法 | GET / POST 双模式 |
| 类型定义 | 完整的 TypeScript 类型 |
| 错误处理 | 统一错误反馈 |

### Phase 3 — 核心功能（第 3-4 周）
| 任务 | 产出 |
|------|------|
| 图片网格组件 | 响应式瀑布流 |
| 搜索筛选面板 | 全部参数交互 |
| 标签输入系统 | AND/OR 逻辑，标签渲染 |
| 图片详情弹窗 | 预览、信息展示、多规格切换 |
| R18 模糊处理 | 合规弹窗 + 模糊效果 |

### Phase 4 — 交互体验（第 5 周）
| 任务 | 产出 |
|------|------|
| Framer Motion 动画 | 入场、切换、弹窗动效 |
| 懒加载 + 骨架屏 | 加载优化 |
| 键盘导航 | 快捷键支持 |
| 无限滚动 / 分页 | 滚动加载 |

### Phase 5 — 进阶功能（第 6 周）
| 任务 | 产出 |
|------|------|
| 收藏夹（localStorage） | 收藏/取消/列表 |
| 图片下载 | 原图下载功能 |
| 自定义反代设置 | 代理配置 UI |
| 日期筛选 | 日期选择器 |
| 比例筛选 | 可视化比例选择 |

### Phase 6 — 打磨与优化（第 7 周）
| 任务 | 产出 |
|------|------|
| 性能优化 | Lighthouse 评分 ≥ 90 |
| 响应式调试 | 全设备适配 |
| 加载性能 | Bundle 体积优化 |
| 可访问性 | ARIA 标签、键盘操作 |

### Phase 7 — 部署（第 8 周）
| 任务 | 产出 |
|------|------|
| Vercel / Netlify 部署 | 线上可访问 |
| 自定义域名（可选） | 域名绑定 |
| CI/CD 配置 | GitHub Actions 自动部署 |

---

## 八、关键交互流程

### 8.1 首次访问流程

```
访问页面
  → 检测是否有 R18 确认记录
  → 无 → 弹出年龄确认弹窗
  → 确认 → 存入 localStorage
  → 加载默认随机作品（r18=0, num=20）
  → 渲染瀑布流
```

### 8.2 搜索流程

```
用户输入标签 / 关键词
  → 防抖 300ms
  → 构建请求参数（tag AND/OR 逻辑）
  → 携带可选筛选（r18, size, aspectRatio...）
  → POST 请求（更复杂的参数结构）
  → 展示结果 + 更新 URL 查询参数（可分享）
  → 支持 "加载更多" 翻页
```

### 8.3 图片查看流程

```
点击图片卡片
  → 弹窗全屏预览
  → 展示完整元数据（标题、作者、标签、尺寸）
  → 支持切换图片规格（original/regular/small...）
  → 支持键盘 ← → 切换上一张/下一张
  → ESC 关闭 / 点击背景关闭
```

---

## 九、测试策略

| 测试类型 | 工具 | 覆盖范围 |
|----------|------|----------|
| 单元测试 | Vitest | 工具函数、类型守卫 |
| 组件测试 | Testing Library | UI 组件渲染与交互 |
| API 测试 | MSW (Mock Service Worker) | 请求参数正确性 |
| E2E 测试 | Playwright | 核心用户流程 |
| 性能测试 | Lighthouse CI | 性能、可访问性、SEO |

---

## 十、部署方案

### 方案一：纯前端静态部署（推荐）
```
Vercel / Cloudflare Pages
  → 零服务器运维
  → 全球 CDN 加速
  → 自动 HTTPS
  → Git 集成自动部署
```

### 方案二：Node.js 中间层
```
Vercel Serverless / 云函数
  → 请求转发 + 缓存层
  → API Key 保护（不暴露前端）
  → 请求频率控制
```

---

## 十一、ROI 与成功指标

| 指标 | 目标值 |
|------|--------|
| 首屏加载时间 | ≤ 1.5s |
| Lighthouse 性能 | ≥ 95 |
| Lighthouse 可访问性 | ≥ 90 |
| 交互响应时间 | ≤ 100ms |
| 移动端适配 | 完美适配 320px+ |
| 浏览器兼容 | Chrome / Firefox / Safari / Edge |

---

## 十二、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| API 请求频率限制 | 用户体验下降 | 缓存 + 请求节流 |
| 图片加载失败/403 | 图片无法显示 | 备用反代 + 错误重试 |
| R18 内容合规 | 法律风险 | 年龄确认 + 模糊处理 |
| API 接口变更 | 功能失效 | 版本管理 + 适配层 |
| 图片版权问题 | 法律风险 | 添加来源链接 + 免责声明 |

---

## 十三、总结

本项目基于 Lolicon API v2 构建一个现代化、高性能的插画作品浏览应用。通过 React + TypeScript + Tailwind CSS 技术栈，搭配 Framer Motion 动效和响应式设计，打造极致视觉体验。项目计划 8 周完成，覆盖从 API 集成到部署上线的完整流程。

核心亮点：
- **全参数覆盖**：完整实现 API 所有功能
- **极致视觉**：深色/浅色模式 + 动效细节
- **全平台适配**：响应式 + 移动端优先
- **工程化规范**：TypeScript + 测试 + CI/CD

---

> 📅 计划编制：2026 年 4 月
> 📝 版本：v1.0
