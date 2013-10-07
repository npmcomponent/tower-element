# Tower Element

## Installation

node.js:

```bash
$ npm install tower-element
```

browser:

```bash
$ component install tower-element
```

## Example

```js
var element = require('tower-element');
var html = require('./template');

element('paginator')
  .template(html)
  .action('prev', function(){

  })
  .action('next', function(){

  });
```

Paginator template:

```html
<ul>
  <li class="prev" on-click="prev()"></li>
  <li class="next" on-click="next()"></li>
</ul>
```

## Licence

MIT

## Notes

- custom elements spec: http://www.w3.org/TR/2013/WD-custom-elements-20130514/
- http://www.html5rocks.com/en/tutorials/webcomponents/customelements/

Maybe a way to isolate element styles (by resetting to defaults in old browsers)

- http://stackoverflow.com/questions/15901030/reset-remove-css-styles-for-element-only