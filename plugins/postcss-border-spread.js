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
  return result ? result[0] : result
}

module.exports = postcss.plugin('postcss-border-spread', opts => root => {
  root.walkDecls('border', decl => {
    var props = { width: '', style: '', color: '' }
    props.style = borderStyle(decl.value)
    props.width = borderWidth(decl.value)
    props.color = decl.value.replace(styleReg, '').replace(widthReg, '').trim()

    if (props.color) decl.cloneAfter({prop: 'border-color', value: props.color})
    if (props.style) decl.cloneAfter({prop: 'border-style', value: props.style})
    if (props.width) decl.cloneAfter({prop: 'border-width', value: props.width})

    decl.remove()
  })
})
