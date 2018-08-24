const postcss = require('postcss')

module.exports = postcss.plugin('postcss-pos-size', opts => root => {
  root.walkRules(rule => {
    let pos = null
    let size = null
    let i = 0

    rule.walkDecls(/^(left|top)$/i, decl => {
      pos = pos || [0, 0]
      i = RegExp.$1 === 'left' ? 0 : 1
      pos[i] = parseFloat(decl.value)
      decl.remove()
    })

    rule.walkDecls(/^(width|height)$/i, decl => {
      size = size || ['', '']
      i = RegExp.$1 === 'width' ? 0 : 1
      size[i] = parseFloat(decl.value)
      decl.remove()
    })

    if (pos) {
      rule.append({
        prop: '__pos',
        value: JSON.stringify(pos)
      })
    }

    if (size) {
      rule.append({
        prop: '__size',
        value: JSON.stringify(size)
      })
    }
  })
})
