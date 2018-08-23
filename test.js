const { readFileSync } = require('fs')
const content = readFileSync('./test.css', 'utf-8')

const camelCase = require('lodash/camelCase')
const { Matrix } = require('sprite-math')
const postcss = require('postcss')
const parser = require('postcss-safe-parser')
const cssValue = require('css-value')
const parseValue = require('postcss-value-parser')

const stripQuote = str => str.replace(/(^['"])|(['"]$)/g, '')

postcss([
  require('postcss-reduce-transforms'),
  require('./plugins/postcss-margin-padding'),
  require('./plugins/postcss-border-spread')
]).process(content, { parser, from: './test.css' }).then(result => {
  let results = []
  let attrs = null

  result.root.walk(node => {
    const { type, selector, prop, value } = node

    if (type === 'rule') {
      const map = Object.create(null)
      results.push(map)
      map.selector = selector
      attrs = map.attrs = Object.create(null)
      return
    }

    if (type === 'decl') {
      const name = prop.toLowerCase()

      switch (prop) {
        case 'width':
        case 'height':
          return assignSize(attrs, name, cssValue(value))
        case 'left':
        case 'top':
          return assignPos(attrs, name, cssValue(value))
        case 'transform':
          return assignTransform(attrs, name, value)
        case 'margin':
        case 'padding':
          attrs[prop] = value
          return
        case 'filter':
          return assignFilters(attrs, name, value)
        case 'border-radius':
        case 'z-index':
        case 'opacity':
          attrs[camelCase(prop)] = parseFloat(value)
          break
        case 'box-sizing':
          attrs[camelCase(prop)] = stripQuote(value)
          break
        case 'border-width':
        case 'border-style':
        case 'border-color':
          const key = prop.replace('border-', '')
          attrs.border = {
            ...attrs.border,
            [key]: key === 'width' ? parseFloat(value) : value
          }
          break
      }
    }
  })

  // console.log(JSON.stringify(results, null, 2))
}).catch(console.error)

/**
 * for `width` `height`
 */
function assignSize (attrs, prop, parsed) {
  const size = attrs.size || (attrs.size = [0, 0])
  const index = prop === 'width' ? 0 : 1
  size[index] = parsed[0].value
}

/**
 * for `left` `top`
 */
function assignPos (attrs, prop, parsed) {
  const pos = attrs.pos || (attrs.pos = [0, 0])
  const index = prop === 'left' ? 0 : 1
  pos[index] = parsed[0].value
}

function assignTransform (attrs, prop, value) {
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

      switch (unit) {
        case '':
        case 'px':
        case 'deg':
          return arr.push(num)
        // SEE http://www.w3chtml.com/css3/units/angle/
        case 'turn':
          return arr.push(num * 360 / 360)
        case 'rad':
          return arr.push(num * 180)
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
      throw Error(`3D transformation not supported yet: ${op}(${args.join(',')})`)
    } else if (/rotate[XY]/.test(op)) {
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

  attrs.transformMatrix = matrix.m
}

function assignFilters (attrs, prop, value) {
  parseValue(value).walk(node => {
    console.log(node)
  })
}