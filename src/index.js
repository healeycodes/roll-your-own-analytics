import * as cookies from 'cookies-js'
import * as util from './lib/util'


// Where we send our session data to
const trackingUrl = ''

// Cookie name
const cookieName = '_tracker3000'

// Measure period
const cookieExpire = () => Math.round(new Date() -
new Date().setUTCHours(0, 0, 0, 0) // Ends at midnight (UTC)
) / 1000

const setCookie = (viewerId) => cookies.set(cookieName, viewerId, {'expires': cookieExpire()})

const getCookie = () => cookies.get(cookieName)

// Blueprint for analytic data to be sent
class PageView {
    constructor(pathName, query, viewerId, referer) {
        this._pathName = pathName
        this._query = query
        this._viewerId = viewerId
        this._referer = referer
    }
}

// Create analytic data
const createPageView = () => {
    let pathName = location.pathname
    let query = location.search

    // Grab or create viewerId
    let viewerId
    if (getCookie() === undefined) {
        let newRndId = util.rndId()
        setCookie(newRndId)
        viewerId = newRndId
    } else {
        viewerId = getCookie()
    }

    // Grab referal only if it's external
    let referer
    if (util.isInternalReferer(document.referrer, location.hostname)) {
        referer = ''
    } else {
        referer = document.referrer
    }

    return new PageView(pathName, query, viewerId, referer)
}

// Grab this view data
const thisView = createPageView()

// console.log(thisView)

// Loop

