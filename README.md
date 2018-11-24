![dronesym_logo](https://user-images.githubusercontent.com/17242746/47440055-18d8e280-d7cb-11e8-984c-8a495e281275.png)
# DroneSym
[![Build Status](https://travis-ci.org/scorelab/DroneSym.svg?branch=develop)](https://travis-ci.org/scorelab/DroneSym)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f21c3a60c4ec4c0caaf4ebdf60df0b26)](https://www.codacy.com/app/hcktheheaven/DroneSym?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=scorelab/DroneSym&amp;utm_campaign=Badge_Grade)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/scorelab/DroneSym)

### Setting Up the Project

### Prerequisites

1. Install Node.js 6.x (or higher)
2. Python version 2.7

### Part 1 - Setting up the Node environment

1. After cloning the repo navigate to `dronesym-node` folder
2. Run `npm install` to pull the dependencies
3. Create a firebase admin sdk private key following the instructions found here: https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app
4. In `db.js` file provide the path to your firebase key file and the database url
5. Import the database with `mongorestore --db dronesym dronedb/dronesym`
6. Run `npm start` to start the Node server

**Note: Make sure you have an admin account in the database under user collection. (Refer the schema in Models folder)**


### Part 2 - Setting up Python environment

1. After cloning the repo, navigate to the folder dronesym-python
2. Run `sudo pip install -r requirements.txt` to pull the dependencies
3. Navigate to `dronsym-python/flask-api/src` folder
4. Run `python main.py` to start the Flask server
**Note: Node server should be running when starting up the Flask server**

### Part 3 - Setting up the Angular front-end

**Make sure that you have Node6.x or higher version installed**

Install AngularCLI

```sh
$ npm install -g @angular/cli
```
Set environmental variable in `./dronesym-frontend/src/environments/environment.ts`

```sh
mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
nodeApiURL: 'http://localhost:3000/dronesym/api/node',
feedURL: 'http://localhost:3000/feed'
```
**Note: Dronesym Node server (`./dronesym-node/`) and DroneSym Flask server (`./dronesym-python/flask-api/src`) should be running before starting the frontend server_**

Starting the Angular2 development server

```sh
$ npm install
$ ng serve
```

### Default login credentials

#### Admin
```
username: admin
password: admin
```

#### User
```
username: icarus
password: icarus
```

### Part 4 - Running with Docker (Optional)

Checkout to docker branch

```sh
$ git checkout docker
```

Navigate to the root folder

Run

```sh
$ docker-compose up
```

### Run Unit Tests Node

For node unit tests - **both the flask server and node server have to be running.**

Navigate to `dronesym-node`
Run `npm test`
