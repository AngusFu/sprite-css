/* eslint-disable */
require('./prepare')

describe('filter', () => {
  it('should transform filter prop as expected', async () => {
    const {
      prop,
      value
    } = await test(`a {
      filter: blur(10); /* overrides */
      filter: blur(22px) drop-shadow(25px 25px 10 rgba(0, 0, 2, 1));
    }`)
    expect(prop).toEqual('__filter')
    expect(JSON.parse(value)).toEqual([
      ['blur', '22px'],
      ['dropShadow', ['25px', '25px', '10', 'rgba(0,0,2,1)']]
    ])
  })
})
