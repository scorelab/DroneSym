var firebase = require('firebase-admin');
var creds = require('FIREBASE_CRED_FILE');
require('firebase/database');

firebase.initializeApp({
	databaseURL: "FIREBASE_URL",
	credential: firebase.credential.cert(creds)
});

var db = firebase.database();

module.exports = db;