const { readFileSync } = require('fs')
const content = readFileSync('./test.css', 'utf-8')

const camelCase = require('lodash/camelCase')
const postcss = require('postcss')
const parser = require('postcss-safe-parser')
const stripQuote = str => str.replace(/(^['"])|(['"]$)/g, '')

postcss([
  require('postcss-reduce-transforms'),
  require('./plugins/postcss-margin-padding'),
  require('./plugins/postcss-border-spread')
])
  .process(content, { parser, from: './test.css' })
  .then(result => {
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
        switch (prop) {
          case 'filter':
          // return assignFilters(attrs, name, value)
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
  })
  .catch(console.error)
