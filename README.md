## Roll Your Own Analytics

Complete website analytics service with extensive data visualization.

On the server-side it uses Node.js and Sequelize. By default the database is SQLite.

User-tracking via a tiny transpiled script.

```
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
