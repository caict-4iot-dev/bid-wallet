# 一. 项目部署

### 依赖

项目基于node v8.17.0开发，npm安装依赖包。

### 构建
```npm install```

### 运行

```npm run dev```

### 打包

```npm run build```

### 备注

- 安装到浏览器：打包后，开启chrome浏览器扩展程序内的开发着模式，点击“加载已解压的扩展程序”，选择dist包。
- 运行：项目执行打包命令(npm run build)生成dist包后，才能执行运行命令（开发环境 npm run dev）。



# 二. 开发指南

### 目录结构

```
├─ README.md
├─ package.json       # 依赖项
├─ dist               # 打包dist
├─ release            # 打包后生成zip包
├─ core               # webpack配置
├─ static             # 插件图标
├─ src                # 源码
│  ├─ backend         # 持久化层
│  ├─ content         # 脚本层
│  ├─ lib             # 工具
│  ├─ message         # 本地通信配置
│  ├─ popup           # 业务层
│  │  ├─ compontents  # 自定义组件
│  │  ├─ config       # 业务配置项
│  │  ├─ eventBus     # 事件总线
│  │  ├─ lang         # 国际化配置
│  │  ├─ router       # vue路由配置
│  │  ├─ service      # 接口
│  │  ├─ static       # 图片及样式
│  │  ├─ views        # 业务视图
│  │  ├─ index.js     # 入口文件
│  ├─ manifest.js     # 插件配置项

```

### 技术分类

- 主要技术栈为：vue、axios、vuex、vue-router、scss
- UI库：vant
- 国际化：vue-i18n
- 打包工具：webpack



### 运行、打包配置项

打开项目内文件 src/popup/config/network.js，修改 networkEnvironment对象内参数。

```javascript
const networkEnvironment = {
  development: {
    rpcUrl: ''         // 开发环境 后台服务地址
  },
  production: {
    rpcUrl: ''        // 生产环境 后台服务地址
  }
}
```
打开项目内文件 src/popup/config/param.js 配置接口前缀
```javascript
export const serverName = '/server/'
```

### BID钱包图标配置
一级目录static/images文件夹内的三张png图片是BID钱包显示的图标，如要替换，需要按照 16×16、48×48、128×128的尺寸进行裁剪，图片命名需要与原有命名保持一致。





