# makeup-modal

<p>
    <a href="https://travis-ci.org/makeup-js/makeup-modal"><img src="https://api.travis-ci.org/makeup-js/makeup-modal.svg?branch=master" alt="Build Status" /></a>
    <a href='https://coveralls.io/github/makeup-js/makeup-modal?branch=master'><img src='https://coveralls.io/repos/makeup-js/makeup-modal/badge.svg?branch=master&service=github' alt='Coverage Status' /></a>
    <a href="https://david-dm.org/makeup-js/makeup-modal"><img src="https://david-dm.org/makeup-js/makeup-modal.svg" alt="Dependency status" /></a>
    <a href="https://david-dm.org/makeup-js/makeup-modal#info=devDependencies"><img src="https://david-dm.org/makeup-js/makeup-modal/dev-status.svg" alt="devDependency status" /></a>
</p>

Sets an element to a modal state, using [makeup-keyboard-trap](https://github.com/makeup-js/makeup-keyboard-trap) and [makeup-screenreader-trap](https://github.com/makeup-js/makeup-screenreader-trap).

## Experimental

This module is still in an experimental state, until it reaches v1.0.0 you must consider all minor releases as breaking changes. Patch releases may introduce new features, but will be backwards compatible.

```js
const modal = require('makeup-modal');

// set an element to modal
modal.modal(document.querySelector('el'));

// reset the element to non-modal
modal.unmodal();
```

## Install

```js
// via npm
npm install makeup-modal

// via yarn
yarn add makeup-modal
```

## Events

* modal
* unmodal

## Dependencies

* [makeup-keyboard-trap](https://github.com/makeup-js/makeup-keyboard-trap)
* [makeup-screenreader-trap](https://github.com/makeup-js/makeup-screenreader-trap)

## Development

* `npm start`
* `npm test`
* `npm run lint`
* `npm run fix`
* `npm run build`
* `npm run clean`

## Test Reports

Each test run will generate the following reports:

* `/reports/coverage` contains Istanbul code coverage report
* `/reports/html` contains HTML test report

## CI Build

https://travis-ci.org/makeup-js/makeup-modal

## Code Coverage

https://coveralls.io/github/makeup-js/makeup-modal
