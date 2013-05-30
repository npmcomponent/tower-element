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