module.exports = {
  convertAngle,
  stripQuote
}

function convertAngle (value) {
  if (typeof value === 'number' || !isNaN(Number(value))) {
    return +value
  }

  const cssValue = require('css-value')
  // treat negative values carefully
  const isNegative = `${value}`.startsWith('-')
  let { unit, value: num } = cssValue(`${value.replace(/^-/, '')}`)[0]
  num = isNegative ? -num : num

  switch (unit) {
    case '':
    case 'deg':
      return num
    // SEE http://www.w3chtml.com/css3/units/angle/
    case 'turn':
      return num * 360
    case 'rad':
      return num * 180 / Math.PI
    case 'grad':
      return num / 100 * 90
    default:
      console.warn('unit not supported: ', unit, value)
      return num
  }
}

function stripQuote (str) {
  const match = `${str}`.match(/(^['"])(.+)(['"]$)/)
  return match ? match[2] : str
}
