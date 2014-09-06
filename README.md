a nodejs url shortener
=============================
simple api, made with nodejs, to shorten urls.


features
=============================
- short any urls
- long url id option
- password protection
- cookie protection
- timed url


how the key works
=============================
group|short user id|url id

- group : user id / 1000
- short user id : an unique user id (no digits)
- url id : the key of the shortened link (start with a digit)

example : 0Ca$2C


install
=============================
1) install nodejs packages

	npm update



2) create a certificate

	openssl genrsa -out key.pem 1024

	openssl req -new -key key.pem -out csr.pem

	openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem



3) rename configuration.js.sample to configuration.js   



4) (optional) set the passphare in configuration.js


run
=============================

    node ./bin/www
