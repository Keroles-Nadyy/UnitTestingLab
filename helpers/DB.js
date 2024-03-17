const mongoose = require('mongoose');

module.exports = async() => {
    await mongoose.connect( process.env.MONGOURI || 'mongodb://localhost:27017/cloudUnitTest', {useNewUrlParser: true})
    .then(() => console.log("Database connected successfully."))
    .catch(err=> console.error(err) )
}