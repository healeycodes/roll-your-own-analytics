### Roll Your Own Analytics ~ https://healeycodes.github.io/dashboard.html

This is a complete website analytics service (front end/back end/tracking script) with data visualization. On the server-side it uses Node.js and Sequelize. By default the database is SQLite.

Keep track of unique visitors, page views, referrals, time spent per page, bounce rate and more!

![alt text](https://raw.githubusercontent.com/healeycodes/roll-your-own-analytics/master/public/img/demo.png "Dashboard image one")

Users are tracked via a minified and Babel-transpiled script. Simply add the follow code block on all the pages you want to track.

```javascript
<script id='ryoa'>
    window.rollyourownanalytics = {};
    // Wherever you host the Node.js analytics server
    window.rollyourownanalytics.url = 'http://localhost:3000';
    var trackjs = document.createElement('script');
    trackjs.src = window.rollyourownanalytics.url + '/track.js';
    trackjs.async = true;
    document.getElementById('ryoa').parentNode.insertBefore(
        trackjs, document.getElementById('ryoa').nextSibling);
</script>
```

This downloads `track.js` asynchronously, and reports visitor data back to the analytics server.

<br>

### Build

`npm install`


`npx webpack`

<br>


### Test

Tested with Jest and SuperTest.

`npm test`

<br>

### Run

`node .\server.js`

<br>

Now you can recieve data from the tracking script, which reports to `/track/log` and `/track/time`.

The dashboard is avaliable at `/` or `/dashboard` which you'll presumably want to proxy behind something or add your own authentication method.

<br>


### Data/Privacy

I make no claims about this being GDPR compliant however user data is fairly anonymous and cookies expire at midnight of every day. A 'piece' of data looks like the following:

```json
{"daysSinceEpoch":17698,"hitId":"HThGuycEKUW04MfY46erP6BGEy1A9vNmQU2kNJDf0NONLKNgQ5aGSQQns70O7qzF",
"viewerId":"06R3vb9mK1EHFUX3zjxGuhVUE8vYXJuywjZHaUAKUwec4IwKrktCuYvQ0A41Ml6V",
"pathName":"/about-us","query":"","referrer":"google.com","timeOnPage":20}
```

<br>

### HTTP vs HTTPS

You can require 'https' in `server.js` and add in your keys if needed.

See: https://expressjs.com/en/api.html#app.listen for more information.

<br>

### More Screenshots

<br>

![alt text](https://raw.githubusercontent.com/healeycodes/roll-your-own-analytics/master/public/img/demo-two.png "Dashboard image two")

### License

https://mit-license.org/
