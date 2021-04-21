const express = require('express');
const router = express.Router()

const dbFunction = require('../database.js');
const db = dbFunction();

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
	const docRef = await db.collection('hamsters').doc(id).get();
	data = docRef.data();
	data.firestoreId = docRef.id; //för tillgång till firestore id från frontend.
	res.send(data);
});


router.post('/', async (req, res) => {
	const data = req.body;

	if ( isEmpty(data) ) {
		res.status(400).send('You must send with right data.');
		return
	}
	let response = await db.collection('hamsters').add(data);
	res.status(200).send(response.id);
});



//Måste finnas pga om du gör en put utan parameter...
router.put('/', (req, res) => {
	res.status(404).send('You must enter a valid ID to an hamster.')
});

router.put('/:id', async (req, res) => {
	let id = req.params.id;
	let data = req.body;

	await db.collection('hamsters').doc(id).set(data, {merge: true})
	res.sendStatus(200);
	
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id; 
	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200);
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
		allHamsters.push(hamster);
	});
	return allHamsters;
}
async function checkHamsterID(id) {

}


module.exports = router;