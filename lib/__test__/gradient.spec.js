/* eslint-env jest */
require('./prepare')

describe('gradient', () => {
  it('should transform gradient prop as expected #1', async () => {
    const {
      prop,
      value
    } = await test(`a {
      /*gradient: linear-gradient(0.5turn, #000, transparent);*/
      gradient: linear-gradient(135deg, red, green 60%, blue);
    }`)

    expect(prop).toEqual('__gradient')
    expect(JSON.parse(value)).toEqual({
      direction: 135,
      colors: [
        { offset: 0, color: 'red' },
        { offset: 0.6, color: 'green' },
        { offset: 1, color: 'blue' }
      ]
    })
  })
})
