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



4) (optional) set the passphrase in configuration.js



5) install the database with database.sql



6) set the database username, password... in configuration.js



7) change WD variable in nodejs_url_shortener



8) install the daemon

	sudo cp nodejs_url_shortener /etc/init.d/
	
	sudo chmod 0755 /etc/init.d/nodejs_url_shortener
	
	sudo update-rc.d nodejs_url_shortener defaults


run
=============================

    node ./bin/www
    
or
    
    sudo service nodejs_url_shortener start
