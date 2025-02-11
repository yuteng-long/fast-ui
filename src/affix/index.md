---
nav:
  title: 组件
  path: /components
group:
  path: /components/navigation
  title: 导航
---

## Affix 固钉

将页面元素钉在可视范围

<br />

例子:

```tsx
/**
 * title: 基础使用
 * desc: 最简单的用法。
 */
import React, { useState, useRef } from 'react'
import { Affix, Button } from '@weblif/fast-ui'

export default () => {
  return (
    <>
      <Affix offsetTop={64}>
        <Button type="primary">固定到滚动条的头部</Button>
      </Affix>
    </>
  )
}
```

## API

| 成员         | 说明                                                                   | 类型                        | 默认值       |
| ------------ | ---------------------------------------------------------------------- | --------------------------- | ------------ |
| offsetBottom | 距离窗口底部达到指定偏移量后触发                                       | number                      | -            |
| offsetTop    | 距离窗口顶部达到指定偏移量后触发                                       | number                      | 0            |
| target       | 设置 `Affix` 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 | () => HTMLElement           | () => window |
| onChange     | 固定状态改变时触发的回调函数                                           | (affixed?: boolean) => void | -            |

**注意：**`Affix` 内的元素不要使用绝对定位，如需要绝对定位的效果，可以直接设置 `Affix` 为绝对定位：

```jsx | pure
<Affix style={{ position: 'absolute', top: y, left: x }}>...</Affix>
```

## FAQ

### Affix 使用 `target` 绑定容器时，元素会跑到容器外。

从性能角度考虑，我们只监听容器滚动事件。如果希望任意滚动，你可以在窗体添加滚动监听：<https://codesandbox.io/s/2xyj5zr85p>

相关 issue：[#3938](https://github.com/ant-design/ant-design/issues/3938) [#5642](https://github.com/ant-design/ant-design/issues/5642) [#16120](https://github.com/ant-design/ant-design/issues/16120)

### Affix 在水平滚动容器中使用时， 元素 `left` 位置不正确。

Affix 一般只适用于单向滚动的区域，只支持在垂直滚动容器中使用。如果希望在水平容器中使用，你可以考虑使用 原生 `position: sticky` 实现。

相关 issue: [#29108](https://github.com/ant-design/ant-design/issues/29108)
