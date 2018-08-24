const postcss = require('postcss')
const camelCase = require('lodash/camelCase')

const RE_NUMERIC = new RegExp(`^(${[
  'border-radius',
  'z-index',
  'opacity',
  'flex',
  'order'
].join('|')})$`, 'i')

module.exports = postcss.plugin('postcss-css-numerics', opts => root => {
  root.walkRules(rule => {
    let numerics = null
    rule.walkDecls(RE_NUMERIC, decl => {
      numerics = numerics || {}
      const key = camelCase(RegExp.$1)
      numerics[key] = parseFloat(decl.value)
      decl.remove()
    })

    numerics && rule.append({
      prop: '__numerics',
      value: JSON.stringify(numerics)
    })
  })
})
