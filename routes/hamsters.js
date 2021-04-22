const express = require('express');
const router = express.Router();

const dbFunction = require('../database.js');
const db = dbFunction();


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
		const allHamsters = await getHamsters();
		if(!allHamsters) {
			res.sendStatus(500);
			return;
		}
		res.send(allHamsters);
});

router.get('/random', async (req, res) => {
	const allHamsters = await getHamsters();
	if (!allHamsters) {
		res.sendStatus(500);
		return;
	}
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
	if (exists === 500) {
		res.sendStatus(500);
	}
	res.send(exists);
});

/////klar hit

router.post('/', async (req, res) => {
	const data = req.body;

	//kolla denna function
	const correctData = newHamsterCheck(data);
	////
	console.log(correctData)

	if (isEmpty(data)) {
		res.status(400).send('You must send with any data.');
		return;
	}
	if (!correctData) {
		res.status(400).send('One or more of the objects keys are miss-spelled or missing.');
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



//Måste finnas pga om du gör en put utan parameter...
router.put('/', (req, res) => {
	res.status(404).send('You must enter a valid ID to an hamster.');
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
	const exists = await checkHamsterId(id);
	if (!exists) {
		res.status(404).send('Hamster ID does not exists!');
		return;
	}
	try {
		await db.collection('hamsters').doc(id).delete()
		res.status(200).send('You have now deleted one Hamster!');
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

/////////Utomstående funktioner//////////

//kollar om input-objectet är tom
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
async function getHamsters() {
	let allHamsters = [];
	try {
		const snapshot = await db.collection('hamsters').get();
		snapshot.forEach(docRef => {
			let hamster = docRef.data();
			hamster.firestoreId = docRef.id;
			allHamsters.push(hamster);
		});
		
	} catch (error) {
		console.log(error);
		return false;
	}
	return allHamsters;
}
async function checkHamsterId(id) {
		let allHamsters = await getHamsters();
		if(!allHamsters) {
			return false;
		}
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


//kolla till denna function!
function newHamsterCheck(data) {
	const dataKeys = (Object.keys(data));
	let correctKeys = [];
	let hamsterKeys = [
		'age',
		'defeats',
		'favFood',
		'games',
		'imgName',
		'loves',
		'name',
		'wins',
		'id'
	]
	
	dataKeys.forEach(dataKey => {
		hamsterKeys.forEach(hamsterKey => {
			if (dataKey === hamsterKey) {
				correctKeys.push(dataKey)
			}
		});
	});

	console.log(correctKeys.length)
	console.log(hamsterKeys.length)

	if (correctKeys.length != hamsterKeys.length) {
		return false;
	}
	return true;
}

module.exports = router;