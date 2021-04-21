const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();

router.post('/postallhamsters', async(req, res) => {
	const allHamsters = req.body;
	await allHamsters.forEach(hamster => {
		db.collection('hamsters').add(hamster);
	});
	res.status(200).send('You have got all hamsters in database!')
});

router.get('/', async (req, res) => {
	const allHamsters = await getHamsters();
	res.send(allHamsters);
});

router.get('/random', async (req, res) => {
	const allHamsters = await getHamsters();
	let index = Math.floor(Math.random() * (allHamsters.length - 1));
	res.send(allHamsters[index]);
})

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const exists = await checkHamsterId(id);
	if (!exists) {
		res.status(404).send('There is no hamster with that ID.')
		return
	}
	const docRef = await db.collection('hamsters').doc(id).get();
	data = docRef.data();
	data.firestoreId = docRef.id; //för tillgång till firestore id från frontend.
	res.send(data);
});


router.post('/', async (req, res) => {
	const data = req.body;
	const correctData = newHamsterCheck(data);

	if (isEmpty(data)) {
		res.status(400).send('You must send with any data.');
		return;
	}
	if (!correctData) {
		res.status(400).send('One or more of the objects keys are miss-spelled or missing.');
		return;
	}

	let docRef = await db.collection('hamsters').add(data);
	res.status(200).send(`You have now put an new hamster to the fight! id: ${docRef.id}`);
});



//Måste finnas pga om du gör en put utan parameter...
router.put('/', (req, res) => {
	res.status(404).send('You must enter a valid ID to an hamster.')
});

router.put('/:id', async (req, res) => {
	const id = req.params.id;
	const data = req.body;
	const exists = await checkHamsterId(id);
	const checkObjectKeys = await checkData(data, id);
	if (!exists) {
		res.status(404).send('There is no hamster with that ID.')
		return;
	}
	if (!checkObjectKeys) {
		res.status(400).send('You must enter a hamster with correct keys.')
		return;
	}
	await db.collection('hamsters').doc(id).set(data, {merge: true});
	res.status(200).send('You have updated a hamsterObject.');
	
});

router.delete('/', (req, res) => {
	res.sendStatus(400).send('You must enter a valid ID.')
});


router.delete('/:id', async (req, res) => {
	const id = req.params.id; 
	const exists = await checkHamsterId(id);
	if (!exists) {
		res.status(404).send('Hamster ID does not exists!');
		return;
	}
	await db.collection('hamsters').doc(id).delete()
	res.status(200).send('You have now deleted one Hamster!');
});

/////////Utomstående funktioner//////////

//kolla om objectet är tom
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
async function getHamsters() {
	const snapshot = await db.collection('hamsters').get();
	let allHamsters = [];
	snapshot.forEach(docRef => {
		let hamster = docRef.data();
		hamster.firestoreId = docRef.id;
		allHamsters.push(hamster);
	});
	return allHamsters;
}
async function checkHamsterId(id) {
	let allHamsters = await getHamsters();
	let exists = allHamsters.find(hamster => id === hamster.firestoreId);
	return exists;
}

//designbeslut, har man skrivit något fel så går det ej att genomföra operationen.
async function checkData(data, id) {
	const hamster = await checkHamsterId(id);
	const dataKeys = (Object.keys(data));
	const hamsterKeys = Object.keys(hamster);

	let correctKeys = [];
	dataKeys.forEach(dataKey => {
		hamsterKeys.forEach(hamsterKey => {
			if (dataKey === hamsterKey) {
				correctKeys.push(dataKey);
			}
		});
	});
	if (correctKeys.length < dataKeys.length) {
		return false;
	}
	return true;
}

function newHamsterCheck(data) {
	const dataKeys = (Object.keys(data));
	let correctKeys = [];
	const hamsterKeys = [
		'age',
		'defeats',
		'favFood',
		'games',
		'id',
		'imgName',
		'loves',
		'name',
		'wins'
	]
	
	dataKeys.forEach(dataKey => {
		hamsterKeys.forEach(hamsterKey => {
			if (dataKey === hamsterKey) {
				correctKeys.push(dataKey)
			}
		});
	});

	if (correctKeys.length < hamsterKeys.length) {
		return false;
	}
	return true;
}


module.exports = router;