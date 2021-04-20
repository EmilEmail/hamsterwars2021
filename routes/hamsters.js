const express = require('express');
const router = express.Router()

const dbFunction = require('../database.js');
const db = dbFunction();

router.get('/', async (req, res) => {
	const colRef = await db.collection('hamsters').get();
	let allHamsters = [];
	colRef.forEach(docRef => {
		let hamster = docRef.data();
		allHamsters.push(hamster);
	});
	res.send(allHamsters);
});

router.get('/random', async (req, res) => {

	const colRef = await db.collection('hamsters').get();
	let allHamsters = [];
	colRef.forEach(docRef => {
		let hamster = docRef.data();
		allHamsters.push(hamster);
	});
	let index = parseInt(allHamsters.length);
	let randomIndex = Math.floor(Math.random() * (index - 1));
	res.send(allHamsters[randomIndex]);
})

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.sendStatus(400);
	}
	const response = await db.collection('hamsters').doc(id).get();
	data = response.data();
	res.send(data)
});


router.post('/', async (req, res) => {
	const data = req.body;

	//Fixa så att datan blir rätt...
	if( !data ) {
		res.sendStatus(400);
		return
	}
	let response = await db.collection('hamsters').add(data);
	res.status(200).send(response.id);
});

router.put('/:id', async (req, res) => {
	let id = req.params.id;
	let data = req.body;

	//testat !data i if satsen men den fungerar ej..
	if (!id) {
		res.sendStatus(404);
		return
	}
	await db.collection('hamsters').doc(id).set(data, {merge: true})
	res.sendStatus(200);
	
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id; 
	if(!id) {
		res.send(404);
	}
	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200);
});

module.exports = router;