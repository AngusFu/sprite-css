const postcss = require('postcss')
const { parse } = require('css-box-shadow')

module.exports = postcss.plugin('postcss-css-shadow', opts => root => {
  root.walkRules(rule => {
    let shadow = null
    rule.walkDecls('shadow', decl => {
      const { offsetX, offsetY, blurRadius, color } = parse(decl.value)[0]

      shadow = {
        color,
        blur: parseFloat(blurRadius),
        offset: [parseFloat(offsetX), parseFloat(offsetY)]
      }
      decl.remove()
    })

    if (shadow) {
      rule.append({
        prop: '__shadow',
        value: JSON.stringify(shadow)
      })
    }
  })
})
