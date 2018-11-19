const { resolve } = require('path')
const { readFile } = require('fs')
const { promisify } = require('util')
const readFilep = promisify(readFile)

const postcss = require('postcss')
const safeParser = require('postcss-safe-parser')

const processer = postcss([
  require('postcss-discard-comments'),
  require('postcss-normalize-whitespace'),
  require('postcss-reduce-transforms'),
  require('postcss-minify-gradients'),
  require('./plugins/margin-padding'),
  require('./plugins/border'),
  require('./plugins/pos-size'),
  require('./plugins/transform2d'),
  require('./plugins/filter'),
  require('./plugins/shadow'),
  require('./plugins/gradient'),
  require('./plugins/numeric'),
  require('./plugins/text-style'),
  require('./plugins/flex'),
  require('./plugins/motion')
])

async function parse ({ content, path }) {
  const from = resolve(process.cwd(), path)
  const options = {
    from,
    parser: safeParser
  }

  content = content || await readFilep(from, 'utf-8')
  const result = await processer.process(content, options)
  return result
}

module.exports = async function transform ({ content, path }) {
  const styleObj = {}

  try {
    const result = await parse({ content, path })
    result.root.walkRules(rule => {
      const { selector } = rule
      styleObj[selector] = styleObj[selector] || []
      const obj = {}
      styleObj[selector].push(obj)

      rule.walkDecls(/^__(.+)/i, decl => {
        const prop = RegExp.$1
        obj[prop] = JSON.parse(decl.value)
      })
    })
  } catch (e) {
    console.error(e)
  }

  return styleObj
}

module.exports.parse = parse
