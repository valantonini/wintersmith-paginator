# wintersmith-paginator

![npm](https://img.shields.io/npm/v/wintersmith-paginator.svg)
![npm](https://img.shields.io/npm/dt/wintersmith-paginator.svg)

A modified JS implementation of [Wintersmith's](https://wintersmith.io "Wintersmith") paginator.coffee.

Requires wintersmith-contents

```bash
npm install wintersmith-contents --save
npm install wintersmith paginator
```

config.json

```JSON
  "plugins": [
    "wintersmith-contents",
    "wintersmith-paginator"
  ]
```

[index.pug](https://github.com/valantonini/wintersmith-paginator/blob/master/index.pug "Sample post list") contains a sample post list and implementation of pagination using [Bulma](https://bulma.io "Bulma")