# 闪封面 CoverFast

内容创作者封面生成器。在首页输入选题或上传参考图，即可生成小红书、短视频、公众号头图与视频缩略图封面，并配上可发布标题。

免费开始，无需登录。首期使用本地模板渲染引擎 + 平台标题文案引擎，不依赖外部 AI Key；会员与支付走模拟收银台，数据保存在浏览器 `localStorage`。

## 本地运行

```bash
npm install
npm run dev
```

默认开发端口为 **43127**。浏览器打开 [http://127.0.0.1:43127](http://127.0.0.1:43127)。

页头地球图标可切换 31 种语言；首次访问按 IP 国家选择默认语言（失败则简体中文）。阿拉伯语、希伯来语、乌尔都语、波斯语为 RTL。语言选择保存在 cookie 与 localStorage。

```bash
npm run build
npm start
```

## 站点

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：Hero 生成卡、四平台卖点、灵感、FAQ、方案 |
| `/generate` | 完整工作台：改字、换风格、导出 PNG |
| `/explore` | 灵感广场，「用同款」 |
| `/assets` | 本地作品库 |
| `/pricing` | 免费 / 创作者 / 专业，年付 -30% |
| `/about` | 产品说明 |
| `/changelog` | 更新日志 |
| `/login` | 本地模拟登录 / 注册 |
| `/checkout` | 模拟支付，确认即写入会员与积分 |

## 积分

- 标准生成 10
- 高清生成 20
- 四平台批量 30

免费方案每月 80 积分、每日 3 次下载、导出带「闪封面」水印。创作者与专业会员去水印，并可批量导出。

## 技术

Next.js App Router、TypeScript、Tailwind CSS、shadcn/ui、next-intl。封面导出使用 Canvas；`CoverProvider` 与 `PaymentPort` 预留给后续真实图像模型与支付渠道。
