# AI 选股 · 短线终端 v3.0

隔日短线量化选股 + 主力资金 + 真实 AI 研判 + 模拟盘复利，安卓 APK / PWA 双端。

## v3.0 重点

### 1. 多数据源冗余（解决「刷新失败」）
东财全市场列表接口 `clist` 已不可用（连接被断），因此改为：

| 用途 | 主源 | 备源 |
|---|---|---|
| 全市场快照 | 东财 `clist` | **新浪财经** `Market_Center.getHQNodeData` |
| 主力资金/量比/行业 | 东财 `ulist.np` 批量补全 | — |
| 日 K 线 | 东财 `push2his` | — |

- 启动先探测东财，失败自动切新浪（约 5579 只，4~5 秒）。
- 候选股用东财 `ulist` 批量补全量比、主力净流入、行业、PE/PB/市值。
- 界面右上角显示当前数据源；设置页「网络自检」可一键诊断。

### 2. 主题
日间 / 夜间 / 跟随系统，顶栏 ◐ 一键切换，选择持久化。

### 3. 原生质感与动画
- 卡片入场错落动画、按钮/行按下缩放反馈、Tab 图标弹跳
- 骨架屏加载、加载转圈、进度条渐变
- 触感震动（Android `navigator.vibrate`）
- 安全区适配、滚动回弹抑制、tabular-nums 数字对齐

### 4. 功能
- **短线**：四种策略（涨停基因 / 主力抢筹 / 回踩低吸 / 趋势突破）
- **个股详情**：K 线（收盘+MA5+MA20）、技术面、盘口估值、同风格历史回测、AI 单票点评、加自选
- **行情**：三大指数、情绪指数、涨跌分布 11 档、板块热度、主力净流入/流出、领涨领跌
- **自选**：实时价、浮盈、搜索添加
- **模拟盘**：净值曲线、夏普、最大回撤、最大连亏、持仓盈亏标记、复利测算器、一键清仓
- **设置**：AI 配置 + 交易纪律 + 筛选 + 模拟盘 + 导出数据 + 网络自检 + **保存按钮**

## 工程结构

```
ai-picker-apk/
├── www/index.html            应用本体（单文件，无外部依赖）
├── capacitor.config.json     Capacitor 配置（已启用 CapacitorHttp 原生网络）
├── patch-android.js          构建时给 AndroidManifest 补联网权限
├── package.json
├── .github/workflows/build-apk.yml   云端出 APK
└── README.md
```

## 出 APK（GitHub Actions）

1. 新建 GitHub 仓库（Public），上传本工程全部文件
2. Actions → **Build APK** → Run workflow
3. 3~6 分钟后在 Artifacts 下载 `app-debug.apk`
4. 装到安卓手机（允许「未知来源」）

或本地执行 `python3 deploy.py <token>` 自动建仓+上传+构建。

## 当 PWA 用（免 APK）

安卓 Chrome 打开 `www/index.html` → 菜单「添加到主屏幕」。

## 数据与安全

- 行情：东方财富 / 新浪财经公开接口（均允许浏览器跨域）
- AI：OpenAI 兼容（默认 DeepSeek `https://api.deepseek.com`，模型 `deepseek-chat`）
- API Key 仅存本机 localStorage，不上传
- 结果仅供研究，**不构成投资建议**
