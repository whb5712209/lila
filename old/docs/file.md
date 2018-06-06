# Module files

## workspace

every module has a workspace in `src` directory, for example, if current module is `test/inner`, the workspace is `src/test/inner` directory.

## files

every module must have a `html` file and a `js` file, and paths is liking follows(module: `test/inner`):
 
* html: `src/test/inner/index.html`
* js: `src/test/inner/register.js`
* css/less: you can import `css/less` files into `js` file whatever you like.

## recommended workspace structure

```
| - workspace
    | - index.html (main html file, required)
    | - register.js (main js file, required)
    | - config.js (custom config file, system reserved)
    | - index.less/index.css (main stylesheet file)
    | - html (directory: more html segments files)
    | - js (directory: more js files)
    | - css/less (directory: more stylesheet files)
    | - images (directory: image files)
    | - data (directory: api-mock json files)
    | - ...
```

## html file

you can split one html file into pieces, and use [webpack require](https://webpack.js.org/loaders/html-loader/) to import pieces into the main html file.

example
```
# index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
</head>
<body>
</body>
${require('./html/piece-1.html')}
${require('./html/piece-2.html')}
<div class="box">China</div>
</html>

# piece-1.html
<div id="example"></div>
<h1>Hello World!</h1>
<div class="glyphicon glyphicon-fire"></div>

# piece-2.html
<div class="test-index"></div>
<div class="test-index-2"></div>
<div class="test-index-less"></div>
```

## js file

you can import all other files into the main js file, including `css/less` files.

example: 
```
require('bootstrap/dist/css/bootstrap.css');
require('../../test/index.css');
require('../../test/index2.css');
require('../../test/index.less');
```

## Dynamically load modules

you can use `require.ensure()` or `import()` to load modules dynamically.

example:
```
import('your/module').then(yourModule => {
    // do something
});

require.ensure([], require => {
    let yourModule = require('your/module');
    // do something
});
```

more to: [require.ensure](https://webpack.js.org/api/module-methods/#require-ensure), [import](https://webpack.js.org/api/module-methods/#import-)

## note

the html in production is not the same as `src`. for example, in `src`, the path is `src/test/inner/index.html`, in `dist` of production, the path is `dist/test/inner.html`  