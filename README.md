# Dynamic-Background

Transition between backgrounds.

It's curious cause a gradient is rendered as image so you cant make a transition to another gradient.

Now it's easy

[**DEMO**](https://practical-spence-c7f154.netlify.com/)

**Basic Syntax:**
```javascript
import dynamicBG from 'dynamic-background'
let colorList = [
    {
        color: 'blue'
    },
    {
        color: 'linear-gradient(90deg, #7b4397 0%,#dc2430 100% )'
    },
    {
        color: 'url(https://picsum.photos/200/300)'
    },
]
dynamicBG('elementId', colorList, 5 /* Background Stay Time */)
```