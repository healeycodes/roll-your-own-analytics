/* dashboard.js
 *
 * All the front-end logic behind the Dashboard.
 * Grabs raw view data via API, analyses it, and presents it with Chart.js
*/

let dailyAnalytics = {}
let weeklyAnalytics = {}
let monthlyAnalytics = {}

// Keep track of charts to destroy old ones

let charts = []
const clearCharts = () => charts.forEach(chart => chart.destroy())

// Button outlines

const defaultBorder = '2px solid rgba(54, 162, 235, 1)'
const clickedBorder = '4px solid rgba(54, 162, 235, 1)'

const swapFocusedTo = (buttonId) => {
    document.getElementById('buttonDaily').style.border = defaultBorder
    document.getElementById('buttonWeekly').style.border = defaultBorder
    document.getElementById('buttonMonthly').style.border = defaultBorder
    document.getElementById(buttonId).style.border = clickedBorder
}

// Daily analytics button

const dailyButton = () => {
    swapFocusedTo('buttonDaily')

    const dailyReq = new XMLHttpRequest()
    dailyReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dailyAnalytics = analyseData(dailyReq.response)
            clearCharts()
            chartPages('chartPages', dailyAnalytics)
            chartReferral('chartReferrals', dailyAnalytics)
            chartPerDay('chartPerDay', dailyAnalytics)
            textStats(dailyAnalytics)
        }
    }
    dailyReq.responseType = 'json'
    document.location.pathname == '/dashboard.html' ?
        dailyReq.open('GET', 'demoDaily.json', true) : dailyReq.open('GET', 'api/period/1', true)
    dailyReq.send()
}

// Weekly analytics button

const weeklyButton = () => {
    swapFocusedTo('buttonWeekly')

    const weeklyReq = new XMLHttpRequest()
    weeklyReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            weeklyAnalytics = analyseData(weeklyReq.response)
            clearCharts()
            chartPages('chartPages', weeklyAnalytics)
            chartReferral('chartReferrals', weeklyAnalytics)
            chartPerDay('chartPerDay', weeklyAnalytics)
            textStats(weeklyAnalytics)
        }
    }
    weeklyReq.responseType = 'json'
    document.location.pathname == '/dashboard.html' ?
        weeklyReq.open('GET', 'demoWeekly.json', true) : weeklyReq.open('GET', 'api/period/7', true)
    weeklyReq.send()
}

// Monthly analytics button

const monthlyButton = () => {
    swapFocusedTo('buttonMonthly')

    const monthlyReq = new XMLHttpRequest()
    monthlyReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            monthlyAnalytics = analyseData(monthlyReq.response)
            clearCharts()
            chartPages('chartPages', monthlyAnalytics)
            chartReferral('chartReferrals', monthlyAnalytics)
            chartPerDay('chartPerDay', monthlyAnalytics)
            textStats(monthlyAnalytics)
        }
    }
    monthlyReq.responseType = 'json'
    document.location.pathname == '/dashboard.html' ?
        monthlyReq.open('GET', 'demoMonthly.json', true) : monthlyReq.open('GET', 'api/period/30', true)
    monthlyReq.send()
}

// Show demo header if demo
if (document.location.pathname == '/dashboard.html') {
    const demoDiv = document.createElement('div')
    const demoHTML = '<h3 style="text-align: center">This is the demo dashboard of <a href="https://github.com/healeycodes/roll-your-own-analytics">Roll Your Own Analytics</a>.</h3>'
    demoDiv.innerHTML = demoHTML
    document.body.insertBefore(demoDiv, document.getElementById('top'))
}

// Take in raw JSON view data and process it, return as an easier to handle data object

