/* eslint-disable */
require('./prepare')

describe('border', () => {
  it('should transform border correctly', async () => {
    const { prop, value } = await test(
      `a {
    border-color: rgba(0, 24, 43, 44);
    border: 12 solid red;
    border-style: dashed;
    border-width: 32;
    border-color: #f0f0f0;
  }`
    )
    expect(prop).toEqual('__border')
    expect(JSON.parse(value)).toEqual({
      color: '#f0f0f0',
      style: 'dashed',
      width: 32,
    })
  })
})
