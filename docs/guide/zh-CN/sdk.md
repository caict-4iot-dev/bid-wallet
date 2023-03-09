# Bid Wallet SDK 调用说明
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
// resp:
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

```json
resp:

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
