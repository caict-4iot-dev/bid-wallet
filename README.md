# **Bid Wallet**
Bid Wallet内部提供了数字身份服务，是为数字凭证颁发方提供了数字凭证管理及服务能力，Bid Wallet开发及数字凭证的使用可以通过该文档进行对接，使您可以在自建应用系统进行数字凭证的应用。



## 功能特性
**用户数字身份管理**

为用户提供身份的创建、导入，同时支持导出用户私钥。

**发证方凭证管理**

提供数字凭证的申请、进度查询、出示凭证。

**扩展能力**

提供应用测可调的扩展能力（授权、签名、出示并验证凭证等SDK）。



## 软件架构

为了符合浏览器插件的上架、安装、运行规范及具体业务需求，BID浏览器钱包内除必要的配置文件外，整体架构分为三个层级，视图层（popup）、核心控制层（background）、用户接口层（contentscript），基于此结构开发后，用webpack将代码编译为符合浏览器插件安装规范的安装包。

Bid Wallet在用户接口层中实现SDK扩展，用户在下载安装Bid Wallet可使用授权、签名等不同的开放扩展能力。

![image-20230202143631869.png](https://cdn.nlark.com/yuque/0/2023/png/27204995/1676364914237-423be945-1ace-4fb9-b246-ccc7998c9b39.png#averageHue=%23f6f6f6&clientId=u096700b9-30e7-4&from=drop&id=u21f9eec1&name=image-20230202143631869.png&originHeight=974&originWidth=2134&originalType=binary&ratio=1&rotation=0&showTitle=false&size=100768&status=done&style=none&taskId=ued0beb6c-c67d-4c4e-a91f-b4291d62c83&title=)

视图层：主要开发技术使用VUE，vant作为UI框架，自定义样式使用scss，使用i18n维护、切换国际化语言。

控制层：调用chrome API实现通信、打开popup浏览器窗口、chrome本地存储等功能。

用户接口层：输出SDK脚本，传递请求数据与结果数据。



## 快速开始

### 依赖检查
项目基于node v8.17.0开发，npm安装依赖包。

### 构建
```npm install```

### 运行

```npm run dev```

### 打包

```npm run build```

### 备注

- 安装到浏览器：打包后，开启浏览器扩展程序内的开发着模式，点击“加载已解压的扩展程序”，选择dist包。
- 运行：项目执行打包命令(npm run build)生成dist包后，才能执行运行命令（开发环境 npm run dev）。

## 使用指南

### 目录结构

```
├─ README.md
├─ contract           # 可信数据集合约以及规范
├─ docs               # 开发文档
│  ├─ devel           # 开发指南
│  ├─ guide           # 接口文档
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

- 主要技术栈为：vue、axios、vuex、vue-router、scss、vue-i18n
- UI库：vant
- 打包工具：webpack



### 运行、打包配置

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

## Bid Wallet SDK 调用说明

以电脑端浏览器应用为例，借助Bid Wallet SDK完成对数字凭证的应用，完成浏览器插件的安装后会自动将插件脚本对象注入到浏览器中，应用侧调用SDK提供相关接口即可使用浏览器插件钱包的开发能力。

#### 概览

| 接口名           | 接口功能描述                |
| ---------------- | --------------------------- |
| window.bidWallet | 在浏览器中检测bidWallet对象 |
| signAuth         | 签名授权                    |
| getPV            | 出示并验证数字凭证          |
| signMessage      | 消息签名                    |



#### 调用方法

```javascript
var bidWallet = null
if (typeOf window.bidWallet !== 'undefined') {
  bidWallet = window.bidWallet
} else {
  console.info("插件未安装")
}
```



#### 签名授权

通过该方法可以提供给业务侧生成的随机串进行签名，签名后会返回该随机串、签名账户的公钥、BID以及签名串供业务侧进行验证。特别提醒：**randomCode**必须是一个16进制的字符串。

```javascript
var obj = {
  // 16进制字符串
  randomCode:'839402'
}
bidWallet.signAuth(obj, function(resp){
})
```

**请求字段:**

| 字段名     | 类型   | 描述                     |
| ---------- | ------ | ------------------------ |
| randomCode | String | 业务侧提供的16进制字符串 |

**返回值：**

```javascript
{
    "code": 0,
    "data": {
        "publicKey": "b07a66045197ea4f790e74b3614f771ea5caba335e14c145d0ef02f65710395334078fee0ae302a0ecf338b2474fea96ddafdfcb3fa9269a6165b2caf28c9ca06b14703f",
        "signData": "d4c281c8d76d6579258f4104ea662b8f03918b3710c824cba5591808c0dc2e659206c774cab9a7f5c976a50668b1e993eb9e0cb55373f37bdd40a61be7d5837a",
        "bid": "did:bid:zf5EHbHLDDEgY5rA2hnwp5YPhaw9iUPu",
        "randomCode": "839402"
    },
    "message": ""
}
```



**返回参数说明:**

| **字段名**          | **类型**   | **描述**              |
| ------------------- | ---------- | --------------------- |
| **code**            | **Int**    | **错误码**            |
| **message**         | **String** | **接口返回消息**      |
| **data.publicKey**  | **String** | **钱包签名账户公钥**  |
| **data.signData**   | **String** | **签名串**            |
| **data.bid**        | **String** | **钱包签名账户的BID** |
| **data.randomCode** | **String** | **随机串的16进制串**  |

**错误码说明:**

| **错误码** | **说明**                       |
| ---------- | ------------------------------ |
| **1**      | **用户在钱包界面执行取消操作** |
| **0**      | **请求成功**                   |



#### 出示并验证数字凭证

调用该方法可以选择性出示数字凭证声明，且验证服务会对该声明进行验证，验证通过后会返回"验证通过证明"、"证明内容"及"验证方公钥"。

```javascript
var obj = {
  ctid:'did:bid:efvBPiZWCuB89LpynLUpmXCozjGEouhU',
  vpList:['name','age'],
  address:'did:bid:efPiZuNndJuKsBUavPxq186TBNEFziCP'
}
bidWallet.getPV(obj, function(resp){

})
```

**请求字段:**

| 字段名   | 类型   | 描述                        |
| ------- | ------ | -------------------------------- |
| ctid    | String | 凭证模板ID        |
| vpList  | Array  | 需要出示的内容，需对应凭证模板ID |
| address | String | 出示数字凭证的钱包账户地址    |                 |


**返回值：**

| 字段名            | 类型   | 描述                                  |
| ----------------- | ------ | ------------------------------------- |
| code              | Int    | 错误码                                |
| message           | String | 接⼝返回消息                          |
| data.result       | Boolean | 验证结果                |
| data.errorMessage | String | 验证（不通过）的描述信息              |

```javascript
{
  code: 0,
  data: {
    result: true
  },
  message: ''
}
```
**错误码说明:**

| **错误码** | **说明**                       |
| ---------- | ------------------------------ |
| **1**      | **用户在钱包界面执行取消操作** |
| **0**      | **请求成功**                   |


#### 消息签名
通过调用该方法可以支持应用侧传入消息内容，让钱包对其签名。调用该方法后会唤起插件钱包，并展示要签名的内容，操作者签名后会返回原始消息内容、签名账户公钥、签名串等。
**_特别提醒：业务侧需要进行验签操作时需要将原始消息内容进行16进制转换后再通过bid sdk进行验证。_**

```javascript
var obj = {
  message: '欢迎使用...'
}
bidWallet.signMessage(obj, function(resp){

})
```
**请求字段:**

| 字段名  | 类型   | 描述                   |
| ------- | ------ | ---------------------- |
| message | String | 业务侧提供的待签名信息 |

**返回参数说明:**

| **字段名**         | **类型**   | **描述**              |
| ------------------ | ---------- | --------------------- |
| **code**           | **Int**    | **错误码**            |
| **message**        | **String** | **接口返回消息**      |
| **data.publicKey** | **String** | **钱包签名账户公钥**  |
| **data.signData**  | **String** | **签名串**            |
| **data.bid**       | **String** | **钱包签名账户的BID** |
| **data.message**   | **String** | **待签名信息**        |

**错误码说明:**

| **错误码** | **说明**                       |
| ---------- | ------------------------------ |
| **1**      | **用户在钱包界面执行取消操作** |
| **0**      | **请求成功**                   |

