const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/', async (req, res) => {
	let allHamsters  = [];
	try {
		const snapshot = await db.collection('hamsters').get();
		snapshot.forEach(docRef => {
			hamster = docRef.data();
			allHamsters.push(hamster);
		});
		
	} catch (error) {
		console.log(error)
		res.status(500);
		return
	}

	let sortedList = allHamsters.sort(function (a, b) {
		return a.wins - b.wins;
	});

	sortedList.reverse();
	sortedList.splice(5);

	let fiveTop = [];

	res.send(sortedList);
});

module.exports = router;