const { dump } = require('dumper.js')
const PrettyError = require('pretty-error')
const pe = new PrettyError()

module.exports = {
  dump,
  error (e) {
    console.log(pe.render(e))
  }
}
