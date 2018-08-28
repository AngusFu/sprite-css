const postcss = require('postcss')
const camelCase = require('lodash/camelCase')

const RE_FLEX_ATTRS = new RegExp(
  `^(${['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content'].join('|')})$`,
  'i'
)

module.exports = postcss.plugin('postcss-css-numerics', opts => root => {
  root.walkRules(rule => {
    let flexattrs = null
    rule.walkDecls(RE_FLEX_ATTRS, decl => {
      flexattrs = flexattrs || {}
      const key = camelCase(RegExp.$1)
      flexattrs[key] = decl.value
      decl.remove()
    })

    flexattrs &&
      rule.append({
        prop: '__flexattrs',
        value: JSON.stringify(flexattrs)
      })
  })
})
