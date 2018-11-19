/* eslint-env jest */
require('./prepare')

describe('flex attrs', () => {
  it('is OK', async () => {
    const { prop, value } = await test(
      `a {
        display: absolute;
        flex-direction: row;
        flex-wrap: no-wrap;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
    }`
    )

    expect(prop).toEqual('__flexattrs')
    expect(JSON.parse(value)).toEqual({
      display: 'absolute',
      flexDirection: 'row',
      flexWrap: 'no-wrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'center'
    })
  })
})
