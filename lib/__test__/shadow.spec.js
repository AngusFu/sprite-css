/* eslint-env jest */
require('./prepare')

describe('shadow', () => {
  it('should transform shadow prop as expected #1', async () => {
    const {
      prop,
      value
    } = await test(`a {
      shadow: 15 15 10 #999;
    }`)

    expect(prop).toEqual('__shadow')
    expect(JSON.parse(value)).toEqual({
      color: '#999',
      blur: 10,
      offset: [15, 15]
    })
  })

  it('should transform shadow prop as expected #2', async () => {
    const {
      prop,
      value
    } = await test(`a {
      /* spread-radius ignored */
      shadow: 0 1.5 -0.88 -1 olive;
    }`)

    expect(prop).toEqual('__shadow')
    expect(JSON.parse(value)).toEqual({
      color: 'olive',
      blur: -0.88,
      offset: [0, 1.5]
    })
  })
})
