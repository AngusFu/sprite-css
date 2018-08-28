const postcss = require('postcss')
const kebabCase = require('lodash/kebabCase')
const camelCase = require('lodash/camelCase')
const { stripQuote } = require('../util')

const transformMap = {
  font: 'font',

  textAlign: 'textAlign',
  lineHeight: 'lineHeight',
  lineBreak: 'lineBreak',
  wordBreak: 'wordBreak',
  letterSpacing: 'letterSpacing',
  textIndent: 'textIndent',

  text: 'text', // mark
  content: 'text',

  color: 'fillColor', // mark
  fillColor: 'fillColor',

  textStroke: 'strokeColor', // mark
  strokeColor: 'strokeColor'
}

const RE_TEXT_STYLES = new RegExp(
  `^(${Object.keys(transformMap).map(kebabCase).join('|')})$`,
  'i'
)

module.exports = postcss.plugin('postcss-css-text-styles', opts => root => {
  root.walkRules(rule => {
    let textStyles = null
    rule.walkDecls(RE_TEXT_STYLES, decl => {
      textStyles = textStyles || {}
      const key = transformMap[camelCase(RegExp.$1)]
      const val = stripQuote(decl.value)
      const noParse = ['text', 'font'].includes(key) || isNaN(Number(val))
      textStyles[key] = noParse ? val : Number(val)
      decl.remove()
    })

    textStyles &&
      rule.append({
        prop: '__textstyles',
        value: JSON.stringify(textStyles)
      })
  })
})
