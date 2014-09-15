SMASH-N-GRAB
==========

Reddit Super Smash 3DS Code Scraper/Emailer

Version
-------

0.0.1

Do not use in production, more of a hackathon-like application.
--------------------------------------------------------

Requirements
------------

[NodeJS](http://nodejs.org/)
[CouchDB](http://couchdb.apache.org/)

Usage
-----

```bash
# Set environment variables
export FROM_EMAIL="FIRST_NAME LAST_NAME <EMAIL@gmail.com>"
export TO_EMAIL="EMAIL@gmail.com"
export EMAIL_USER="FROM_EMAIL@gmail.com"
export EMAIL_PASS="APP_SPECIFIC_PASSWORD"

# Install
cd /path/to/repo && npm install

# Run
node index.js
```

License
------

[MIT](http://brutalhonesty.mit-license.org/)