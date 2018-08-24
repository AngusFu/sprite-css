/* eslint-disable */
require('./prepare')

describe('margin', function() {
  it('should transform single value correctly', async () => {
    const { prop, value } = await test(`a { margin: 2px }`)
    expect(prop).toEqual('__margin')
    expect(value).toEqual(JSON.stringify([2, 2, 2, 2]))
  })

  it('should transform 2 values correctly', async () => {
    const { prop, value } = await test(`a { margin: 2px 100 }`)
    expect(prop).toEqual('__margin')
    expect(value).toEqual(JSON.stringify([2, 100, 2, 100]))
  })

  it('should transform 3 values correctly', async () => {
    const { prop, value } = await test(`a { margin: 2px 100 30.2}`)
    expect(prop).toEqual('__margin')
    expect(value).toEqual(JSON.stringify([2, 100, 30.2, 100]))
  })

  it('should transform 4 or more values correctly', async () => {
    const { prop, value } = await test(`a { margin: 2px 100 30.2 33 28}`)
    expect(prop).toEqual('__margin')
    expect(value).toEqual(JSON.stringify([2, 100, 30.2, 33]))
  })

  it('should transform values with specified direction correctly', async () => {
    const { prop, value } = await test(
      `a {
      margin: 2px 100 30.2 33;
      margin-left: 22.3;
      margin: 1px;
      margin-right: 30;
    }`
    )
    expect(prop).toEqual('__margin')
    expect(value).toEqual(JSON.stringify([1, 30, 1, 1]))
  })
})
