/* dashboard.js
 *
 * All the front-end logic behind the Dashboard.
 * Grabs raw view data via API, analyses it, and presents it.
*/


let dailyAnalytics = {}
let weeklyAnalytics = {}
let monthlyAnalytics = {}

// Daily analytics
const dailyReq = new XMLHttpRequest()
dailyReq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        dailyAnalytics = analyseData(dailyReq.response)
    }
}
dailyReq.responseType = 'json'
dailyReq.open('GET', 'api/period/1', true);
dailyReq.send()
// Weekly analytics
const weeklyReq = new XMLHttpRequest()
weeklyReq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        weeklyAnalytics = analyseData(weeklyReq.response)
    }
}
weeklyReq.responseType = 'json'
weeklyReq.open('GET', 'api/period/7', true);
weeklyReq.send()
// Monthly analytics
const monthlyReq = new XMLHttpRequest()
monthlyReq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        monthlyAnalytics = analyseData(monthlyReq.response)
        charts()
    }
}
monthlyReq.responseType = 'json'
monthlyReq.open('GET', 'api/period/30', true);
monthlyReq.send()


const analyseData = views => {

    let pages = {} // {'pathName':{'viewerId': 1}} each pathName's visit count per unique
    let referrers = {} // 'referrer':{'viewerId': 1}} each referrer's referral count per unique
    let timeSpent = {} // {'viewerId': 0}} all time spent on site, for 'avg time on site'
    let bounced = {} // {'viewerId': true} Only one view means they bounced
    let totalPageViews = 0 // Simple incrementing for hit count

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
        if (!(view.viewerId in timeSpent)) {
            timeSpent[view.viewerId] = view.timeSpent
        } else {
            timeSpent[view.viewerId] += view.timeSpent
        }
        // Bounce rate
        if (!(view.viewerId in bounced)) {
            bounced[view.viewerId] = true
        } else {
            bounced[view.viewerId] = false
        }
        // Total page views
        totalPageViews += 1
    })

    data = {}
    data.pages = pages
    data.referrers = referrers
    data.timeSpent = timeSpent
    data.bounced = bounced
    data.totalPageViews = totalPageViews
    return data
}

// https://stackoverflow.com/a/5365036
const rndColor = () => { '#' + ((1 << 24) * Math.random() | 0).toString(16) }


const charts = () => {
    var ctx = document.getElementById('chartPages').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Object.keys(monthlyAnalytics.pages),
            datasets: [
                {
                    label: 'Views',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: Object.keys(monthlyAnalytics.pages).map(key => Object.values(monthlyAnalytics.pages[key]).reduce((sum, x) => sum + x))
                }, {
                    label: 'Uniques',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    data: Object.keys(monthlyAnalytics.pages).map(key => Object.keys(monthlyAnalytics.pages[key]).length)
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
    });
}

