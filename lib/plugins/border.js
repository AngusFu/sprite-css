/**
 * https://github.com/jiubao/postcss-border-spread/blob/master/index.js
 */
var postcss = require('postcss')

const styleReg = /(hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)/i
const widthReg = /(\d+[a-z]*)/i

const borderStyle = str => {
  var result = styleReg.exec(str)
  return result ? result[0] : result
}

const borderWidth = str => {
  var result = widthReg.exec(str)
  return parseFloat(result ? result[0] : result)
}

module.exports = postcss.plugin('postcss-border-spread', opts => root => {
  root.walkRules(rule => {
    let props = null

    rule.walkDecls(/^border(-(style|width|color))?$/, decl => {
      props = props || { width: '', style: '', color: '' }

      if (!RegExp.$2) {
        props.style = borderStyle(decl.value) || 'solid'
        props.width = borderWidth(decl.value) || 0
        props.color = decl.value
          .replace(styleReg, '')
          .replace(widthReg, '')
          .trim()
      } else {
        const key = RegExp.$2
        props[key] = key === 'width' ? borderWidth(decl.value) : decl.value
      }

      decl.remove()
    })

    if (props) {
      rule.append({
        prop: '__border',
        value: JSON.stringify(props)
      })
    }
  })
})
