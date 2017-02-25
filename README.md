# Heartbeat

Keep your finger on the pulse of your internal web applications.

There are plenty of affordable public domain services that will keep a watch on your API's and URL's for you, but for those of use behind firewalls and have services closed off from the public domain, we need a solution!

There might be some, however I made this instead.

## Installation
Typicall Node.js Installation
```
$ git clone https://github.com/daimonos/heartbeat.git
$ npm install
```

There is no database for this application currently, however that is likely to change. I've been meaning to learn Redis or LokiJS, this might be a good opportunity?


## Configuration
### URLs:
Keep track of your applications heartbeats by adding them to the json list in `config/heartbeats.json`

```
[
  {
    "name":"Personal Blog",
    "url":"http://blog.jimdhughes.com",
    "notify":["jim.d.hughes@gmail.com"]
  }
]
```

* Name: readable name for your information. Will show up in your web notifications
* URL: the domain name. Public or private.
  * NOTE: All URL's need to be prefixed with `http://`
* Notify: An array of email addresses to send notification to.

### Mailer:
Will default to a direct mailer however you can set up a SMTP mailer if you like.
Update mailer information in `config/mailer.json` as represented by [Nodemailer](http://www.nodemailer.com/about)

eg:
```
{
  "service":"gmail",
  "auth":{
    "user":"jim.d.hughes@gmail.com",
    "pass":"somesupersecretandsecurepasswordthatisnotdictionary"
  }
}
```
Note: Currently untested.

### System
There are minimal system configurations right now.
You can change the 'mail from' if you like.  There is also a port and host name to listen so you can get the status of your listeners.
See `config/system.json`
```
{
  "mail":{
    "from":"mailer@domain.com"
  },
  "server":{
    "host":"localhost",
    "port":"3001"
  }
}
```
## Usage
Just as a PSA - This should be hosted on your internal network in order to monitor internal web applications. If you cant `curl` it from the hosting server, you wont be able to monitor it with this either.

## See your watchers in action
One endpoint exists at whatever you determined your setup to be under `config/server.json`
check `http://localhost:3001` for a JSON list of all your heartbeats, whether they are in error or not, and the last date they were checked.

## Contributing
Have some ideas? Feel free to request some additions or, better yet, add them yourself and share the love!
I've got some ideas to make a usable web interface, adding in some layer of persistance. However this does all that I *really* need it to do for now.

## Known Issues
Sometimes self-signed certs will throw back errors. You can fix this by setting a NODE_ENV variable:
```
NODE_TLS_REJECT_UNAUTHORIZED=0;
```
It's not super safe, but this is intended to run on an internal network so I'd put risk level at yellow max.
## License
MIT
