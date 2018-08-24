/* eslint-disable */
require('./prepare')

describe('width/height', () => {
  it('should transform width/height to size', async () => {
    const { prop, value } = await test('a { width: 200.01; height: .9999 }')
    expect(prop).toEqual('__size')
    expect(value).toEqual('[200.01,0.9999]')
  })

  it('should transform width/height to size if the other decl was missing', async () => {
    const { prop, value } = await test('a { height: .9999rem }')
    expect(value).toEqual('["",0.9999]')
  })
})
