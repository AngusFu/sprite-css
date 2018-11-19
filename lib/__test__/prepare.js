const { parse } = require('../index')
global.test = content =>
  parse({ content, path: __filename }).then(
    ({ root }) => root.nodes[0].nodes[0]
  )
