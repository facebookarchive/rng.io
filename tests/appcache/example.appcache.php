<?php
$code = ($_COOKIE["online"] === "true") ? 410 : 200;
header("Content-type: text/cache-manifest", true, $code);
?>CACHE MANIFEST
# 2012-02-07-v0.0.1

# Explicitly cached entries
CACHE:
/tests/appcache/png.png

# Resources that require the user to be online.
NETWORK:
*
