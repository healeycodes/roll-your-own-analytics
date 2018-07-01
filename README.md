## Roll Your Own Analytics ~ https://healeycodes.github.io/dashboard.html

This is a complete website analytics service with extensive data visualization. On the server-side it uses Node.js and Sequelize. By default the database is SQLite.

Users are tracked via a tiny transpiled script. Simply add the follow code block on all the pages you want to track.

```javascript
<script id='ryoa'>
    window.rollyourownanalytics = {};
    window.rollyourownanalytics.url = 'http://localhost:3000'; // Change this line
    var trackjs = document.createElement('script');
    trackjs.src = window.rollyourownanalytics.url + '/track.js';
    trackjs.async = true;
    document.getElementById('ryoa').parentNode.insertBefore(
        trackjs, document.getElementById('ryoa').nextSibling);
</script>
```

### Build

`npm install`


`npx webpack`

### Test

Tested with Jest and SuperTest.

`npm test`

### Run

`node .\server.js`
