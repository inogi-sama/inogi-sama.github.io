# Domel Intelligence 前端

由原始 7 个 Visily HTML 页面串联而成，保留原稿界面和图片，无须安装依赖。

## 打开方式

Windows 可双击 `START.cmd`，或在此目录打开终端，运行：

```powershell
node server.cjs
```

然后访问 http://127.0.0.1:4173 。结束时按 Ctrl+C。

也可以直接双击 `index.html` 浏览。浏览器可能限制 file:// 页面的存储能力，需要跨页面保留草稿时请使用上面的本地服务器。

## 页面

| 页面 | 文件 |
| --- | --- |
| 登录入口 | index.html |
| 研究工作台 | dashboard.html |
| 新建研究 | new-research.html |
| 研究进度 | research-progress.html |
| 证据审查 | evidence-review.html |
| 洞察 | insights-dashboard.html |
| 报告 | report.html |

侧栏、面包屑和业务按钮负责页面跳转；右下角页面选择器可直接访问全部页面。

## 可演示的流程

1. 输入任意格式正确的邮箱和非空演示密码，进入工作台。不要输入真实密码。登录仅演示界面，不提供账号认证或路由保护。
2. 点击 New Research，输入项目名和研究问题，选择行业和时间范围。
3. Save as Draft 保存并恢复草稿；Start AI Research 保存配置并进入进度页。
4. 进度为前端计时模拟，支持暂停、继续和重新尝试；可进入证据审查或洞察页。
5. 在证据页 Accept / Reject，保存审查记录；Review History 查看记录。
6. 洞察卡片 View Evidence 跳转审查；Export Report 进入报告。
7. 报告支持章节定位、打印和调用浏览器“另存为 PDF”。

## 范围

纯静态前端，无后端、真实研究引擎、原始来源文档或账号系统。图表、指标、报告内容和证据摘录沿用设计示例。浏览器本地保存草稿、配置和审查记录，Settings 可清除。Google 字体需要联网，离线时自动使用系统字体。布局保留原始 1440px 画板，适配笔记本缩放，小屏可以横向滚动。

原始导出目录未修改。共享行为位于 `app.js`，附加样式位于 `app.css`，各页图片按目录隔离，避免同名资源覆盖。
