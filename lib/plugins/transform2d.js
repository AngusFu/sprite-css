const postcss = require('postcss')
const parseValue = require('postcss-value-parser')
const { convertAngle } = require('../util')

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
        prop: '__transformMatrix',
        value: JSON.stringify(matrix2d)
      })
    }
  })
})

function transformValue (value) {
  const { Matrix } = require('sprite-math')

  const ops = []
  parseValue(value).walk(node => {
    const { type, value } = node
    if (type === 'function') {
      ops[ops.length] = [value]
      return
    }

    if (type === 'word') {
      ops[ops.length - 1].push(convertAngle(value))
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
