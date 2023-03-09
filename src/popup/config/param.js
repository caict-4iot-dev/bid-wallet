// 系统参数
export const hdPaths = 'm/44\'/2022\'/0\'/0/0'

// 默认锁定时间(分钟)
export const lockTimeDef = 5
// 接口地址前缀
export const serverName = '/server/'
// 限制钱包账户个数
export const accountLength = 20

export const encryption = {
  'ED': {
    name: 'ED25519',
    type: 'TYPE_ED25519'
  },
  'SM': {
    name: 'SM2',
    type: 'TYPE_SM2',
    hardwareType: 'z'
  }
}

// 正则 8-20位字符且包含大小字母、数字和键盘字符
export const pwPattern = '^(?=.*((?=[\x21-\x7e]+)[^A-Za-z0-9]))(?=.*[a-zA-Z])(?=.*[0-9])[^\u4e00-\u9fa5]{8,20}$'
// 数字、允许小数
export const amountPattern = '^[0-9]+(.[0-9]*)?$'
// 手机号
export const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
// 邮箱
export const emailPattern = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
// 身份证号
export const idNumberPattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// 消息类型
export const msgType = {
  sign: 'CONNECT_SIGN',
  tran: 'TRANSFER_SIGN',
  loginSign: 'login_authorization',
  checkTransitionSign: 'check_transaction_sign',
  checkFirstTransitionSign: 'check_first_transition_sign',
  checkSecondTransitionSign: 'check_second_transition_sign'
}
export const sendMsgType = {
  sendRandom: 'send_random'
}
export const resultType = {
  resultLogin: 'RESULT_LOGIN'
}
