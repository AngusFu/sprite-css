const postcss = require('postcss')
const parseValue = require('postcss-value-parser')

module.exports = postcss.plugin('postcss-transform2d', opts => root => {
  root.walkRules(rule => {
    let transform = null
    rule.walkDecls('transform', decl => {
      transform = decl.value
      decl.remove()
    })

    if (transform) {
      const matrix2d = transformValue(transform)
      rule.append({
        prop: '__transform',
        value: JSON.stringify(matrix2d)
      })
    }
  })
})

function transformValue (value) {
  const cssValue = require('css-value')
  const { Matrix } = require('sprite-math')

  const ops = []
  parseValue(value).walk(node => {
    const { type, value } = node
    if (type === 'function') {
      ops[ops.length] = [value]
      return
    }

    if (type === 'word') {
      const arr = ops[ops.length - 1]
      // treat negative values carefully
      const isNegative = `${value}`.startsWith('-')
      let { unit, value: num } = cssValue(`${value.replace(/^-/, '')}`)[0]
      num = isNegative ? -num : num

      if (arr[0] !== 'rotate') {
        return arr.push(num)
      }

      switch (unit) {
        case '':
        case 'deg':
          return arr.push(num)
        // SEE http://www.w3chtml.com/css3/units/angle/
        case 'turn':
          return arr.push(num * 360)
        case 'rad':
          return arr.push(num * 180 / Math.PI)
        case 'grad':
          return arr.push(num / 100 * 90)
        default:
          console.warn('unit not supported: ', unit, value)
          return arr.push(num)
      }
    }
  })

  let matrix = new Matrix().unit()

  for (let [op, ...args] of ops.reverse()) {
    if (op === 'matrix') {
      matrix = matrix.multiply(new Matrix(args), matrix)
    } else if (/(^perspective)|((3d|Z)$)/.test(op)) {
      throw Error(
        `3D transformation not supported yet: ${op}(${args.join(',')})`
      )
    } else if (/rotate[XY]/.test(op)) {
      // SEE https://github.com/spritejs/sprite-math/blob/master/src/matrix.js#L79
      throw Error(`use rotate(degree): ${op}(${args.join(',')})`)
    } else {
      const dir = op.slice(-1)
      if (['X', 'Y'].includes(dir)) {
        let method = op.slice(0, -1)
        method = method === 'translate' ? 'transformPoint' : method
        const params = dir === 'X' ? [args[0], 0] : [0, args[0]]
        matrix[method](...params)
      } else {
        if (args.length === 1) {
          args.push(args[0])
        }
        matrix[op](...args)
      }
    }
  }

  return matrix.m
}
