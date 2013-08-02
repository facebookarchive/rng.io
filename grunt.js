var Yaml = require("js-yaml"),
    inspect = require("util").inspect,
    path = require("path"),
    _ = require("lodash");



/*global config:true, task:true, module:true */
module.exports = function( grunt ) {

  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
      banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('m/d/yyyy') %>\n" +
              // "* <%= pkg.homepage %>\n" +
              "* Copyright ( c ) <%= grunt.template.today('yyyy') %> <%= pkg.author %>" +
              " Licensed <%= _.pluck( pkg.licenses, 'type').join(', ') %> */"
    },

    features: {
      "dist/features.js": [ "tests/!(boilerplate)**/*.yml" ]
    },

    apptypes: {
      "dist/apptypes.js": [ "dist/apptypes.json" ]
    },

    browserscopekeys: {
      "dist/browserscopekeys.js": [ "dist/browserscopekeys.yml" ]
    },

    ringheaders: {
      "dist/ringheaders.js": [ "dist/ringheaders.json" ]
    },

    fixtures: {
      "dist/fixtures.js": [ "tests/!(boilerplate)**/*fixture.html" ]
    },

    compile_tests: {
      "dist/rings.js": [ "tests/!(boilerplate)**/*.yml" ]
    },
    spec: {
      "dist/tests.js": [ "tests/!(boilerplate)**/*.js" ]
    },
    concat: {
      // JS Files
      // "dist/suite.js": [ "lib/qunit-custom.js", "lib/compat.js", "<file_strip_banner:lib/h.js>" ],
      "dist/runner.js": [ "lib/console.js", "lib/qunit-custom.js", "lib/compat.js" ],
      "dist/h.js": [ "<banner>", "<file_strip_banner:lib/h.js>", "lib/ring.js" ],
      "dist/ringmark.js": [
        "lib/archaic.js", "lib/console.js", "lib/qunit-custom.js",
        "lib/compat.js",
        "<banner>", "<file_strip_banner:lib/h.js>", "lib/ring.js",
        "lib/h-logging.js"
      ],
      "dist/application.js": [
        "dist/lodash.js",
        "lib/jquery-1.7.2.js",
        "lib/jquery.details.js",
        "lib/app.js",

        // Entries in App.Cache:
        "dist/features.js",
        "dist/fixtures.js",
        "dist/apptypes.js",
        "dist/browserscopekeys.js",
        "dist/ringheaders.js",
        // ...end

        "lib/browserscope.js",
        "lib/site.js"
      ],
      "dist/performance.js": [
        "performance/src/moxie.js",
        "performance/src/raf.js",
        "performance/src/sprite.js"
      ],

      // HTML Compiled Fixtures
      // "dist/fixtures.html": [ "tests/!(boilerplate)**/*fixture.html" ],

      "index.html": [ "site/header.html", "site/footer.html" ]
    },
    min: {
      /*"dist/runner.min.js": [ "dist/runner.js" ],*/
      //"dev/suite.min.js": [ "dist/suite.js" ],
      "dist/h.min.js": [ "<banner>", "dist/h.js" ],
      "dist/ringmark.min.js": [ "<banner>", "dist/ringmark.js" ],
      "dist/application.min.js": [ "<banner>", "dist/application.js" ],
      "dist/rings.min.js": [ "<banner>", "dist/rings.js" ],
      "dist/performance.min.js": [ "<banner>", "dist/performance.js" ],
      "dev/load.min.js": [ "<banner>", "lib/load.js" ]
    },

    generate: {
      files: [ "tests/**/*.yml" ]
    },
    mincss: {
      "dist/style.css": [ "site/site.css" ]
    },
    test: {
      files: [ "lib-test/**/*.js" ]
    },
    lint: {
      files: [ "grunt.js", "lib/**/!(console|deferred|jquery|qunit-custom)*.js", "lib-test/**/*.js", "tests/**/*.js", "site/**/!(underscore-min)*.js" ]
    },
    watch: {
      files: [ "<config:lint.files>", "site/header.html", "site/footer.html", "site/site.css", "lib/**/*.js", "performance/**/*.js", "about/**/*.*", "history/**/*.*", "apps/**/*.*" ],
      tasks: "short"
    },
    untab: {
      files: [
        "lib/**/*.js", "lib-test/**/*.js", "tests/**/*"
      ]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: false,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        evil: true,
        browser: true,
        trailing: true,
        maxerr: 10,
        loopfunc: true
      },
      globals: {
        self: true,
        Node: true,
        global: true,
        exports: true,
        require: true,
        file: true,
        log: true,
        console: true,
        importScripts: true,
        truthy: true,
        alert: true,

        // Site
        App: true,
        Rng: true,
        Ringmark: true,
        H: true,
        Hat: true,
        Ring: true,
        $: true,

        // Ringmark Assert
        assert: true,


        // All over
        QUnit: true,

        // QUnit API
        test: true,
        asyncTest: true,
        expect: true,
        module: true,
        start: true,
        stop: true,

        // QUnit Assertions
        ok: true,
        equal: true,
        notEqual: true,
        deepEqual: true,
        notDeepEqual: true,
        strictEqual: true,
        notStrictEqual: true,
        raises: true
      }
    },
    uglify: {}
  });

  // Default task.
  task.registerTask("default", "lint compile_tests features apptypes ringheaders browserscopekeys fixtures spec concat mincss min");
  //"lint test compile_tests features apptypes ringheaders browserscopekeys fixtures spec concat mincss min"

  task.registerTask("short", "lint compile_tests features apptypes ringheaders browserscopekeys fixtures spec concat min");



  /*
   * Custom Grunt Tasks
   * ---------------
   */


  task.registerMultiTask("generate", "Generate static test files for Coremob WG", function() {

    // USAGE:
    //
    // generate:*:appcache:webworkers
    //
    // generate
    //
    var assets, done, targets, template, ymls;

    done = this.async();
    targets = Object.keys( this.flags );
    ymls = file.expandFiles( this.file.src );


    template = file.read( "coremob/lib/template.jst" );

    if ( targets.length ) {
      ymls = ymls.filter(function( yml ) {
        return targets.some(function(target) {
          return yml.indexOf(target) >= 0;
        });
      });
    } else {
      targets = ymls.map(function( yml ) {
      return yml.split("/")[1];
      });
    }

    targets.forEach(function( target ) {
      var parts, content, contents, filepath, tests, html, css;

      filepath = "tests/" + target + "/";

      contents = {
        target: target
      };

      parts = {
        tests: "test.js",
        html: "fixture.html",
        css: "fixture.css"
      };

      Object.keys( parts ).forEach(function( key ) {
        var checkFile = filepath + parts[ key ];

        console.log( checkFile );

        contents[ key ] = path.existsSync( checkFile ) ?
          file.read( checkFile ) : "";
      });

      content = _.template( template, contents );

      file.write( "coremob/" + target + ".html", content );

      log.writeln("File: coremob/" + target + ".html - written");
    });
  });



  task.registerMultiTask("untab", "Transform tabs to spaces", function() {
    // Concat specified files.
    var files = file.expandFiles( this.file.src );

    files.forEach( function( filepath ) {
      task.helper("untab", file.read( filepath ), filepath );
    });

    // Fail task if errors were logged.
    if ( this.errorCount ) { return false; }

    // Otherwise, print a success message.
    log.writeln("File's untabbed.");
  });


  task.registerHelper("untab", function( src, filepath ) {
    file.write( filepath, src.replace(/\t/g, " ") );
  });


  task.registerMultiTask("spec", "spec all tests", function() {
    // Concat specified files.
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        built = "";

    files.forEach( function( filepath ) {

      var spec = filepath.split("/")[1],
          source = file.read( filepath ),
          compiled;

      compiled = [
        "\nwindow.spec = \"" +spec + "\";\n",
        source
      ].join("\n\n");

      built += compiled;
    });


    file.write( name, built );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });


  task.registerMultiTask("compile_tests", "compile_tests all tests", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        yml;

    // Initialize inband vars
    var built = "",
        wrapped = [],
        rings = [
          // #: [ sources ]
        ];

    // console.log( files );
    files.forEach( function( filepath ) {

      var spec = filepath.split("/")[1],
          sources = {
            yml: file.read( filepath ),
            test: file.read( filepath.replace("config.yml", "test.js") )
          },
          doc = Yaml.load( sources.yml ),
          compiled;

      if ( doc.r != null ) {
        if ( !rings[ doc.r ] ) {
          rings[ doc.r ] = [];
        }

        // console.log( inspect( doc, false, 10, true ) );

        compiled = [
          "\nwindow.spec = \"" +spec + "\";\n",
          sources.test
        ].join("\n\n");

        rings[ doc.r ].push({
          spec: spec,
          title: doc.title || spec,
          compiled: compiled
        });
      }
    });

    // console.log( rings[2].length );
    rings.forEach( function( sets, ring ) {

      var compiled = [
        "Hat.ring({ ",
        "  ring: " + ( ring || 0) + ",",
        "  features: " + sets.length + ",",
        "  test: function() {",
        "    ",
        "    module(\"ring:" + ring + "\");"
      ];

      sets.forEach( function( set ) {
        compiled.push(
          "    feature(\"" +set.spec + "\", " + ring + ", \"" +set.title + "\");",
          set.compiled.replace(/\n/g, "\n    ")
        );
      });

      compiled.push(
        //"    Hat.Promises[ " + ring + " ].resolve();",
        // "    window.spec = "dummy";",
        // "    feature("dummy", " + ring + ");",
        // "    test("dummy", function() {});",
        "  }",
        "});"
      );

      built += compiled.join("\n") + "\n";
    });


    wrapped.push(
      built
      // "document.addEventListener("DOMContentLoaded", function() {",
      // built,
      // "}, false );"
    );

    // Write the build test runner
    file.write( name, wrapped.join("\n") );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });


  task.registerMultiTask("features", "aggregate features from spec dirs into jsonp", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        yml;

    // Initialize inband vars
    var features = [];

    // console.log( files );
    files.forEach( function( filepath ) {

      var name = filepath.split("/")[1],
          sources = {
            yml: file.read( filepath )
          },
          doc = Yaml.load( sources.yml );

      //console.log( inspect( doc, false, 2, true ) );
      features.push({
        name: name,
        title: doc.title,
        ring: doc.r,
        spec: doc.spec || "",
        sources: doc.sources || []
      });
    });


    file.write( "dev/feature-select.js", JSON.stringify( features, null, 2 ) );

    // Write the build test runner
    file.write( name, "App.register( \"features\", " + JSON.stringify( features, null, 2 ) + ");" );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });

  task.registerMultiTask("browserscopekeys", "aggregate embed browserscope keys", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        browserscopekeys = Yaml.load( file.read( files[0] ) );

    // Wrap in an array
    browserscopekeys = [ browserscopekeys ];

    file.write( name, "App.register( \"browserscopekeys\", " + JSON.stringify( browserscopekeys, null, 2 ) + ");" );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });


  // TODO: Consolidate "apptypes" and "ringheaders"

  task.registerMultiTask("apptypes", "aggregate apptypes into embedded js", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        apptypes;

    apptypes = JSON.parse( file.read( files[0] ) );

    // console.log( apptypes );

    // Write the build test runner
    file.write( name, "App.register( \"apptypes\", " + JSON.stringify( apptypes, null, 2 ) + ");" );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });

  task.registerMultiTask("ringheaders", "aggregate embed ringheaders", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        ringheaders = JSON.parse( file.read( files[0] ) );

    file.write( name, "App.register( \"ringheaders\", " + JSON.stringify( ringheaders, null, 2 ) + ");" );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });


  task.registerMultiTask("fixtures", "aggregate fixtures from spec dirs into jsonp", function() {
    // Gather config files, initialize program vars
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest,
        yml;

    // Initialize inband vars
    var features = [];

    // console.log( files );
    files.forEach( function( filepath ) {

      var name = filepath.split("/")[1],
          source = file.read( filepath );

      //console.log( inspect( doc, false, 2, true ) );
      if ( source.trim() ) {
        features.push({
          name: name,
          source: source
        });
      }
    });

    // Write the build test runner
    file.write( name, "App.register( \"fixtures\", " + JSON.stringify( features, null, 2 ) + ");" );

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });


  /*
   * Grunt Task File
   * ---------------
   *
   * Task: MinCSS
   * Description: Compress down CSS files cleanly
   * Dependencies: clean-css
   *
   * source:
   * https://raw.github.com/tbranyen/backbone-boilerplate/master/build/index.js
   */

  task.registerMultiTask("mincss", "Compress down CSS files cleanly", function() {
    var files = file.expandFiles( this.file.src ),
        name = this.file.dest;

    // Minify CSS.
    file.write( name, task.helper("mincss", files ) );

    // Fail task if errors were logged.
    if ( this.errorCount ) { return false; }

    // Otherwise, print a success message.
    log.writeln("File \"" +name + "\" created.");
  });

  // ============================================================================
  // HELPERS
  // ============================================================================

  task.registerHelper("mincss", function( files ) {
    var cleanCSS = require("clean-css");

    // Minify and combine all CSS
    return files ? files.map( function( filepath ) {
      return cleanCSS.process( file.read( filepath ) );
    }).join("") : "";
  });
};
