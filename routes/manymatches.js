const express = require('express');
const router = express.Router();

const functions = require('./globalFunctions.js').functions;

router.get('/', async (req, res) => { 
	const allHamsters = await functions.get('hamsters');
	let sortedList = allHamsters.sort(function (a, b) {
		return a.games - b.games;
	});
	sortedList.reverse()
	sortedList.splice(5)
	res.status(200).send(sortedList);
});

module.exports = router;