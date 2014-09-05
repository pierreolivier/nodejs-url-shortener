database
=============================

users : id_user|key|short_key
urls : id_url|key|id_user|protection|protection_argument|created|timeout|clicks


api
=============================
shorten an url
/shorten
{
    "key": "api_key",
    "url": "http://google.com"
}

optional:
- long key :
"long_key": "1"

- password protection :
"protection": "password",
"password": "custom_password"

- cookie protection (see /login):
"protection": "cookie",
"password": "custom_password"

results:
{
    "shortUrl": "https://domain/0Ca$2C",
    "longUrl": "http://google.com",
    "status": "ok"
}
or
{
    "shortUrl": "",
    "longUrl": "http://longurl"
    "status": "error"
    "error": {
        "code": 2,
        "reason": "user_not_found",
        "message": "User not found"
    }
}

expand a short url
/expand
{
    "key": "api_key",
    "url": "http://domain/0Ca$2C"
}

results:
{
    "longUrl": "http://google.com",
    "shortUrl": "https://domain/0Ca$2C",
    "status": "ok"
}
or
{
    "shortUrl": "",
    "longUrl": "http://longurl"
    "status": "error"
    "error": {
        "code": 2,
        "reason": "user_not_found",
        "message": "User not found"
    }
}

log the current browser for the cookie protection
/login
{
    "password": "custom_password"
}