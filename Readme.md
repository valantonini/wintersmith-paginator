# wintersmith-paginator
A modified JS implementation of [Wintersmith's](https://wintersmith.io "Wintersmith") paginator.coffee.

Requires wintersmith-contents

```bash
npm install wintersmith-contents --save
```

Add the paginator.js to the plugins folder.

```JSON
  "plugins": [
    "wintersmith-contents",
    "./plugins/paginator.js"
  ]
```

[index.pug](https://github.com/valantonini/wintersmith-paginator/blob/master/index.pug "Sample post list") contains a sample post list and implementation of pagination using [Bulma](https://bulma.io "Bulma")