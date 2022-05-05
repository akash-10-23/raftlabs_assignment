const mongoose = require('mongoose');

const author = new mongoose.Schema({
	email: {type: String, required: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true}
})

module.exports = mongoose.model("Author", author)


