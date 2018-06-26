const models = require('./models')

// Create randomIDs
const rndId = (len = 64) => {
    let id = ''
    let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < len; i++) {
        id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    }
    return id
}

// Random number between min(exclusive) and max(exclusive)
const rndNumberBetween = (min, max) => Math.floor(Math.random() * max) + min

// Random paths
const possiblePaths = ['/blog', '/blog', '/blog', '/newsfeed', '/newsfeed',
    '/', '/', '/newsfeed', '/search', '/profile', '/company-news', '/about-us']
const rndPath = () => possiblePaths[Math.floor(Math.random() * possiblePaths.length)];

// Random referrers
const possibleReferrers = ['google.com', 'google.com', 'google.com', 'google.com',
    'facebook.com', 'facebook.com', 'yahoo.com', 'youtube.com', 'tumblr.com']
const rndReferrer = () => possibleReferrers[Math.floor(Math.random() * possibleReferrers.length)];

// Add demo data
const addDemoData = () => {
    // Number of unique visitors
    const dailyUniques = rndNumberBetween(20, 200)
    // How many times they come back
    const dailyVisits = rndNumberBetween(15, 25)

    // Unique visitor loop
    for (let i = 0; i < dailyUniques; i++) {
        const viewerId = rndId()
        const referrer = rndReferrer()

        // Individual visit loop
        for (let j = 0; j < dailyVisits; j++) {
            models.View.create({
                daysSinceEpoch: Math.round(Date.now() / 1000 / 60 / 60 / 24),
                time: Date.now(),
                hitId: rndId(),
                viewerId: viewerId,
                pathName: rndPath(),
                query: '',
                referrer: referrer,
                timeOnPage: 5 * rndNumberBetween(0, 20) // Simulate differen't visit lengths
            })
            // Around 75% of these uniques will 'bounce' and not visit another page
            if (j == 0 && rndNumberBetween(0, 4) != 3) {
                break // So leave this loop
            }
        }
    }
}

module.exports = addDemoData
