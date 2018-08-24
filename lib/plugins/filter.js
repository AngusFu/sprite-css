const postcss = require('postcss')
const camelCase = require('lodash/camelCase')

module.exports = postcss.plugin('postcss-css-filter', opts => root => {
  root.walkRules(rule => {
    let filters = null
    rule.walkDecls('filter', decl => {
      filters = []
      for (let value of postcss.list.space(decl.value)) {
        const parsed = parseCanvasFilters(value)
        if (parsed === null) {
          filters = null
        } else {
          filters.push(parsed)
        }
      }
      decl.remove()
    })

    if (filters) {
      rule.append({
        prop: '__filter',
        value: JSON.stringify(filters)
      })
    }
  })
})

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
 * https://github.com/spritejs/sprite-core/blob/master/src/filters.js
 */
const reFilters = /^(url|blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|opacity|saturate|sepia)\((.+)\)$/

function parseCanvasFilters (value) {
  const match = `${value}`.match(reFilters)
  if (!match) {
    return null
  }

  const params = postcss.list.space(match[2])

  return [
    camelCase(match[1]),
    params.length > 1 ? params : params[0]
  ]
}
