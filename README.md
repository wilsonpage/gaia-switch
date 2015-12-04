# &lt;fxos-switch&gt; ![](https://travis-ci.org/fxos-components/fxos-switch.svg)

## Installation

```bash
$ npm install fxos-switch
```

Then include folowing files in HTML

```html
<script src="node_modules/fxos-component/fxos-component.js"></script>
<script src="node_modules/fxos-switch/fxos-switch.js"></script>
```

## Examples

- [Example](http://fxos-components.github.io/fxos-switch/)

## Usage

Normal

```
<fxos-switch></fxos-switch>
```

Checked

```
<fxos-switch checked></fxos-switch>
```

Disabled

```
<fxos-switch disabled></fxos-switch>
```

## Readiness

- [x] Accessibility ([@yzen](https://github.com/yzen))
- [ ] Test Coverage
- [ ] Performance
- [ ] Visual/UX
- [ ] RTL

## Developing locally

1. `git clone https://github.com/fxos-components/fxos-switch.git`
2. `cd fxos-switch`
3. `npm install` (NPM3)
4. `npm start`

## Tests

1. Ensure Firefox Nightly is installed on your machine.
2. To run unit tests you need npm >= 3 installed.
3. `$ npm install`
4. `$ npm run test-unit`

If your would like tests to run on file change use:

`$ npm run test-unit-dev`

If your would like run integration tests, use:
`$ export FIREFOX_NIGHTLY_BIN=/absolute/path/to/nightly/firefox-bin`
`$ npm run test-integration`

## Lint check

Run lint check with command:

`$ npm run test-lint`
