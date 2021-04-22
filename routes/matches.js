const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/', async (req, res) => {
	let data = await getAllMatches();
	res.send(data);
});


async function getAllMatches() {
	try {
		const snapshot = await db.collection('matches').get();
		let allMatches = [];
		snapshot.forEach(docRef => {
			let match = docRef.data();
			match.firestoreId = docRef.id;
			allMatches.push(match);
		});
		return allMatches;
	} catch (error) {
		console.log(error);
	}
}

module.exports = router;