// Used to create random session ids
const rndId = (len=64) => {
    let id = ''
    let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < len; i++) {
        id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    }
    return id
}
