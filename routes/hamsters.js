const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const functions = require('./globalFunctions.js').functions;

const THIS_COLLECTION = 'hamsters';


						//////GET//////

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

						//////POST//////

router.post('/', async (req, res) => {
	const data = req.body;
	const defaultKeys = ['age','defeats','favFood','games','imgName','loves','name','wins']
	
	const correctData = functions.newItemCheck(data, defaultKeys);
	const correctDataType = hamsterKeyType(data);
	
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

						//////PUT//////

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

						//////DELETE//////

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

					////Check KeyTypes////
function hamsterKeyType(data) {
	const stringkeyType = [
		typeof data.name,
		typeof data.loves,
		typeof data.favFood,
		typeof data.imgName,
	]
	numberKeyType = [
		data.age,
		data.games,
		data.wins,
		data.defeats
	]

	for (let i = 0; i < stringkeyType.length; i++) {
		if (stringkeyType[i] != 'string') {
			return false;
		}
	}
	for (let i = 0; i < stringkeyType.length; i++) {
		if (!Number.isInteger(numberKeyType[i])) {
			return false;
		}
	}
	return true;
}


//Få upp allt JSON-filen i databasen.
router.post('/postallhamsters', async(req, res) => {
	const allHamsters = req.body;
	await allHamsters.forEach(hamster => {
		db.collection('hamsters').add(hamster);
	});
	res.status(200).send('You have got all hamsters in database!')
});

module.exports = router;