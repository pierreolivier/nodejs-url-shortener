todo list
=============================
- ip filtering

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
        "urls": "0Ca$2C,0Ca32C"
    }

results:

    {
        "urls": [
            {
                "longUrl": "http://google.com",
                "shortUrl": "https://domain/0Ca$2C"
            }
        ],
        "status": "ok"
    }
or

    {        
        "status": "error"
        "error": {
            "code": 2,
            "reason": "user_not_found",
            "message": "User not found"
        }
    }



## log the current browser for the cookie protection

/register

    {
        "password": "custom_password"
    }



## list urls

/list

    {
        "key": "api_key"
    }
 
    
    
## get urls

/get

    {
        "key": "api_key",
        "urls": "key1,key2"
    }
    


## delete url(s)

/delete

    {
        "key": "api_key",
        "urls": "0Ca$2C,0CaSD2C"
    }    
or, to delete all links
    
    {
        "key": "api_key",
        "urls": "-1"
    }



## test api key

/login

    {
        "key": "api_key"
    }

admin api
=============================

## test admin password

/server/login

    {
        "password": "admin_password"
    }



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
    
    