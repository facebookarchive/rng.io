(function( exports, Hat ) {
  // References
  // https://developer.mozilla.org/en/Canvas_tutorial/Compositing
  // http://www.html5canvastutorials.com/tutorials/html5-canvas-arcs/


  // private: `rings` cache array for storing instances of Ring,
  //          `contexts` cache object for storing DOM canvas contexts
  var rings = [] ,
      contexts = {},
      colors = {
        // Color Constants
        // grey
        running: "255, 255, 255",
        // white
        clear: "255, 255, 255",
        // green
        pass: "0, 199, 59",
        // gray
        fail: "182, 184, 186"
      },
      lang = {
        nomore: "No more ticks available for this ring"
      };

  // Ring Constructor
  function Ring( opts ) {
    var prop;

    // Iterate options, intialize as instance properties, assign value
    for ( prop in opts ) {
      this[ prop ] = opts[ prop ];
    }

    // Initialize a history of ticks,
    // (Math.PI * 1.5) => 12 o'clock
    this.history = [ Math.PI * 1.5 ];
  }

  Ring.prototype.draw = function( start, end, color, alpha ) {


    var strokeStyle = "rgba(" + color + ", " + alpha + ")";

    // Begin drawing arc path
    this.ctx.beginPath();

    // Draw the arc to the next ending angle
    // x, y, radius, startAngle,endAngle, clockwise
    this.ctx.arc(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
      this.radius,
      start, end,
      false
    );

    // Set color of arc line
    this.ctx.strokeStyle = strokeStyle;
    // Set size of arc line
    this.ctx.lineWidth = this.line;
    // Draw the line
    this.ctx.stroke();
    // Close the arc path
    this.ctx.closePath();
  };

  Ring.prototype.tick = function( type, data ) {

    // Prevent (over)lapping ticks
    if ( this.history.length > this.ticks ) {
      console.log( lang.nomore );
      return;
    }

    // Normalize default calls to .tick() or .tick( data )
    if ( !type || typeof type !== "string" ) {
      data = type;
      type = "tick";
    }

    var start = this.history[ this.history.length - 1 ],
        end = start + this.step,
        alpha = 1,
        color = colors.running;

    // Determine color to draw slice.
    if ( data ) {
      color = colors[ !data.failed ? "pass" : "fail" ];
    }

    // Clear the grey "running" tick by overwriting
    // with a white "clearing" tick
    // if ( type === "tick" ) {
    //   this.draw( start, end, colors.clear, alpha );
    // }

    // Failed tests should adjust the alpha
    // channel of the display color to
    // indicate degree of the failure.
    // Light (less fail) <------> Dark (more fail)
    // if ( data && data.failed ) {
    //   alpha = data.failed / data.total;
    // }


    this.draw( start, end + 0.009, color, alpha );


    // If non- "running" or "clear" ticks...
    if ( type === "tick" ) {

      this.draw( start, end + 0.009, color, alpha );

      // Push the tick into the ring instance's history
      this.history.push( end );
    }
  };

  Ring.trace = function() {

    var ctx, line,
        trace = document.createElement("canvas"),
        dims = {
          width: null,
          height: null
        },
        canvas = (function() {
          var prop;

          for ( prop in contexts ) {
            return contexts[ prop ].canvas;
          }
        }());

    // Setup position of trace overlay
    trace.style.position = "relative";
    trace.style.top = "-305px";
    trace.style.left = "-5px";

    // Setup size of trace overlay
    trace.width = canvas.width + 10;
    trace.height = canvas.height + 10;

    // Insert into DOM, directly following canvas to overlay
    canvas.parentNode.insertBefore( trace, canvas.nextSibling );

    // Capture trace overlay canvas context
    ctx = trace.getContext("2d");

    dims.width = ctx.canvas.width / 2;
    dims.height = ctx.canvas.height / 2;

    line = Ring.get(0).line * rings.length + 1;

    // Starting point line
    ctx.fillRect( dims.width - 4, 10, 8, line );

    // Draw label bar
    ctx.fillRect(
      dims.width + 65,
      dims.height - 10,
      line, 21
    );

    // Set Label properties
    ctx.font = "bold 12px Helvetica";

    // Iterate over an array of radius
    // Adds a padding ring [ { line: 25 } ] for outline outline
    rings.concat([ { line: 25 } ]).forEach(function( ring, index ) {
      // Begin drawing the ring outline arc path
      ctx.beginPath();

      // x, y, radius, startAngle,endAngle, clockwise
      ctx.arc(
        dims.width,
        dims.height - 3,
        ring.line * (index + 1) + 40,
        Math.PI * 2, 0,
        false
      );

      // Set color of the ring outline arc line
      ctx.strokeStyle = "rgba( 0, 0, 0, 1 )";
      // Set size of ring outline arc line
      ctx.lineWidth = 8;
      // Draw the ring outline
      ctx.stroke();
      // Close the ring outline arc path
      ctx.closePath();


      // Set fillStyle for text drawing
      ctx.fillStyle = "rgba( 255, 255, 255, 1 )";

      // Draw label names
      if ( index < rings.length ) {
        ctx.fillText(
          "r." + index,
          dims.width + (ring.line * (index + 1) + 45),
          dims.height + 5
        );
      }
    });
  };



  Ring.create = function( nodeId, opts ) {
    var ring,
      config = exports.Ring.config;

    // Allow Ring to be created without requiring an index,
    // assume it's the next ring of the concentric set
    if ( opts.index == null ) {
      opts.index = rings.length;
    }

    // If no ticks specific for this ring
    // assume only one tick will occur. When ticks = 0,
    // a call to ring.tick() will "tick" the entire circle
    if ( opts.ticks == null ) {
      opts.ticks = 0;
    }

    // If it's set, use the pre-calculated next diameter
    // otherwise, use the configurable initial value
    opts.diameter = config.diameter.next || config.diameter.initial;

    // Pre-calculate the next ring diameter
    config.diameter.next = (config.diameter.next || config.diameter.initial) +
                            (config.diameter.padding * 2);
                            // ((config.diameter.padding * 2) + 10);

    // Calculate this ring's radius - is used in arc drawing arguments
    opts.radius = opts.diameter / 2;

    // If this is not the first, inner-most ring, artificially pad
    // the radius with an additional 1/2 of the radius size, to
    // clear the width of the line
    if ( opts.index > 0 ) {
      // opts.radius += config.diameter.initial / 2;
      // opts.radiusIsPadded = true;
    }

    // Set the line width to the configurable line initial value
    // this is used by the canvas api to determine visual width of
    // of the displayable line/arc
    opts.line = config.line.initial;

    // Capture the circumference - it's not used, but could be useful
    // in the future.
    opts.circ = opts.diameter * Math.PI;

    // Calculate the size a step for this ring will be
    opts.step = Math.PI * 2 / opts.ticks;

    // If context has no been cached, do so
    if ( !contexts[ nodeId ] ) {
      contexts[ nodeId ] = document.getElementById( nodeId ).getContext("2d");
    }

    // Assign a context to this ring, from the cache of contexts
    opts.ctx = contexts[ nodeId ];

    // Push a new Ring instance into the private `rings` cache array
    // `rings` are accessible via Ring.get([index])
    rings.push( new Ring(opts) );

    // Return the newly created ring from the `rings` cache array
    return rings[ rings.length - 1 ];
  };

  // Generate all visual ring instances based on the cached rings
  // in Hat.ring.cache
  // Ring instances require a canvas node ID
  Ring.create.all = function( nodeId ) {
    if ( Hat.ring.cache.length ) {
      Hat.ring.cache.forEach(function( ring ) {
        Ring.create( nodeId, {
          ticks: ring.features
        });
      });

      Ring.trace();
    }
  };

  // `rings` cache array access
  Ring.get = function( index ) {
    return index != null && rings[ index ];
  };

  // Configuration object
  Ring.config = {
    diameter: {
      padding: 25,
      initial: 150,
      next: 0
    },
    line: {
      initial: 25
    }
  };

  if ( typeof global !== "undefined" ) {
    Ring.config.contexts = {};
    contexts = Ring.config.contexts;
  }

  // Expose Ring API
  exports.Ring = Ring;

  if ( exports.Hat ) {
    exports.Hat.Ring = exports.Ring;
  }
}( typeof exports === "object" && exports || this, this.Hat || {} ) );
