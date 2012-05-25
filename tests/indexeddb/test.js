test("IndexedDB, basic support", function() {
  assert( H.API( window, "indexedDB", true ), "indexedDB supported" );
  assert( H.API( window, "IDBTransaction", true ), "IDBTransaction supported");
  assert( H.API( window, "IDBRequest", true ), "IDBRequest supported");
});
