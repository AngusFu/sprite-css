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
  require('./plugins/flex')
])

module.exports = async function ({ content, path = '' }) {
  const from = resolve(process.cwd(), path)
  const options = {
    from,
    parser: safeParser
  }

  let promise = Promise.resolve(content)
  if (typeof content !== 'string') {
    promise = readFilep(from, 'utf-8')
  }

  const result = await processer.process(await promise, options)
  return result
}
