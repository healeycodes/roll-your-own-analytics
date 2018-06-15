// Used to create random session ids
const rndId = (len=64) => {
    let id = ''
    let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < len; i++) {
        id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    }
    return id
}

// Check for internal referer
const isInternalReferer = (referer, hostname) => {
    let ref
    // Ensure that the check works for both HTTP and HTTPS internal referals
    ref = referer.replace('http://', '')
    ref = ref.replace('https://', '')

    return ref.indexOf(hostname) > 0
}

export {rndId, isInternalReferer}
