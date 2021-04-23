const admin = require("firebase-admin");
let serviceAccount; 

try {
	serviceAccount = require("./private_key.json");
} catch (error) {
	serviceAccount = JSON.parse(process.env.PRIVATE_KEY);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getDatabase() {
	return admin.firestore();
}

module.exports = getDatabase;