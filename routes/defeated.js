const express = require('express');
const router = express.Router();

const functions = require('./globalFunctions.js').functions;

router.get('/', (req, res) => { 
	res.status(400).send('You must enter a valid hamster-ID.');
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const allHamsters = await functions.get('hamsters');
	const allMatches = await functions.get('matches');
	let defeated = [];

	const hamster = allHamsters.find(hamsterId => hamsterId.firestoreId === id);
	if(!hamster) {
		res.status(404).send('This hamster does not exist.');
		return;
	}

	allMatches.forEach(match => {
		if (match.winnerId === id) {
			defeated.push(match.loserId)
		}
	});

	if (defeated.length < 1) {
		res.status(200).send('This hamster have not won any matches.');
		return;
	}
	res.status(200).send(defeated)

});

module.exports = router;