const analyseData = views => {

    let pages = {} // {'pathName':{'viewerId': 1}} each pathName's visit count per unique
    let referrers = {} // 'referrer':{'viewerId': 1}} each referrer's referral count per unique
    let timeOnPage = {} // {'viewerId': 0} all time spent on site, for 'avg time on site'
    let bounced = {} // {'viewerId': true} Only one view means they bounced
    let totalPageViews = 0 // Simple incrementing for hit count
    let perDay = {} // {'daysSinceEpoch': {'viewerIds': new Set(), 'hitIds': new Set()} To track daily trends

    views.forEach(view => {
        // Page stats
        if (!(view.pathName in pages)) {
            pages[view.pathName] = {}
            pages[view.pathName][view.viewerId] = 1
        } else if (!(view.viewerId in pages[view.pathName])) {
            pages[view.pathName][view.viewerId] = 1
        } else {
            pages[view.pathName][view.viewerId] += 1
        }
        // Referrer stats
        if (!(view.referrer in referrers)) {
            referrers[view.referrer] = {}
            referrers[view.referrer][view.viewerId] = 1
        } else if (!(view.viewerId in referrers[view.referrer])) {
            referrers[view.referrer][view.viewerId] = 1
        } else {
            referrers[view.referrer][view.viewerId] += 1
        }
        // Time spent stats
        if (!(view.viewerId in timeOnPage)) {
            timeOnPage[view.viewerId] = parseInt(view.timeOnPage)
        } else {
            timeOnPage[view.viewerId] += view.timeOnPage
        }
        // Bounce rate
        if (!(view.viewerId in bounced)) {
            bounced[view.viewerId] = true
        } else {
            bounced[view.viewerId] = false
        }
        // Total page views
        totalPageViews += 1
        // Per day stats
        if (!(view.daysSinceEpoch in perDay)) {
            perDay[view.daysSinceEpoch] = {}
            perDay[view.daysSinceEpoch].viewerIds = new Set()
            perDay[view.daysSinceEpoch].hitIds = new Set()
            perDay[view.daysSinceEpoch].viewerIds.add(view.viewerId)
            perDay[view.daysSinceEpoch].hitIds.add(view.hitId)
        } else {
            perDay[view.daysSinceEpoch].viewerIds.add(view.viewerId)
            perDay[view.daysSinceEpoch].hitIds.add(view.hitId)
        }
    })

    data = {}
    data.pages = pages
    data.referrers = referrers
    data.timeOnPage = timeOnPage
    data.bounced = bounced
    data.totalPageViews = totalPageViews
    data.perDay = perDay
    return data
}

// https://stackoverflow.com/a/5365036

const rndColor = () => { '#' + ((1 << 24) * Math.random() | 0).toString(16) }

// Build and write to page our text stats

const textStats = (analytics) => {
    const pageViews = document.getElementById('pageViews')
    const uniqueVis = document.getElementById('uniqueVis')
    const averageTime = document.getElementById('averageTime')
    const bounced = document.getElementById('bounced')

    // Views
    days = Object.keys(analytics.perDay)
    views = 0
    uniques = 0
    days.forEach(key => {
        views += analytics.perDay[String(key)].hitIds.size
        uniques += analytics.perDay[String(key)].viewerIds.size
    })
    pageViews.innerText = views
    uniqueVis.innerText = uniques

    // Average time
    averageTime.innerText = Math.floor(Object.values(analytics.timeOnPage).reduce((sum, x) => sum + x) / analytics.totalPageViews)
        + " sec"

    // Bounced
    bounceNum = 0
    didntBounceNum = 0
    Object.values(analytics.bounced).forEach(bounce => bounce ? bounceNum += 1 : didntBounceNum += 1)
    if (Math.floor(bounceNum / (bounceNum + didntBounceNum) * 100) === NaN) {
        bounced.innerText = '0%'
    } else {
        bounced.innerText = String(Math.floor(bounceNum / (bounceNum + didntBounceNum) * 100)) + '%'
    }

}

// Creates Per Day chart

const chartPerDay = (elementId, analytics) => {
    labels = Object.keys(analytics.perDay).sort() // Use sorted order to grab data in that order
    views = []
    uniques = []
    labels.forEach(key => {
        views.push(analytics.perDay[String(key)].viewerIds.size)
        uniques.push(analytics.perDay[String(key)].hitIds.size)
    })
    labels = labels.map(daysSinceEpoch => new Date(8.64e+7 * daysSinceEpoch).getDate()) // Convert to date

    var ctx = document.getElementById(elementId).getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '# of Views',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: views
                }, {
                    label: '# of Uniques',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    data: uniques
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    })
    charts.push(myChart)
}

// Creates Pages chart

const chartPages = (elementId, analytics) => {
    var ctx = document.getElementById(elementId).getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Object.keys(analytics.pages),
            datasets: [
                {
                    label: '# of Views',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: Object.keys(analytics.pages).map(key => Object.values(analytics.pages[key]).reduce((sum, x) => sum + x))
                }, {
                    label: '# of Uniques',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    data: Object.keys(analytics.pages).map(key => Object.keys(analytics.pages[key]).length)
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
    charts.push(myChart)
}

// Creates Referral chart

const chartReferral = (elementId, analytics) => {
    var ctx = document.getElementById(elementId).getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Object.keys(analytics.referrers),
            datasets: [
                {
                    label: '# of Views',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: Object.keys(analytics.referrers).map(key => Object.values(analytics.referrers[key]).reduce((sum, x) => sum + x))
                }, {
                    label: '# of Uniques',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    data: Object.keys(analytics.referrers).map(key => Object.keys(analytics.referrers[key]).length)
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
    charts.push(myChart)
}

// Chart.js Globals

Chart.defaults.scale.gridLines.display = false
Chart.defaults.global.responsive = true
Chart.defaults.global.animationEasing = "easeOutBounce"
Chart.defaults.global.animation.duration = 2000

// Load monthly analytics by default

monthlyButton()
