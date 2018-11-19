/* eslint-env jest */
require('./prepare')

describe('numerics', () => {
  it('is OK', async () => {
    const { prop, value } = await test(`a {
      border-radius: 10;
      z-index: 2;
      opacity: .65;
      flex: 1;
      order: 3;
    }`)

    expect(prop).toEqual('__numerics')
    expect(JSON.parse(value)).toEqual({
      borderRadius: 10,
      zIndex: 2,
      opacity: 0.65,
      flex: 1,
      order: 3
    })
  })
})
