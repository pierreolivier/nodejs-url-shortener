todo list
=============================
- /expand
- /urls
- /delete
- /url/delete

database
=============================

users : id_user|key|short_key

urls : id_url|key|id_user|protection|protection_argument|created|timeout|clicks



public api
=============================
## shorten an url

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



## expand a short url

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



## log the current browser for the cookie protection

/login

    {
        "password": "custom_password"
    }



## list urls

/urls

    {
        "key": "api_key"
    }
    
    

## delete url(s)
/delete

    {
        "key": "api_key",
        "urls": "0Ca$2C, 0CaSD2C"
    }    
or, to delete all links
    
    {
        "key": "api_key",
        "urls": "-1"
    }



admin api
=============================

## register a new user (admin)

/user/new

    {
        "password": "admin_password"
    }



## get all users (admin)

/user/list

    {
        "password": "admin_password"
    }



## get user infos (admin)

/user/get

    {
        "password": "admin_password"
        "key": "user_key"
    }



## delete an user (admin)

/user/delete

    {
        "password": "admin_password"
        "key": "user_key"
    }



## delete url(s) (admin)

/url/delete

    {
        "password": "admin_password"
        "keys": "key1,key2,key3"
    }  
    
    