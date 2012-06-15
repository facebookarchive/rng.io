# Ringmark/Rng.io


## Setting up your environment

To run the existing tests or create new ones, you'll need an HTTP server with PHP (for contribution to w3c, server behavior is limited to PHP), node.js/npm, and grunt.

### Installing an HTTP Server with PHP

Tests must be run from an HTTP Server with PHP installed. You can use one of the following server/PHP bundles to setup a local testing environment.

- OSX [Mamp](http://www.mamp.info/en/index.html)
- Linux [Lamp](http://www.lamphowto.com/)
- Windows [Wamp](http://www.wampserver.com/en/)

### Installing node.js and npm

In order to build the tests, you'll also need [node.js](https://github.com/joyent/node) and [npm](https://github.com/isaacs/npm). Install instructions are available from the [node.js wiki](https://github.com/joyent/node/wiki/Installation).

npm now ships with node.js, so you shouldn't have to do anything special to install it. You can check for its presence by running:

```bash
npm -v
```

If command not found, install with:

```bash
curl http://npmjs.org/install.sh | sh
```

### Installing grunt

```bash
npm install grunt -g
```


### Setup

Fork this repository and clone your fork:

```bash
git clone git://github.com/username/rng.io.git
```

Enter the repo and add the upstream as a remote:

```bash
cd rng.io && git remote add upstream git://github.com/facebook/rng.io.git
```

Install development dependencies:

```bash
npm install
```

## Running Tests

**Start your local web server with the web root pointed at the rng.io repository root.**

Open `http://localhost/dev/test.html` in your browser to preview and run the tests.

(You may need to include a specific port number eg. `http://localhost:8888/dev/test.html`)


## Creating Tests

_For organizational purposes, Pull Requests must correspond to an issue. Pull Requests
should made from branches and branches should be named by issue number. To get started writing a new test, first
make sure there is an issue covering the API which you intend to test. If no issue exists, feel free to file one._

Create a **new branch**, named with the issue number of the feature, spec or API you intend to test:

```bash
git checkout -b [[issue-number]]

...or...

git checkout -b [[issue-number]]-[[description]]
```

Use the `new` test tool to generate a new working directory for your tests. The test name must be lowercased, with dashes in place of spaces.

For example, to create a new set of tests for an api called **"Neato API"**, run the following:

```bash
./new neato-api
```

If `new` does not run, try adding execution permission:

```bash
chmod +x new
```

This will create a new directory at:

**/tests/neato-api/**

```bash
.
├── config.yml      # required
├── fixture.html    # optional
├── iframe.html     # optional
└── test.js         # required

```

See [CSS2.1 Selectors Tests](https://github.com/facebook/coremob-tests/tree/master/tests/css2-1selectors) for an example of test directory file structure.


### config.yml

Configuration settings and meta data for this group of tests.

```yml
---
  r: 0
  spec: "url"
  sources: ["url", "url"]
  title: ""
  contributor: ""
```

- **r**: The ring number for this feature
- **spec**: URL of this feature/spec, if one exists
- **sources**: An array of URLs for existing resources that this test derives from
- **title**: Displayed name of feature/spec
- **contributor**: The name of the copyright holder.


### fixture.html (optional)

HTML markup used by the test, defaults to:

```html
<iframe id="neato-api" src="/tests/neato-api/iframe.html"></iframe>
```

_If a fixture is not required, please delete this file from your directory._


### iframe.html (optional)

DOM "Sandbox" for HTML markup used by the test, defaults to:

```html
<!doctype html>
<html>
<head>
</head>
<body>
<script>
// Run tests, postMessage results
top.postMessage( "Hi!", "*" );
</script>
</body>
</html>
```

_If an embedded fixture is not required, please delete this file from your directory._


### test.js

This file is where all of the test blocks and assertions are written, defaults to:

```js
test("<%= title %>", function() {
  // Prerequisite Assertions

  assert( truthy, "Spec supported" );

  // assert tests whether a value is Boolean true or truthy
});


asyncTest("<%= title %> Practical Application", function( async ) {
  // asyncTest callback receives "async" object as first argument

  // Assertion
  assert( truthy, "This thing is true" );

  // assert tests whether a value is Boolean true or truthy


  // async object
  // @instance
  // @type Object

  // step
  // @method
  // @memberOf async
  // @param callback function, wraps async assertions.

  async.step(function() {

    // Assertion
    assert( true, "This thing is true" );


  // done
  // @method
  // @memberOf async
  // @param indicate async test is complete.

    async.done();
  });
});
```


#### test

Represents a "unit" of functionality that will be tested. `testFunctionExpression` wraps test code and assertions.

#### asyncTest

Use `asyncTest` anytime the unit being tested would benefit from (or depends on) the use of events, timeouts and/or callbacks. (eg. a `message` event awaiting a `postMessage` from an iframe). In simple terms, `asyncTest` makes the test runner "wait" until the unit is done testing. (see `asyncTest` example below)

Use the `async.step(functionExpression)` to wrap assertions

When the `asyncTest` is complete, include a call to `async.done()` to signal that the unit is finished and the runner may continue.


### Assertions

There is only one assertion method which serves to simplify test
writing and maintainability. Furthermore, this maximizes readability
and comprehensibility.


```js
assert( actual, description );
```

- `actual` is any value; this value will be evaluated for "truthyness"*
- `description` description of what is being asserted.


_* In addition to Boolean `true`, "non empty string" and 1 are evaluated as "truthy". Use `!` negation to test "falsy" values: "", 0, null, undefined, NaN_



Take a look at `/tests/postmessage/test.js` for a good example of how test.js files are used:

```js
test("postMessage", function() {
  var postMessage = window.postMessage;

  assert( !!postMessage, "postMessage supported" );
});

test("onmessage", function() {
  assert( "onmessage" in window, "onmessage supported" );
});

asyncTest("postMessage/onmessage In Practice", function( async ) {
  window.onmessage = function( event ) {
    async.step(function() {
      assert( true, "onmessage event fired" );
      assert( event.data === "This is Ground Control", "message content matched expected" );
      async.done();
    });
  };

  window.postMessage( "This is Ground Control", "*" );
});
```


## Test Authoring Helpers

The rng.io includes a helper library called `H`. `H` provides a simple set of utility methods designed to make it easier to author browser API tests.


### H.API

Derive and assert the existence of an API that may or may not be prefixed and prefix testing is optional. This function exists to simplify the testing of new host object APIs that may exist in prefixed form.

The following prefixes are tested:

> "", "webkit", "Webkit", "WebKit", "moz", "Moz", "ms", MS", "O", "o"
> _(the first is no prefix)_


```js
H.API( object, api [, withPrefixes ])
```


Example:

```js

test("Vibration", function() {
  var vibrate = H.API( navigator, "vibrate", true );

  // This actually tested for:
  // vibrate, webkitVibrate, WebkitVibrate, WebKitVibrate, mozVibrate, MozVibrate,
  // msVibrate, MSVibrate, oVibrate, OVibrate

  assert( vibrate, "vibrate supported" );
});
```

>

### H.check

The `H.check` object provides methods to check elements for prefixed style and or DOM properties. Most of the logic was derived from or inspired by the excellent work done by the [Modernizr](https://github.com/Modernizr/Modernizr) team


### H.check.cssProp


Test that an element's style contains a specific property, Prefixes can be tested by optionally.

The following prefixes are tested:

> "", "Webkit", "WebKit", "Moz", "ms", "MS", "O"
> _(the first is no prefix)_



```js
H.check.cssProp( elem, prop [, withPrefixes ])
```

Example:

```js
test("CSS Text Stroke", function() {
  var elem = document.createElement("div");

  assert( H.check.cssProp( elem, "textStroke", true ), "textStroke supported" );

  // This actually tested for:
  // textStroke, WebkitTextStroke, WebKitTextStroke, MozTextStroke,
  // msTextStroke, MSTextStroke, OTextStroke
  // ...
});
```

### H.check.domProp


Test that an element contains a specific property, Prefixes can be tested by optionally.


```js
H.check.domProp( elem, prop [, withPrefixes ])
```

The `H.API` is a shortcut to `H.check.domProp`


### H.prefixes


The `H.prefixes` object contains the table of prefixes used in all of the prefix-aware tests.

### H.prefixes.css

Array; contains all of the CSS prefixes

> `[ "-webkit-", "-moz-", "-o-", "-ms-" ]`

### H.prefixes.cssom

Array; contains all of the CSS "Object Model" mode prefixes (see: `H.prefixes.css`)


### H.prefixes.expand


Returns prefix expanded CSS Rule.

```js
H.prefixes.expand( rule )
```

Example:

```js
> H.prefixes.expand( "text-shadow" );

"text-shadow;-webkit-text-shadow;-moz-text-shadow;-o-text-shadow;-ms-text-shadow;"
```



## Contributing Tests
### Contributor License Agreement

All contributors must agree to and sign the [Facebook CLA](https://developers.facebook.com/opensource/cla) prior to submitting Pull Requests. Ringmark cannot accept Pull Requests until this document is signed and submitted.


### Style Guide


Tests must be able to compile to a W3C flat file test runner, this can be confirmed by running:

`grunt generate`


In order to maintain a consistent level of readability and maintainability, all contributions should pass lint (use `grunt`)

- 2 Space, Soft Tabs
- Double Quotes


Once you're satisfied with your tests:

- Commit new tests to your local branch,
- Push the branch to your fork,
- Make a pull request from your fork on github.


<img src="https://github.com/facebook/rng.io/raw/master/dev/pr.png">


### Coremob WG/ W3C Contributions


To generate static files for donation to the Coremob WG and W3C, use the following commands:

``` bash
grunt generate
```

To generate one or more _specific_ tests, use the following:

``` bash
grunt generate:*:test1:test2:test3
```

eg.

``` bash
grunt generate:*:appcache:webworkers
```

(This would generate static files from the appcache and webworkers tests.)



### Restrictions

Contributions are restricted to code in the `/tests/` directory. Any changes to code outside of this directory will be disregarded and may block your Pull Request.



## Licensing

Copyright (c) 2012 Facebook

All of the tests in the Coremob test suites are intended to be released under both the [W3C Test Suite license][w3c_license] and the [3-clause BSD license][bsd].

Contributors must grant permission to distribute their contribution under these two licenses, and this requires completing the [W3C's license grant form][grant].

[w3c_license]: http://www.w3.org/Consortium/Legal/2008/04-testsuite-license.html
[bsd]: http://www.w3.org/Consortium/Legal/2008/03-bsd-license.html
[grant]: http://www.w3.org/2002/09/wbs/1/testgrants2-200409/
[list]: http://lists.w3.org/Archives/Public/public-coremob/
[testharness]: https://github.com/jgraham/testharness.js
