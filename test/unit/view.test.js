const expect = require('expect.js');

describe('models/view', () => {
    beforeAll(() => {
        return require('../../models').sequelize.sync({ force: true }) // Clear database
    })

    beforeEach(() => {
        this.View = require('../../models').View
    })

    describe('create', () => {
        it('creates a view', () => {
            return this.View.create({
                daysSinceEpoch: 1, time: 1, hitId: '123abc', viewerId: '456def',
                pathName: '/', query: '', referrer: '', timeOnPage: 5
            }).bind(this).then((view) => {
                expect(view.hitId).to.equal('123abc')
            })
        })
    })

    describe('read', () => {
        it('reads a view', () => {
            const models = require('../../models')
            return models.View.findOne({ where: { hitId: '123abc' } })
                .then(view => {
                    expect(view).not.to.equal(null)
                })
        })
    })
})
