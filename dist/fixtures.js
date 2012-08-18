App.register( "fixtures", [
  {
    "name": "animationtiming",
    "source": "<div id=\"animationtiming\"></div>"
  },
  {
    "name": "appcache",
    "source": "<!-- <iframe id=\"appcache\" src=\"/tests/appcache/iframe.html\"></iframe> -->"
  },
  {
    "name": "canvas-3d",
    "source": "<iframe id=\"canvas-3d\" src=\"/tests/canvas-3d/iframe.html\"></iframe>"
  },
  {
    "name": "css2-1selectors",
    "source": "<iframe id=\"css2-1selectors\" src=\"/tests/css2-1selectors/iframe.html\"></iframe>"
  },
  {
    "name": "css3dtransforms",
    "source": "<iframe id=\"css3dtransforms\" src=\"/tests/css3dtransforms/iframe.html\"></iframe>\n"
  },
  {
    "name": "cssfont",
    "source": "<div id=\"cssfont\">\n  <iframe id=\"cssfont-face\" src=\"/tests/cssfont/fontface.html\"></iframe>\n  <iframe id=\"cssfont-load\" src=\"/tests/cssfont/iframe.html\"></iframe>\n</div>\n"
  },
  {
    "name": "cssimages-standard",
    "source": "<iframe id=\"cssimages\" src=\"/tests/cssimages/iframe.html\"></iframe>\n"
  },
  {
    "name": "cssmediaqueries",
    "source": "<iframe id=\"cssmediaqueries\" src=\"/tests/cssmediaqueries/iframe.html\"></iframe>\n"
  },
  {
    "name": "cssminmax",
    "source": "<div id=\"cssminmax\">\n  <div id=\"css-min-width\" style=\"min-width:20px;position:absolute\">?</div>\n  <div id=\"css-max-width\" style=\"max-width:20px;position:absolute;overflow:hidden\">This should push the width pretty damn far</div>\n  <div id=\"css-min-height\" style=\"min-height:20px;position:absolute\"></div>\n  <div id=\"css-max-height\" style=\"max-height:20px;position:absolute;overflow:hidden\">Horizontal<hr>Rule<hr>Rules!</div>\n</div>"
  },
  {
    "name": "cssposition",
    "source": "<iframe id=\"cssposition\" src=\"/tests/cssposition/iframe.html\"></iframe>"
  },
  {
    "name": "cssui-standard",
    "source": "<iframe id=\"cssui-standard\" src=\"/tests/cssui-standard/iframe.html\"></iframe>"
  },
  {
    "name": "cssvalues",
    "source": "<div id=\"cssvalues\" style=\"display:inline-block;position:absolute;\">H</div>\n"
  },
  {
    "name": "dataurl",
    "source": "<div id=\"dataurl\">\n  <img id=\"dataurl-data\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+5gz/qwAAAABJRU5ErkJggg==\">\n  <img id=\"dataurl-png\" src=\"/tests/dataurl/pixel.png\">\n</div>"
  },
  {
    "name": "deviceorientation",
    "source": "<div id=\"deviceorientation\"></div>\n"
  },
  {
    "name": "formdata",
    "source": "<div id=\"formdata\">\n  <form id=\"simpleForm\">\n    <input type=\"text\" name=\"a\" value=\"alpha\"/>\n    <select name=\"b\">\n      <option value=\"beta\">Beta</option>\n      <option value=\"gamma\">Gamma</option>\n    </select>\n  </form>\n</div>"
  },
  {
    "name": "forms",
    "source": "<div id=\"forms\">\n  <input type=\"text\" id=\"requiredtest\" required>\n</div>\n"
  },
  {
    "name": "hashchange",
    "source": "<iframe id=\"hashchange\" src=\"/tests/hashchange/iframe.html\"></iframe>"
  },
  {
    "name": "html5",
    "source": "<div id=\"html5\">\n  <abbr></abbr><article></article><aside></aside><audio></audio>\n  <bdi></bdi>\n  <bdi dir=\"ltr\">foo</bdi>\n  <bdi dir=\"rtl\">bar</bdi>\n  <bdi dir=\"auto\">baz</bdi>\n\n  <data></data><details></details><figcaption></figcaption><figure></figure>\n  <footer></footer><header></header><hgroup></hgroup>\n  <mark>hi!</mark><meter></meter><nav></nav><output></output><progress></progress>\n  <section></section><summary></summary><time></time><video></video>\n</div>\n"
  },
  {
    "name": "iframe",
    "source": "<div id=\"iframe\">\n<iframe id=\"regular\" src=\"/tests/iframe/iframe.html?regular\"></iframe>\n<iframe id=\"sandbox\" sandbox src=\"/tests/iframe/iframe.html?sandbox\"></iframe>\n<!-- <iframe id=\"sandbox\" sandbox src=\"/tests/iframe/iframe.html?sandbox\"></iframe>\n<iframe id=\"allowScripts\" sandbox=\"allow-scripts\" src=\"/tests/iframe/allow-scripts.html?allow-scripts\"></iframe>\n<iframe id=\"allowScriptsForms\" sandbox=\"allow-scripts allow-forms\" src=\"/tests/iframe/allow-scripts-forms.html?allow-scripts-forms\"></iframe>\n --></div>\n"
  },
  {
    "name": "navigationtiming",
    "source": "<!-- <iframe id=\"navigationtiming\" src=\"/tests/navigationtiming/iframe.html\"></iframe> -->"
  },
  {
    "name": "ring-0-performance",
    "source": "<iframe id=\"ring-0-performance\" src=\"/tests/_resources/framerate-sprite.html?10\"></iframe>\n"
  },
  {
    "name": "ring-1-performance",
    "source": "<iframe id=\"ring-1-performance\" src=\"/tests/_resources/framerate-sprite.html?50\"></iframe>\n"
  },
  {
    "name": "ring-2-performance",
    "source": "<iframe id=\"ring-2-performance\" src=\"/tests/_resources/framerate-sprite.html?100\"></iframe>\n"
  },
  {
    "name": "selector",
    "source": "\n<!-- <div id=\"selector\">\n  <div id=\"getelementsbyclassname\">\n    <div id=\"context\" class=\"foo\"><span class=\"foo\">hi</span></div>\n  </div>\n</div> -->"
  },
  {
    "name": "sharedworkers",
    "source": "<iframe id=\"sharedworkers\" src=\"/tests/sharedworkers/iframe.html\"></iframe>"
  },
  {
    "name": "track",
    "source": "\n<!-- <iframe id=\"track\" src=\"/tests/track/iframe.html\"></iframe> -->"
  },
  {
    "name": "viewport",
    "source": "<!-- <iframe id=\"viewport\" src=\"/tests/viewport/iframe.html\"></iframe> -->"
  },
  {
    "name": "visibilitystate",
    "source": "<!--\nPlaceholder for functional visibility state tests\n<iframe id=\"visibilitystate\" src=\"/tests/visibilitystate/iframe.html\"></iframe>\n\nFrom Mozilla:\n\nVisibility states of an iframe is as same as the parent document. Hiding the iframe with CSS properties does not trigger visibility events nor change the state of the content document.\n\nhttps://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API\n-->\n"
  },
  {
    "name": "webrtc",
    "source": "<!--\n  How to get around the prompt issue?\n  <iframe id=\"webrtc\" src=\"/tests/webrtc/iframe.html\"></iframe>\n-->\n"
  }
]);