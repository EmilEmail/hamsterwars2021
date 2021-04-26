const dbFunction = require('../database.js');
const db = dbFunction();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
async function get(nameOf) {
	let allHamsters = [];
	try {
		const snapshot = await db.collection(`${nameOf}`).get();
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
async function checkId(id, nameOf) {
	let allHamsters = await get(`${nameOf}`);
	let exists = allHamsters.find(hamster => id == hamster.firestoreId);
	if (!exists) {
		return false;
	}
	return exists;
}

async function checkData(data, id, THIS_COLLECTION) {
	const hamster = await checkId(id, THIS_COLLECTION);
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
		'imgName',
		'loves',
		'name',
		'wins'
	]
	
	dataKeys.forEach(dataKey => {
		hamsterKeys.forEach(hamsterKey => {
			if (dataKey == hamsterKey) {
				correctKeys.push(dataKey);
			}
		});
	});

	if (correctKeys.length != hamsterKeys.length) {
		return false;
	}
	return true;
}

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

module.exports.functions = { checkId, get, isEmpty, checkData, newHamsterCheck, hamsterKeyType }
