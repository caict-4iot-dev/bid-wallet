// 连接状态
export const CONTENT = 'BID_CONTENT'
export const INJECT = 'BID_INJECT'

// 消息type
export const INIT = 'init' // 初始化 备用
export const SENDRANDOM = 'send_random' // 登陆 发送待签名串
export const AUTHORIZATION = 'authorization' // 授权
export const LOGINAUTHORIZATION = 'login_authorization' // 登陆授权
export const CHECKAUTHORIZATION = 'check_authorization' // 授权
export const CLIENTSENDMSG = 'client_send_msg' // 客户端发送消息
export const GETPV = 'get_pv' // 数字凭证

export const CHECKTRANSACTTION = 'check_transaction' // 审核授权 - 交易界面
export const CHECK_MULTIPLE_TRANSACTTION = 'check_multiple_transaction' // 审核授权 - 交易界面 - 首次签名
export const CHECK_ONCE_TRANSACTTION = 'check_once_transaction' // 审核授权 - 交易界面 - 再次签名
export const CHANGE_CURRENT_ACCOUNT = 'change_current_account' // 切换账户
export const LOGIN_AUTH = 'login_auth' // 对外-授权
export const SIGN_AUTH = 'sign_auth' // 对外-随机数签名
export const SIGN_MESSAGE = 'sign_message' // 对外-明文签名

export const RESULT = {
  CHECK_TRANSITION_SIGN: 'check_transaction_sign',
  CHECK_FIRST_TRANSITION_SIGN: 'check_first_transition_sign',
  CHECK_SECOND_TRANSITION_SIGN: 'check_second_transition_sign'
}
