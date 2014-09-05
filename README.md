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