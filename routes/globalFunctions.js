const dbFunction = require('../database.js');
const db = dbFunction();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

async function get(COLLECTION) {
	let allFromCollection = [];
	try {
		const snapshot = await db.collection(`${COLLECTION}`).get();
		snapshot.forEach(docRef => {
			let item = docRef.data();
			item.firestoreId = docRef.id;
			allFromCollection.push(item);
		});
		
	} catch (error) {
		console.log(error);
		return false;
	}
	return allFromCollection;
}

async function checkId(id, COLLECTION) {
	let allFromCollection = await get(`${COLLECTION}`);
	let exists = allFromCollection.find(item => id == item.firestoreId);
	if (!exists) {
		return false;
	}
	return exists;
}

async function checkData(data, id, THIS_COLLECTION) {
	const item = await checkId(id, THIS_COLLECTION);
	const dataKeys = (Object.keys(data));
	const itemKeys = Object.keys(item);
	let correctKeys = [];

	dataKeys.forEach(dataKey => {
		itemKeys.forEach(itemKey => {
			if (dataKey === itemKey) {
				correctKeys.push(dataKey);
			}
		});
	});
	if (correctKeys.length < dataKeys.length) {
		return false;
	}
	return true;
}

function newItemCheck(data, defaultKeys) {
	const dataKeys = (Object.keys(data));
	let correctKeys = [];
	
	dataKeys.forEach(dataKey => {
		defaultKeys.forEach(defaultKey => {
			if (dataKey == defaultKey) {
				correctKeys.push(dataKey);
			}
		});
	});

	if (correctKeys.length === dataKeys.length && correctKeys.length === defaultKeys.length) {
		return true;
	}
	return false;
}



module.exports.functions = { checkId, get, isEmpty, checkData, newItemCheck }
