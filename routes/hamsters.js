const express = require('express');
const router = express.Router()

const dbFunction = require('../database.js');
const db = dbFunction();

let allHamsters = [];
router.get('/', async (req, res) => {
	const colRef = await db.collection('hamsters').get();
	colRef.forEach(docRef => {
		let hamster = docRef.data();
		allHamsters.push(hamster);
	});
	res.send(allHamsters);
});

module.exports = router;