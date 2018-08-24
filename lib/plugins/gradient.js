const postcss = require('postcss')
const valueParser = require('postcss-value-parser')
const { convertAngle } = require('../util')

module.exports = postcss.plugin('postcss-css-gradient', opts => root => {
  root.walkRules(rule => {
    let gradient = null
    rule.walkDecls('gradient', decl => {
      const { type, nodes, value } = valueParser(decl.value).nodes[0]

      if (type === 'function' && value === 'linear-gradient') {
        const args = nodes.map(n => n.value).join('')
        const [angle, ...stops] = postcss.list.comma(args)

        // http://www.alloyteam.com/2016/03/css-gradient/
        // 第一个默认为0%，最后一个默认为100%，如果中间的值没有指定，则按颜色数目求均值
        const defaultStep = 1 / (stops.length - 1)
        const colorStops = stops.map((stop, index) => {
          const vals = postcss.list.space(stop)
          const ret = {
            color: vals[0]
          }
          // only got color
          if (vals.length === 1) {
            ret.offset = index * defaultStep
          } else {
            // percent only
            ret.offset = parseFloat(vals[1]) / 100
          }
          return ret
        })
        gradient = {
          direction: convertAngle(angle),
          colors: colorStops
        }
      } else {
        // TODO
        // radial-gradient, conical-gradient, etc.
        console.warn(`Not supported yet: ${decl.value}`)
      }

      decl.remove()
    })

    if (gradient) {
      rule.append({
        prop: '__gradient',
        value: JSON.stringify(gradient)
      })
    }
  })
})
/*

var ctx = canvas.getContext('2d')
var w = canvas.width
var h = canvas.height
var cx = w / 2
var cy = h / 2
var cssAng = 185
var canAng = cssAng - 90
var ang = (canAng - 90) * (Math.PI / 180)
var hypt = cy / Math.cos(ang)
var fromTopRight = cx - Math.sqrt(hypt * hypt - cy * cy)
var diag = Math.sin(ang) * fromTopRight
var len = hypt + diag

var topX = cx + Math.cos(-Math.PI / 2 + ang) * len
var topY = cy + Math.sin(-Math.PI / 2 + ang) * len
var botX = cx + Math.cos(Math.PI / 2 + ang) * len
var botY = cy + Math.sin(Math.PI / 2 + ang) * len

var grad = ctx.createLinearGradient(topX, topY, botX, botY)
grad.addColorStop(0, 'rgba(0,0,0,1)')
grad.addColorStop(0.01, 'rgba(196,230,255,1)')
grad.addColorStop(0.49, 'rgba(196,230,255,1)')
grad.addColorStop(0.50, 'rgba(0,0,0,1)')
grad.addColorStop(0.51, 'rgba(196,230,255,1)')
grad.addColorStop(0.99, 'rgba(152,227,230,1)')
grad.addColorStop(1, 'rgba(0,0,0,1)')

ctx.fillStyle = grad
ctx.fillRect(0, 0, 440, 171)

*/
