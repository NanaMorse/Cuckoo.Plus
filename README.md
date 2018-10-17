# Cuckoo.Plus
A GooglePlus-Like third-party web client for mastodon.

alpha view link: [Cuckoo.Social](http://www.cuckoo.social)

Start project.
```
npm i
npm run dev
```
then open [localhost:3000](http://localhost:3000) in the browser.

Build project.
```
npm run build
```
the files located in public folder are all you need

我英语很烂，还是让我用中文写README吧。

## 目标

### 已完成
- 没有

### 部分完成 / 开发中
- Post Card
    - 未完成
        - 点击头像或者姓名跳转至对应个人页面
        - 在新页面中打开完整卡片
        - 忽略该post
        - 文本内容格式化
            - 替换content原始HTML
            - 支持简单markdown
        - 优化媒体内容展示
        - 显示转发内容
        - 回复po主或者其他人
        - 分享该post
    - 已完成
        - 卡片基本样式与内容展示
        - +1功能

### 尚未开始
- 加载更多post
- 发表新post
- 还有太多列不动

## Licence
MIT.
