/* eslint-disable */
require('./prepare')

describe('text styles', () => {
  it('is OK', async () => {
    const { prop, value } = await test(`a {
      font: 22px '宋体';
      text-align: center;
      line-height: 1.8;
      line-break: normal;
      word-break: break-all;
      letter-spacing: 5;
      text-indent: 2;
      text: '222';
      content: '333';
      color: red;
      text-stroke: red;
    }`)

    expect(prop).toEqual('__textstyles')
    expect(JSON.parse(value)).toEqual({
      font: "22px \'宋体\'",
      textAlign: 'center',
      lineHeight: 1.8,
      lineBreak: 'normal',
      wordBreak: 'break-all',
      letterSpacing: 5,
      textIndent: 2,
      text: '333',
      fillColor: 'red',
      strokeColor: 'red'
    })
  })
})
