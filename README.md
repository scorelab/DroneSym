Setting Up the Project

Part 1 - Setting up Node environment

1. After cloning the repo navigate to `dronesym-node` folder
2. Run `npm install` to pull the dependencies
3. Create a firebase admin sdk private key following the instructions found here: https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app
4. In `db.js` file provide the path to your firebase key file and the database url
5. Run `npm start` to start the Node server


Part 2 - setting up Python environment

1. After cloning the repo, navigate to the folder dronesym-python
2. Run `sudo pip install -r requirements.txt` to pull the dependencies
3. Navigate to `dronsym-python/flask-api/src` folder
4. Run `python main.py` to start the Flask server (Note: Node server should be running when starting up the Flask server)
