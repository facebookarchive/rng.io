(function( window ) {


function Renderer( src ) {
  if ( !src ) {
    throw new Error("Cannot create new Renderer without src");
  }
  this.image = new Image();
  this.image.src = src;
};

Renderer.prototype = {
  render: function( frame, bounds, context ) {

    // Wrap the drawImage call in try/catch to avoid
    // Uncaught Error: INDEX_SIZE_ERR: DOM Exception 1
    // when the canvas and image have gone away
    try {
      context.drawImage(
        // Draw the entity...
        this.image,
        // On the cell...
        frame.left, frame.top,
        frame.width, frame.height,
        // Within the current calculated bounds...
        bounds.left, bounds.top,
        frame.width, frame.height
      );
    } catch ( e ) {}

    return this;
  }
};

/**
 * Sheet
 * @param {String} src   Image url
 * @param {Array} cells Frame/Cell objects
 */
function Sheet( src, cells ) {
  this.entity = new Renderer( src );
  this.cells = cells || [];
  this.index = 0;
};

Sheet.prototype = {
  // Advance to the next Frame
  next: function() {
    // At the end, return to the beginning
    if ( this.index === this.cells.length - 1 ) {
      this.index = 0;
    } else {
      this.index++;
    }

    return this;
  },
  // Draw the current Frame
  render: function( sprite, context ) {
    this.entity.render(
      this.cells[ this.index ],
      sprite.bounds,
      context
    );

    return this;
  }
};



function Sprite( options ) {
  var bounds, velocity;

  if ( !options.context ) {
    throw new Error("Cannot create new Sprite without canvas context");
  }

  this.name = options.name;

  // Create an instance of Sheet with a set of cells
  this.sheet = new Sheet( options.src, options.cells );

  // Create a reference property to the canvas context
  this.context = options.context;

  // Refer to original sprite element
  this.reference = this.sheet.entity.image;

  // Array of objects containing state and an action method
  this.frames = options.frames;

  // Set default bounds object
  options.bounds = bounds = options.bounds || {};

  // Bounding box definition
  this.bounds = {
    left: bounds.left || 0,
    top: bounds.top || 0,
    width: bounds.width || 0,
    height: bounds.height || 0
  };

  // Set default velocity object
  options.velocity = velocity = options.velocity || {};

  // In motion velocity
  // Value is px/s
  this.velocity = {
    x: velocity.x || 0,
    y: velocity.y || 0
  };

  // Visual state properties
  this.visible = true;
  this.animating = false;
}

Sprite.prototype = {
  // Pass-through call to the render method of
  // the current sprite's sheet
  render: function() {
    if ( this.visible ) {
      this.sheet.render( this, this.context );
    }

    return this;
  },
  // Iterate and execute the action method
  // of each frame object
  update: function( time ) {
    var i = this.frames.length;

    while ( i ) {
      this.frames[ i - 1 ].action( this, this.context, time );
      i--;
    }

    return this;
  }
};

window.Renderer = Renderer;
window.Sheet = Sheet;
window.Sprite = Sprite;

})( this );
