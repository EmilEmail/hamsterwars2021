const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	let matchWinners = [];
	const snapshot = await db.collection('matches').get();
	snapshot.forEach(docRef => {
		const match = docRef.data();
		if(match.winnerId == id) {
			matchWinners.push(match);
		}
	});
	if (matchWinners.length < 1) {
		res.status(404).send('Hamster with that ID have never won a game');
	}
	res.status(200).send(matchWinners);
});

module.exports = router;