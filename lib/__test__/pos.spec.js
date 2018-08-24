/* eslint-disable */
require('./prepare')

describe('left/top', function() {
  it('should transform left/top to pos', async () => {
    const { prop, value } = await test('a { top: 20px; left: 1090 }')
    expect(prop).toEqual('__pos')
    expect(value).toEqual('[1090,20]')
  })

  it('should transform left/top to pos if the other decl was missing', async () => {
    const { prop, value } = await test('a { top: 20px }')
    expect(value).toEqual('[0,20]')
  })
})
