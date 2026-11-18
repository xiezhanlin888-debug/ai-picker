# AI 选股神器 · 安卓版（APK）

一个**隔日短线量化选股 + 主力资金 + 真实 AI 分析 + 模拟盘复利**的自包含网页应用，可直接当 PWA 用，也可打包成安卓 APK。

## 功能

- **短线**：AI 每日市场分析（DeepSeek）+ 短线买入计划（评分/目标价/止损价）+ 主力资金前列 + 一键结算
- **行情**：市场情绪（涨跌/涨跌停/成交额）+ 领涨领跌榜 + 板块热度 + 主力资金净流入/流出
- **自选**：添加/删除自选股，实时价格与涨跌
- **模拟盘**：账户净值曲线、持仓实时盈亏（盯盘标记）、复利估算器、一键清仓、成交记录
- **设置**：AI 接口/模型/Key、止盈止损/仓位/候选数、初始资金/费率

## 目录结构

```
ai-picker-apk/
├── www/index.html            # 全部应用逻辑（单文件，无外部依赖）
├── capacitor.config.json     # Capacitor 配置
├── package.json              # 依赖清单
├── .github/workflows/build-apk.yml   # 云端自动出 APK
└── README.md
```

## 方式 A：直接当 App 用（PWA，无需 APK）

1. 把 `www/index.html` 传到安卓手机（微信/QQ/网盘/USB 任意方式）。
2. 用手机浏览器（Chrome）打开这个文件。
3. Chrome 菜单 → **「添加到主屏幕」**。
4. 桌面出现「AI 选股神器」图标，点击即打开。

> 首次使用进「设置」页填 API Key（保存在本机浏览器 localStorage）。

## 方式 B：云端打包成真 APK（GitHub Actions）

> 说明：构建安卓 APK 需要 Android SDK + JDK 工具链，只能在云端（GitHub）跑。

### 一次性的准备（5 分钟）

1. 注册 GitHub 账号（免费）：https://github.com
2. 新建仓库（名字随意，如 `ai-picker`），选 **Public**（免费额度用 Actions 需 Public）。
3. 把本工程所有文件上传到该仓库根目录（GitHub 网页端「Add file → Upload files」直接拖入）。

### 触发构建（每次要新包时）

1. 仓库 → **Actions** 标签 → 左侧 **Build APK** → **Run workflow**。
2. 等 3~6 分钟，构建完成出现 **ai-picker-debug-apk** 下载项。
3. 下载 `app-debug.apk` → 传到安卓手机安装。

### 安装注意

- 这是 **debug 签名** APK，安卓会提示「未知来源」→ 允许「安装未知应用」。
- 要正式发布/上架需配置正式签名（后续可加）。

## 数据与安全

- 行情数据来自东方财富公开接口（已确认支持浏览器跨域）。
- AI 使用 OpenAI 兼容接口（默认 DeepSeek：`https://api.deepseek.com`，模型 `deepseek-chat`）。
- API Key 只保存在本机（浏览器 localStorage / App WebView 本地存储），不上传。
- 所有结果为量化信号，仅供研究，**不构成投资建议**。
