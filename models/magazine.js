const mongoose = require('mongoose');

const magazine = new mongoose.Schema({
	title: {type: String, required: true},
	isbn: {type: Number, required: true},
	authors: [{
		type: String, required: true
	}],
	publishedAt: {type: String}
})

module.exports = mongoose.model("Magazine", magazine);
