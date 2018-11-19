const { resolve } = require('path')
const transform = require('.')
const cssPath = resolve(__dirname, '../fixtures/test.css')

/* eslint-env jest */
describe('test', () => {
  it('should work', async () => {
    try {
      const result = await transform({ path: cssPath })
      console.log(result)
      expect(typeof result).toBe('object')
    } catch (e) {
      console.error(e)
    }
  })
})
