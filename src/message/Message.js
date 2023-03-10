export default class Message {
  constructor (type = '', payload = '', resolver = '') {
    this.type = type
    this.payload = payload
    this.resolver = resolver
  }
  static placeholder () {
    return new Message()
  }
  static fromJson (json) {
    return Object.assign(this.placeholder(), json)
  }
  static widthPayload (type, payload) {
    return new Message(type, payload)
  }
  static newMsg (type) {
    return new Message(type)
  }
  respond (payload) {
    return new Message(this.type, payload, this.resolver)
  }
}
