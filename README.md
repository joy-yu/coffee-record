# ☕ 手冲日志 Coffee Record

一款面向手冲咖啡爱好者的冲煮记录应用，以文艺咖啡厅为设计调性，帮助你追踪每一次冲煮的参数与感受。

数据完全存储在浏览器本地（localStorage），无需后端，无需账号。

---

## 功能特性

- **冲煮参数记录** — 豆名、产区、烘焙度、处理法、研磨度、粉水比、水温、闷蒸时间等
- **环境与器具** — 冲煮日期、天气、温度、湿度、磨豆机 / 手冲壶 / 滤杯品牌、豆子价格
- **口感评分** — 六维雷达图（酸度、甜度、苦度、醇厚、香气、余韵），星级总评，风味标签
- **照片上传** — 本地图片压缩至 ≤300 KB 后以 base64 存储，无需对象存储
- **历史记录** — 按日期分组的时间线视图，支持筛选与排序
- **统计首页** — 总冲煮次数、平均评分、最常用冲煮方式、最爱产区等统计摘要

---

## 技术栈

| 分类 | 选型 |
|------|------|
| 框架 | React 19 + Vite 6 |
| 语言 | TypeScript 5（strict 模式） |
| 路由 | React Router v7（BrowserRouter） |
| 样式 | Tailwind CSS v4 |
| 图表 | Recharts（RadarChart） |
| 图标 | Lucide React |
| 日期 | date-fns v4 |
| 存储 | localStorage（key: `coffee_records_v1`） |
| 字体 | 系统内置字体，无网络加载 |
| 格式化 | Prettier |

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（局域网可访问）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 格式化代码
npm run format
```

开发服务器默认监听 `0.0.0.0:5173`，局域网内其他设备可通过本机 IP 访问。

---

## 项目结构

```
src/
├── types.ts                     # 全局 TypeScript 类型定义
├── App.tsx                      # 路由入口
├── main.tsx                     # React 挂载点
├── index.css                    # Tailwind v4 主题与全局样式
│
├── context/
│   └── CoffeeContext.tsx        # 全局数据 Context
│
├── hooks/
│   └── useCoffeeRecords.ts      # localStorage CRUD 逻辑
│
├── utils/
│   └── imageUtils.ts            # Canvas 图片压缩
│
├── components/
│   ├── Layout.tsx               # 导航栏 + 页脚
│   ├── RecordCard.tsx           # 记录卡片
│   ├── RatingStars.tsx          # 星级评分组件
│   ├── FlavorTags.tsx           # 风味标签选择器
│   ├── TasteRadar.tsx           # 六维雷达图
│   └── RecordForm/
│       ├── StepBrewing.tsx      # 表单步骤 1：冲煮参数
│       ├── StepEnvironment.tsx  # 表单步骤 2：环境器具
│       └── StepTaste.tsx        # 表单步骤 3：口感心得
│
└── pages/
    ├── Home.tsx                 # 首页 / 统计摘要
    ├── NewRecord.tsx            # 新建记录（三步表单）
    ├── History.tsx              # 历史记录时间线
    └── Detail.tsx               # 记录详情
```

---

## 部署到 Vercel

项目已配置 [vercel.json](./vercel.json)，支持 BrowserRouter 的 SPA 回退。

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. 构建设置无需修改，Vercel 自动识别 Vite 项目：
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. 点击 Deploy 完成部署

---

## 数据说明

所有记录保存在浏览器的 `localStorage` 中，key 为 `coffee_records_v1`。清除浏览器缓存或卸载 PWA 会导致数据丢失，建议定期在浏览器控制台手动导出备份：

```js
copy(localStorage.getItem('coffee_records_v1'))
```
