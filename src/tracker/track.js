/* index.js
 *
 * Script that runs on a web page visit, which reports analytics.
 * Sends web page path, query, page referrer, unique viewer id,
 * and hitId. Also sends keep alive message to report time spent on page.
 */

import * as cookies from 'cookies-js'
import * as util from './lib/util'

const trackingUrl = '' // Server address without trailing forward slash
const pageTickRate = 5000 // Report user still on page every X milliseconds

// Cookie name
const cookieName = '_track'

// Measure period
const cookieExpire = () => Math.round(new Date() -
    new Date().setUTCHours(0, 0, 0, 0) // Ends at midnight (UTC)
) / 1000

// Creates measure period cookie, to track unique visits and sessions
const setCookie = (viewerId) => cookies.set(cookieName, viewerId, { 'expires': cookieExpire() })

// Gets measure period cookie or returns :undefined: if none
const getCookie = () => cookies.get(cookieName)

// Blueprint for analytic data to be sent
class PageView {
    constructor(pathName, query, viewerId, referrer) {
        this._pathName = pathName
        this._query = query
        this._viewerId = viewerId
        this._referrer = referrer
        this._hitId = utils.rndId()
    }

    // Get hitId
    hitId() {
        return JSON.stringify({ hitId: this._hitId })
    }

    // Get page view report
    report() {
        return JSON.stringify({
            hitId: this._hitId,
            pathName: this._pathName,
            query: this._query,
            viewerId: this._viewerId,
            referrer: this._referrer
        })
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
    let referrer
    if (util.isInternalReferrer(document.referrer, location.hostname)) {
        referrer = ''
    } else {
        referrer = document.referrer
    }

    return new PageView(pathName, query, viewerId, referrer)
}

// Collect all the data we need
const thisView = createPageView()

// Log the view
const logView = () => {
    const xhttpLog = new XMLHttpRequest()
    xhttpLog.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // View logged successfully
        }
    }
    xhttpLog.open('POST', `${trackingUrl}/track/log`)
    xhttpLog.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttpLog.send(thisView.report())
}
logView()

// Track time on page
const trackPageTime = () => {
    const xhttpTrack = new XMLHttpRequest()
    xhttpTrack.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Time tracked successfully
        }
    }
    xhttpTrack.open('POST', `${trackingUrl}/track/time`)
    xhttpTrack.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttpTrack.send(thisView.hitId())
}
const trackTimer = setInterval(trackPageTime, pageTickRate)
