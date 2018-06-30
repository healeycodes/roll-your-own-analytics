/* app.js
 *
 * The Express app for roll-your-own-analytics.
 * Tracks unique visitors, page views, average time on site,
 * bounce rate, top pages, top referrers, and variations of these.
 */

const op = require('sequelize').Op;
const models = require('./models')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use('/static', express.static(__dirname + 'public'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors()) // Enable Cross-Origin Resource Sharing (CORS) 
app.options('*', cors())


const pageTickRate = 5 // Recieve time update from tracking script every X seconds


// GET: Tracking script
app.get('/track.js', (req, res) => res.sendFile(__dirname + '/dist/track.js'))


// GET: Home
app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

// Remove
app.get('/add', (req, res) => {
    const addDemoData = require('./demoData')
    addDemoData()
})

// GET: Dashboard
app.get('/dashboard', (req, res) => {
    res.render(__dirname + '/public/dashboard')
})


// GET: JSON: Analytics for a custom period
app.get('/api/period/:period', (req, res) => {
    // '-1' today's stats, '-7' past week, '-30' past month, etc.
    const period = parseInt(req.params.period)

    models.View.findAll({
        where: {
            daysSinceEpoch: {
                [op.lte]: Math.round(Date.now() / 1000 / 60 / 60 / 24),
                [op.gt]: Math.round(Date.now() / 1000 / 60 / 60 / 24) - period
            }
        },
        attributes: ['daysSinceEpoch', 'hitId', 'viewerId',
            'pathName', 'query', 'referrer', 'timeOnPage']
    })
        .then(views => {
            res.send(JSON.stringify(views))
        })
})


// POST: Logs a web page visit
app.post('/track/log', (req, res) => {
    const json = req.body
    // Check that our hitId is unique
    models.View.findOne({ where: { hitId: json.hitId } })
        .then(view => {
            // If it is unique, create the View
            if (view === null) {
                // Add View
                models.View.create({
                    daysSinceEpoch: Math.round(Date.now() / 1000 / 60 / 60 / 24),
                    time: Date.now(),
                    hitId: json.hitId,
                    viewerId: json.viewerId,
                    pathName: json.pathName,
                    query: json.query,
                    referrer: json.referrer,
                    timeOnPage: 0
                })
                // Everything was OK
                res.status(200)
                return res.send()
            } else {
                // hitId wasn't unique
                res.status(500)
                return res.send()
            }
        })
})


// POST: Adds 'time on page' to a web page visit
app.post('/track/time', (req, res) => {
    const json = req.body
    // Find a View via hitId so we can add time
    models.View.findOne({ where: { hitId: json.hitId } })
        .then(view => {
            // If we found the correct View
            if (view !== null) {
                // Update 'time on page' metric
                view.timeOnPage = view.timeOnPage + pageTickRate
                view.save()
                // Everything was OK
                res.status(200)
                return res.send()
            }
            else {
                // No View found
                res.status(500)
                return res.send()
            }
        })
})

module.exports = app
