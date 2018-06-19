
module.exports = (sequelize, DataTypes) => {
    const View = sequelize.define('View', {
        daysSinceEpoch: DataTypes.INTEGER,
        time: DataTypes.STRING,
        hitId: DataTypes.STRING,
        viewerId: DataTypes.STRING,
        pathName: DataTypes.STRING,
        query: DataTypes.STRING,
        referrer: DataTypes.STRING,
        timeOnPage: DataTypes.INTEGER
    }, {})
    View.associate = (models) => {
        // associations can be defined here
    }
    return View;
}
