var firebase = require('firebase-admin');
var creds = require('./dronesym-key.json');
require('firebase/database');

firebase.initializeApp({
	databaseURL: "https://dronesym-66bd5.firebaseio.com",
	credential: firebase.credential.cert(creds)
});

var db = firebase.database();

module.exports = db;