/* eslint-disable */
require('./prepare')

describe('motion path', () => {
  it('is OK', async () => {
    const { prop, value } = await test(
      `a {
        offset-path: 'some test path';
        offset-distance: 0;
        offset-rotate: auto;
    }`
    )

    expect(prop).toEqual('__offsetattrs')
    expect(JSON.parse(value)).toEqual({
      offsetPath: 'some test path',
      offsetDistance: '0',
      offsetRotate: 'auto',
    })
  })
})
