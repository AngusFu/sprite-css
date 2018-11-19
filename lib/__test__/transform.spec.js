/* eslint-disable */
require('./prepare')

describe('transform2d', () => {
  it('should transform transform2d values correctly', async () => {
    const { prop, value } = await test('a { transform: rotate(20deg) }')
    expect(prop).toEqual('__transformMatrix')
    expect(JSON.parse(value).length === 6).toBe(true)
  })

  it('should transform angle units correctly', async () => {
    const ret = await Promise.all([
      test(`a { transform: rotate(90) }`),
      test(`a { transform: rotate(90deg) }`),
      test(`a { transform: rotate(${90 * Math.PI / 180}rad) }`),
      test(`a { transform: rotate(100grad) }`),
      test(`a { transform: rotate(0.25turn) }`),
    ])

    const matrices = ret.map(({ value }) => JSON.parse(value))
    matrices.sort((a, b) => {
      expect(a).toEqual(b)
      return 1
    })
  })

  it('should override previous value', async () => {
    const { value: value1 } = await test(
      `a {
      transform: translate(20deg) skew(30deg) rotateX(20turn) rotateY(30deg);
      transform: rotate(20deg);
    }`
    )
    const { value: value2 } = await test(
      `a {
      transform: rotate(20deg);
    }`
    )
    expect(value2).toEqual(value1)
  })
})
