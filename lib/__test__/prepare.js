const process = require('../index')
global.test = content =>
  process({ content, path: __filename }).then(
    ({ root }) => root.nodes[0].nodes[0]
  )
