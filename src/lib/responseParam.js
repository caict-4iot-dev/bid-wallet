export default class ResponseParam {
  resultObj (obj) {
    if (!obj.data) {
      obj.data = {}
    }
    return {
      code: obj.code,
      data: {
        ...obj.data
      },
      message: obj.message ? obj.message : codeEnum[obj.code],
      uuid: obj.uuid ? obj.uuid : ''
    }
  }
  resultParam (obj) {
    if (!obj.data) {
      obj.data = {}
    }
    return {
      code: obj.code,
      param: {
        ...obj.data
      },
      message: obj.message ? obj.message : codeEnum[obj.code],
      uuid: obj.uuid ? obj.uuid : ''
    }
  }
}

const codeEnum = {
  '0': 'Success',
  '1': 'Cancelled',
  '-1': 'Failure'
  // '100000': 'Please initialize the wallet',
  // '100001': 'Missing parameter',
  // '100002': 'Unauthorized account',
  // '100003': 'Please switch your wallet account'
  // '100004': 'No account found'
}
