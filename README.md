# sprite-css

## CSS 属性

### width & height

会被统一转换为 `size`，建议同时设置。

```scss
.sprite {
  width: 200;
  height: 300;
}
// result: { size: [200, 300]}
```

### left & top

left、top 分别对应于 sprite.js 中的 `x` `y`。实际操作中会被统一成 `pos`，建议同时设置。

之所以如此命名，是为了与习惯的 CSS 保持一致。

```scss
.sprite {
  left: 200;
  top: 300;
}
// result: { pos: [200, 300]}
```

### margin & padding

支持各种分量写法。

```scss
.sprite {
  margin: 10;
  margin-left: 200;
  margin-top: 300;
}
// result: { margin: [300, 10, 10, 200]}
```

### border

支持 `border: 100 solid #eee` 这样的简写，也支持 `border-{style,width,color}` 的写法。

注意：**不支持**按方向分别书写，因为目前 sprite.js 不支持。


```scss
.sprite {
  border: 20 solid red;
  border-color: rgba(0,0,0,1);
  border-style: dashed;
}
/*
result: {
  border: {
    color: 'rgba(0,0,0,1)',
    style: 'dashed',
    width: 20
  }
}*/
```

### 2D transform 

支持使用 CSS 风格的 2D transform 表达式： 

```css
.group {
  transform: translate(20) skew(30deg) rotate(20turn);
}
```

注意：

1. 由于 spritejs 的限制，请**避免**使用 `rotateX` 和 `rotateY`
2. `rotate()` 支持各种合法的 CSS 角度单位，默认单位 `deg`
3. 转换结果是 2d matrix

### filter

支持使用 CSS filters。

```scss
.sprite {
  filter: blur(22px) drop-shadow(25px 25px 10 rgba(0, 0, 2, 1));
}

/*
  result: Array [
    ['blur', '22px'],
    ['dropShadow', ['25px', '25px', '10', 'rgba(0,0,2,1)']]
  ]
*/
```

### gradient

（有待完善）

目前只支持 `linear-gradient`。

### shadow

目前只支持单个 shadow。

```scss
.sprite {
  shadow: 15px 15px 10px #999;
}

/*
  result: {
    color: '#999',
    blur: 10,
    offset: [15, 15]
  }
*/
```

### flex 相关

- `display`
- `flex-direction`
- `flex-wrap`
- `justify-content`
- `align-items`
- `align-content`

### numeric values

- `flex`
- `order`
- `border-radius`
- `z-index`
- `opacity`

### typo 

| CSS property name              | sprite.js attr name |
| ------------------------------ | ------------------- |
| `font`                         | `font`              |
| `text-align`                   | `textAlign`         |
| `line-height`                  | `lineHeight`        |
| `line-break`                   | `lineBreak`         |
| `word-break`                   | `wordBreak`         |
| `letter-spacing`               | `letterSpacing`     |
| `text-indent`                  | `textIndent`        |
| `text` 或 `content`            | `text`              |
| `fill-color` 或 `color`        | `fillColor`         |
| `stroke-color` 或 `text-stroke`| `strokeColor`       |

**TODO: font 缩写**

### offset-*

| CSS property name              | sprite.js attr name |
| ------------------------------ | ------------------- |
| `offset-path`                  | `offsetPath`        |
| `offset-distance`              | `offsetDistance`    |
| `offset-rotate`                | `offsetRotate`      |

[参考链接](http://spritejs.org/#/zh-cn/doc/attribute?id=offsetdistance)

### TO BE CONTINUED

参考 [spritejs/sprite-core/blob/master/src/index.d.ts](https://github.com/spritejs/sprite-core/blob/master/src/index.d.ts)
