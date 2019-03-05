var firebase = require('firebase-admin');
const isCI = require("is-ci");
var creds,URL ;
if (isCI) {
	creds = process.env.FIREBASE_CRED_FILE;
	URL = process.env.FIREBASE_URL;
	require('firebase/database');
	
	firebase.initializeApp({
		databaseURL: URL,
		credential: firebase.credential.cert(JSON.parse(creds))
	});	
}
else{
	creds = require("FIREBASE_CRED_FILE");
	require('firebase/database');
	firebase.initializeApp({
	databaseURL: "FIREBASE_URL",
	credential: firebase.credential.cert(creds)
});

}

var db = firebase.database();

module.exports = db;
