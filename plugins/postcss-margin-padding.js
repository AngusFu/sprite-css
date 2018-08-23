// https://github.com/jiubao/postcss-value-spread/blob/master/index.js
var postcss = require('postcss')

module.exports = postcss.plugin('postcss-value-spread', opts => root => {
  root.walkDecls(/^(margin|padding)$/i, decl => {
    var values = postcss.list.space(decl.value)
    if (!values) return

    var top, bottom, left, right
    top = bottom = values[0]
    right = left = values[1] || values[0]

    if (values.length >= 3) bottom = values[2]
    if (values.length >= 4) left = values[3]

    decl.value = [ top, right, bottom, left ].map(parseFloat)
  })
})
