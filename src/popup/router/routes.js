// 欢迎页
import Welcome from '../views/single/welcome'

// 创建账户
import InitAccount from '../views/single/initAccount/initAccount'
// 导入钱包
import ImportWallet from '../views/single/importWallet'

// 恢复账户
import RestoreAccount from '../views/restoreAccount'
import KindPrivateKey from '../views/restoreAccount/restoreKind/privateKey'
import KindKeystore from '../views/restoreAccount/restoreKind/keystore'
import KindMnemonicWord from '../views/restoreAccount/restoreKind/mnemonicWord'
import RestoreResult from '../views/restoreAccount/result'

// 连接 - 选择账户
import SignUser from '../views/single/sign/signUser'
// 连接 - 询问
import SignConfirm from '../views/single/sign/signConfirm'
// 连接 - 提交
import SignRequest from '../views/single/sign/signRequest'

// 首页
import Home from '../views/home'

// 账户详情
import AccountDetail from '../views/account/accountDetail'
// 解锁
import Lock from '../views/account/lock'

// 设置
import Setting from '../views/setting'
// 语言
import Languages from '../views/setting/languages'

// 登陆授权
import LoginSignUser from '../views/single/loginSign/signUser'
// 审核签名
import CheckSign from '../views/single/checkSign/signUser'
// 审核签名 - 交易界面
import SignBlobTransaction from '../views/single/sign/signBlobTransaction'
// 两次审核签名 - 交易界面
import MultipleSignTransaction from '../views/single/multipleSign'

// 授权
import SelectUserAuth from '../views/single/loginAuth/signUser'
// 提交授权
import UserAuth from '../views/single/loginAuth/signConfirm'
// 数字凭证 首页
import ShowCertificates from '../views/single/showCertificates'
// 数字凭证 选择
import CreateList from '../views/digitalCertificates/createList'
// 数字凭证 - 自定义
import CreateCustomTrust from '../views/digitalCertificates/create/custom'
// 数字凭证 - 结果页
import CreateResult from '../views/digitalCertificates/create/result'
// 数字凭证 - 详情
import CertificatesDetail from '../views/digitalCertificates/detail'
// 数字凭证 - 进度查询
import CertificatesDetailList from '../views/digitalCertificates/detailList'

// 授权签名 选择账户 - 对外
import SignAuthAccount from '../views/single/signAuth/signUser'
// 授权签名 签名 - 对外
import SignAuthConnect from '../views/single/signAuth/signConfirm'
// 明文签名 签名 - 对外
import SignMessageAccount from '../views/single/signMessage/signUser'
// 明文签名 签名 - 对外
import SignMessageConnect from '../views/single/signMessage/signRequest'

const routes = [{
  path: '/',
  redirect: '/home'
},
{
  path: '/home',
  name: 'home',
  meta: {
    requiresAuth: true
  },
  component: Home
},
{
  path: '/accountDetail',
  name: 'accountDetail',
  component: AccountDetail
},
{
  path: '/lock',
  name: 'lock',
  component: Lock
},
{
  path: '/welcome',
  name: 'welcome',
  component: Welcome
},
{
  path: '/initAccount',
  name: 'initAccount',
  component: InitAccount
},
{
  path: '/signUser',
  name: 'signUser',
  component: SignUser
},
{
  path: '/signConfirm',
  name: 'signConfirm',
  component: SignConfirm
},
{
  path: '/signRequest',
  name: 'signRequest',
  component: SignRequest
},
{
  path: '/importWallet',
  name: 'importWallet',
  component: ImportWallet
},
{
  path: '/restoreAccount',
  name: 'restoreAccount',
  component: RestoreAccount
},
{
  path: '/kindPrivateKey',
  name: 'kindPrivateKey',
  component: KindPrivateKey
},
{
  path: '/kindKeystore',
  name: 'kindKeystore',
  component: KindKeystore
},
{
  path: '/kindMnemonicWord',
  name: 'kindMnemonicWord',
  component: KindMnemonicWord
},
{
  path: '/restoreResult',
  name: 'restoreResult',
  component: RestoreResult
},
{
  path: '/setting',
  name: 'setting',
  component: Setting
},
{
  path: '/languages',
  name: 'languages',
  component: Languages
},
{
  path: '/loginSignUser',
  name: 'loginSignUser',
  component: LoginSignUser
},
{
  path: '/checkSign',
  name: 'checkSign',
  component: CheckSign
},
{
  path: '/signBlobTransaction',
  name: 'signBlobTransaction',
  component: SignBlobTransaction
},
{
  path: '/multipleSignTransaction',
  name: 'multipleSignTransaction',
  component: MultipleSignTransaction
},
{
  path: '/selectUserAuth',
  name: 'selectUserAuth',
  component: SelectUserAuth
},
{
  path: '/userAuth',
  name: 'userAuth',
  component: UserAuth
},
{
  path: '/showCertificates',
  name: 'showCertificates',
  component: ShowCertificates
},
{
  path: '/createList',
  name: 'createList',
  component: CreateList
},

{
  path: '/certificatesDetail',
  name: 'certificatesDetail',
  component: CertificatesDetail
},
{
  path: '/createCustomTrust',
  name: 'createCustomTrust',
  component: CreateCustomTrust
},
{
  path: '/createResult',
  name: 'createResult',
  component: CreateResult
},
{
  path: '/certificatesDetailList',
  name: 'certificatesDetailList',
  component: CertificatesDetailList
},
{
  path: '/signAuthAccount',
  name: 'signAuthAccount',
  component: SignAuthAccount
},
{
  path: '/signAuthConnect',
  name: 'signAuthConnect',
  component: SignAuthConnect
},
{
  path: '/signMessageAccount',
  name: 'signMessageAccount',
  component: SignMessageAccount
},
{
  path: '/signMessageConnect',
  name: 'signMessageConnect',
  component: SignMessageConnect
}
]

export default routes
