const express = require('express');
const router = express.Router();

const functions = require('./globalFunctions.js').functions;



router.get('/', (req, res) => { 
	res.status(400).send('You must enter valid hamster-IDs.');
});
router.get('/:id', (req, res) => { 
	res.status(400).send('You must enter TWO valid hamster-IDs.');
});

router.get('/:challenger/:defender', async (req, res) => { 
	const challengerId = req.params.challenger;
	const defenderId = req.params.defender;
	const allHamsters = await functions.get('hamsters');
	const allMatches = await functions.get('matches');
	let challengerWins = 0;
	let defenderWins = 0;
	let matchMatches = [];

	let challengar = allHamsters.find(hamster => challengerId === hamster.firestoreId);
	if (!challengar) {
		res.status(404).send('This challenger does not exist.')
		return;
	}
	let defender = allHamsters.find(hamster => defenderId === hamster.firestoreId);
	if (!defender) {
		res.status(404).send('This defender does not exist.')
		return;
	}

	allMatches.forEach(match => {
		if (match.winnerId === challengerId || match.loserId === challengerId) {
			if(defenderId === match.loserId || defenderId === match.winnerId) {
				matchMatches.push(match);
			}
		}
	});

	//Kanske ta bort inför frontend???
	if(matchMatches < 1) {
		res.status(200).send('No games between these two before..')
		return;
	}
	//

	matchMatches.forEach(match => {
		if (match.winnerId === challengerId) {
			challengerWins++
		} else {
			defenderWins++;
		}
	});

	res.status(200).send({challengerWins, defenderWins});

});

module.exports = router;