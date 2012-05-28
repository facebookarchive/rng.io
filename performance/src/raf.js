window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||

  function raf( callback, element ) {
    var start,
       finish;

    window.setTimeout(function () {
      start = +new Date();
      callback(start);
      finish = +new Date();

      raf.timeout = 1000 / 60 - (finish - start);

    }, raf.timeout );
  };
