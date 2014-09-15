Setup
-----

Make sure CouchDB is running on localhost: http://127.0.0.1:5984/

Create new database: ```smash_n_grab```

Create new document:

```
Key: "_design/smash_n_grab"
Value: {
   "views": {
       "all": {
           "map": "function(doc) {emit(null, doc)}",
           "reduce": "_count"
       }
   }
}
```