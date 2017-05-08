from firebase import firebase
import ConfigParser


def get_db_handle():
	parser = ConfigParser.ConfigParser()
	parser.read('./config.ini')

	db_secret = parser.get('firebase', 'db_secret')
	db_email = parser.get('firebase', 'db_email')
	db_url = parser.get('firebase', 'db_url')

	firebase_auth = firebase.FirebaseAuthentication(db_secret, db_email)
	db = firebase.FirebaseApplication(db_url)
	db.authentication = firebase_auth

	return db
