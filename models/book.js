const mongoose = require('mongoose');

const book = new mongoose.Schema({
	title: {type: String, required: true},
	authors: [{
		type: String, required: true
	}],
	isbn: {type: Number, required: true},
	description: {type: String}
})

module.exports = mongoose.model("Book", book);

