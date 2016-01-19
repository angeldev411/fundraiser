# Osedea ReactJS starter template

To install

        npm install

To start

        npm start


## Components vs Views

To read : [Smart and dumb components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.b9ghbmt0l)

*Dumb components* are stored in `src/components/`.

*Smart components* are stored in `src/views/`.

## Styles

Really common/reusable styles should be in `src/common/styles/`.

Component styles should be in the folder of their own component.

## Includes

 * [React](https://facebook.github.io/react/)
 * [Redux](https://github.com/rackt/redux)
 * Using [gulp](http://gulpjs.com/) for building
 * Router [reactRouter](https://github.com/rackt/react-router)
 * [Redux simple router](https://github.com/rackt/redux-simple-router)
 * [Babel](https://github.com/babel/babel) for writing ES6 classes
 * [Eslint](http://eslint.org/docs/user-guide/configuring.html) for the glory of linters (thanks to [Nate's linter](https://bitbucket.org/osedea/osedea-style-guides/src/master/javascript/)) => Configure your IDE ([Atom](https://atom.io/packages/linter-eslint) / [Sublime](http://jonathancreamer.com/setup-eslint-with-es6-in-sublime-text/))