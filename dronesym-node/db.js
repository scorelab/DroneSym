var firebase = require('firebase-admin');
var creds = require('FIREBASE_CREDS_FILE');
require('firebase/database');

firebase.initializeApp({
	databaseURL: "https://dronedb-213c3.firebaseio.com/",
	credential: firebase.credential.cert(creds)
});

var db = firebase.database();

module.exports = db;