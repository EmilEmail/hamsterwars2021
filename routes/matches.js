const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const THIS_COLLECTION = 'matches';

const functions = require('./globalFunctions.js').functions;

router.get('/', async (req, res) => {
	const data = await functions.get(THIS_COLLECTION);
	if(functions.isEmpty(data)){
		res.sendStatus(500);
	}
	res.send(data);
});

router.get('/:id', async(req, res) => {
	const id = req.params.id;
	let data = await functions.checkId(id, THIS_COLLECTION);
	if (functions.isEmpty(data)) {
		res.status(404).send('This match ID does not exists.');
		return;
	}
	res.send(data);
});

router.post('/', async (req, res) => {
	const data = req.body;
	const matchKeys = ['winnerId','loserId']
	const correctData = functions.newItemCheck(data, matchKeys);
	const correctDataType = checkDataKeyType(data)
	if (functions.isEmpty(data)) {
		res.status(400).send('You must send with any data.');
		return;
	}
	if (!correctData) {
		res.status(400).send('You must add right keys to your object.');
		return;
	}
	if(!correctDataType) {
		res.status(400).send('You must have the right data type.');
		return;
	}
	try {
		let docRef = await db.collection('matches').add(data);
		res.status(200).send({id: docRef.id});
		return;
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
		return;
	}
	
});

router.delete('/', (req, res) => {
	res.status(400).send('You must enter an ID to delete an match.');
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const exists = await functions.checkId(id, THIS_COLLECTION);
	if (!exists) {
		res.status(404).send('You must have a corrext match ID.');
		return;
	}
	try {
		await db.collection(`${THIS_COLLECTION}`).doc(id).delete();
		res.status(200).send('Successful delete!')
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}

});

function checkDataKeyType(data) {
	const keyType = [
		typeof data.winnerId,
		typeof data.loserId
	]
	for (let i = 0; i < keyType.length; i++) {
		if (keyType[i] != 'string') {
			return false;
		}
	}
	return true;
}

module.exports = router;