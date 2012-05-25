var prop,
  array = [],
  data = {
    objectA: {
      a: 1,
      b: null,
      c: [{}],
      d: {
        a: 3.14159,
        b: false,
        c: {
          d: 0,
          f: [[[]]],
          g: {
            j: {
              k: {
                n: {
                  r: "r",
                  s: [1, 2, 3],
                  u: 0,
                  v: {
                    w: {
                      x: {
                        y: "Yahoo!",
                        z: null
                      }
                    }
                  }
                },
                o: 99,
                q: []
              },
              m: null
            }
          },
          h: "false",
          i: true
        }
      },
      e: String("constructed string"),
      f: {},
      g: "",
      h: "h",
      i: []
    },
    array: [ 1, 2, 3, 4, 5, 6, 7, 8, 9,  [
          1, 2, 3, 4, 5, 6, 7, 8, 9,  [
            1, 2, 3, 4, 5, [
              [6, 7, 8, 9,  [
                [
                  1, 2, 3, 4, [
                    2, 3, 4, [
                      1, 2, [
                        1, 2, 3, 4, [
                          1, 2, 3, 4, 5, 6, 7, 8, 9, [ 0 ], 1, 2, 3, 4, 5, 6, 7, 8, 9
                        ], 5, 6, 7, 8, 9
                      ], 4, 5, 6, 7, 8, 9
                    ], 5, 6, 7, 8, 9
                  ], 5, 6, 7
                ]
              ]
            ]
          ]
        ]
      ]
    ],
    string: "this is a standard string",
    bool: true,
    loc: {},
    ua: navigator.userAgent
  };


for ( prop in data ) {
  array.push( data[ prop ] );
}