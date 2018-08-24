// https://github.com/jiubao/postcss-value-spread/blob/master/index.js
const postcss = require('postcss')
const directions = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3
}

module.exports = postcss.plugin('postcss-margin-padding', opts => root => {
  root.walkRules(rule => walkRule(rule, 'margin'))
  root.walkRules(rule => walkRule(rule, 'padding'))
})

function walkRule (rule, name) {
  let sizedVals = null
  const regex = new RegExp(`^${name}(-(left|top|right|bottom))?$`, 'i')

  rule.walkDecls(regex, decl => {
    let values = postcss.list.space(decl.value)
    if (!values) return

    values = values.map(parseFloat)
    sizedVals = sizedVals || [0, 0, 0, 0]

    const dir = String(RegExp.$2).toLowerCase()

    if (dir === '') {
      const topVal = values[0]
      const length = values.length

      let [top, bottom, left, right] = [topVal, topVal, topVal, topVal]

      if (length >= 2) right = left = values[1]
      if (length >= 3) bottom = values[2]
      if (length >= 4) left = values[3]
      sizedVals = [top, right, bottom, left].map(parseFloat)
    } else {
      sizedVals[directions[dir]] = parseFloat(values[0])
    }

    decl.remove()
  })

  if (sizedVals) {
    rule.append({
      prop: `__${name}`,
      value: JSON.stringify(sizedVals)
    })
  }
}
