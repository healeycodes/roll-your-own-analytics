import * as cookies from 'cookies-js'
import * as util from './lib/util'

// Where we send our session data to
const trackingUrl = ''

// Measure period (current: ends at midnight UTC)
// Defines cut-off point for sessions
const cookieExpire = () => new Date().setUTCHours(0, 0, 0, 0)

// Cookie storage name
const cookieName = '_tracker3000'

const setSessionCookie = () => cookies.set(cookieName, cookieExpire)

const getSessionCookie = () => cookies.get(cookieName)

// Blueprint for analytic data to be sent
class PageView {
    constructor(pathName, pathQuery, sessionId, timeSpent, referer) {
        this._pathName = pathName
        this._pathQuery = pathQuery
        this._sessionId = sessionId
        this._timeSpent = timeSpent
        this._referer = referer
    }
}


