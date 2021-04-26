const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

const THIS_COLLECTION = 'matches';

const functions = require('./globalFunctions.js').functions;

router.get('/', async (req, res) => {
	// const data = await getAllMatches();
	const data = await functions.get(THIS_COLLECTION);
	if(!data){
		res.sendStatus(500);
	}
	res.send(data);
});

router.get('/:id', async(req, res) => {
	const id = req.params.id;
	let data = await functions.checkId(id, THIS_COLLECTION);
	if(!data) {
		res.sendStatus(500);
		return;
	}
	if (data === 'noMatch') {
		res.status(404).send('This match ID does not exists.');
		return;
	}
	res.send(data);
});

router.post('/', async (req, res) => {
	const data = req.body;
	const correctData = newMatchCheck(data);
	const correctDataType = checkDataKeyType()
	if (isEmpty(data)) {
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
	const exists = await functions.checkId(id);
	if (!exists) {
		res.status(404).send('You must have a corrext match ID.');
		return;
	}
	await db.collection('matches').doc(id).delete();
	res.status(200).send('Successful delete!')

});

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// async function getAllMatches() {
// 	let allMatches = [];
// 	try {
// 		const snapshot = await db.collection('matches').get();
// 		snapshot.forEach(docRef => {
// 			let match = docRef.data();
// 			match.firestoreId = docRef.id;
// 			allMatches.push(match);
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return false;
// 	}
// 	return allMatches;
// }
async function checkMatchId(id) { //kolla igenom ////////////////////////////////////////////////////
	try {
		let allMatches = await getAllMatches();
		let exists = allMatches.find(match => id === match.firestoreId);
		if(!exists){
			exists = 'noMatch';
			return exists;
		}
		return exists;
		
	} catch (error) {
		console.log(error);
		return false;
	}
}

function newMatchCheck(data) {
	const dataKeys = (Object.keys(data));
	let correctKeys = [];
	const matchKeys = [
		'winnerId',
		'loserId'
	]
	
	dataKeys.forEach(dataKey => {
		matchKeys.forEach(matchKeys => {
			if (dataKey === matchKeys) {
				correctKeys.push(dataKey)
			}
		});
	});

	if (correctKeys.length != matchKeys.length) {
		return false;
	}
	return true;
}

function checkDataKeyType(data) {
	const keyType = [
		typeof data.winnerId,
		typeof data.loserId,
	]
	for (let i = 0; i < keyType.length; i++) {
		if (stringkeyType[i] != 'string') {
			return false;
		}
	}
	return true;
}

module.exports = router;