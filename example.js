const { resolve } = require('path')
const transform = require('./')
const cssPath = resolve(__dirname, './fixtures/test.css')

const run = async () => {
  try {
    const result = await transform({ path: cssPath })
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}

run()
