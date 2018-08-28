const postcss = require('postcss')
const camelCase = require('lodash/camelCase')
const { stripQuote } = require('../util')

module.exports = postcss.plugin('postcss-css-offsets', opts => root => {
  root.walkRules(rule => {
    let offsetattrs = null
    // offsetPath
    // offsetDistance
    // offsetRotate
    rule.walkDecls(/^offset-/i, decl => {
      offsetattrs = offsetattrs || {}
      const key = camelCase(decl.prop)
      offsetattrs[key] = stripQuote(decl.value)
      decl.remove()
    })

    offsetattrs &&
      rule.append({
        prop: '__offsetattrs',
        value: JSON.stringify(offsetattrs)
      })
  })
})
