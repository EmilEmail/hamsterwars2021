const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const functions = require('./globalFunctions.js').functions;


router.get('/:id', async (req, res) => {
	const id = req.params.id;
	let matchWinners = [];
	const allMatches = await functions.get('matches');

	allMatches.forEach(match => {
		if(match.winnerId == id) {
			matchWinners.push(match);
		}
	});
	if (matchWinners.length < 1) {
		res.status(404).send('Hamster with that ID have never won a game');
		return;
	}
	res.status(200).send(matchWinners);
});

module.exports = router;