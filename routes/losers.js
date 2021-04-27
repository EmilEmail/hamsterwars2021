const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const functions = require('./globalFunctions.js').functions;

router.get('/', async (req, res) => {

	const allHamsters = await functions.get('hamsters');
	let sortedList = allHamsters.sort(function (a, b) {
		return a.defeats - b.defeats;
	});
	sortedList.reverse();
	sortedList.splice(5);

	res.send(sortedList);
});

module.exports = router;