const models = require('./models')
const app = require('./app.js')

models.sequelize
    .sync({ force: true })
    .then(
        app.listen(process.env.PORT || 3000, () =>
            console.log(`Listening on port ${process.env.PORT || 3000}!`))
    )
