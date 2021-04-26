const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const functions = require('./globalFunctions.js').functions;

const THIS_COLLECTION = 'hamsters';


//Få upp allt JSON-filen i databasen.
router.post('/postallhamsters', async(req, res) => {
	const allHamsters = req.body;
	await allHamsters.forEach(hamster => {
		db.collection('hamsters').add(hamster);
	});
	res.status(200).send('You have got all hamsters in database!')
});
//////////////

router.get('/', async (req, res) => {
		const allHamsters = await functions.get(THIS_COLLECTION);
		if(!allHamsters) {
			res.sendStatus(500);
			return;
		}
		res.send(allHamsters);
});

router.get('/random', async (req, res) => {
	const allHamsters = await functions.get(THIS_COLLECTION);
	if (!allHamsters) {
		res.sendStatus(500);
		return;
	}
	let index = Math.floor(Math.random() * (allHamsters.length - 1));
	res.send(allHamsters[index]);
})


router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const exists = await functions.checkId(id, THIS_COLLECTION);
	if (!exists) {
		res.status(404).send('There is no hamster with that ID.');
		return;
	}
	if (exists === 500) {
		res.sendStatus(500);
		return;
	}
	res.status(200).send(exists);
});

/////klar hit

router.post('/', async (req, res) => {
	const data = req.body;
	
	//designbeslut, har man skrivit något fel så går det ej att genomföra operationen.
	const correctData = functions.newHamsterCheck(data);
	const correctDataType = functions.hamsterKeyType(data);
	
	if (functions.isEmpty(data)) {
		res.status(400).send('You must send with any data.');
		return;
	}
	if (!correctData) {
		res.status(400).send('One or more of the objects keys are miss-spelled or missing.');
		return;
	}
	if(!correctDataType) {
		res.status(400).send('You must have the right data type.');
		return;
	}
	try {
		let docRef = await db.collection('hamsters').add(data);
		res.status(200).send({ id: docRef.id} );
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

router.put('/', (req, res) => {
	res.status(404).send('You must enter a valid ID to an hamster.');
});

router.put('/:id', async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const exists = await functions.checkId(id, THIS_COLLECTION);
	if (functions.isEmpty(data)) {
		res.sendStatus(400);
		return
	}
	if (!exists) {
		res.status(404).send('There is no hamster with that ID.')
		return;
	}

	const checkObjectKeys = await functions.checkData(data, id, THIS_COLLECTION);
	if (!checkObjectKeys) {
		res.status(400).send('You must enter a hamster with correct keys.')
		return;
	}
	try {
		await db.collection('hamsters').doc(id).set(data, {merge: true});
		res.status(200).send('You have updated a hamsterObject.');

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
	
});

router.delete('/', (req, res) => {
	res.sendStatus(400).send('You must enter a valid ID.')
});


router.delete('/:id', async (req, res) => {
	const id = req.params.id; 
	const exists = await functions.checkId(id, THIS_COLLECTION);
	if (!exists) {
		res.status(404).send('Hamster ID does not exists!');
		return;
	}
	try {
		await db.collection('hamsters').doc(id).delete()
		res.status(200).send('You have now deleted one Hamster!');
		return;
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

module.exports = router;