module.exports = {
  dev: {
    env: {
      HOST: "''",
      BASE_API: "'/api'"
    }
  },
  pro: {
    env: {
      HOST: "'http://dev-bp-api.bumocdn.com'",
      BASE_API: "'/'"
    }
  }
}
