![dronesym_logo](https://user-images.githubusercontent.com/17242746/47440055-18d8e280-d7cb-11e8-984c-8a495e281275.png)

# DroneSym

[![Build Status](https://travis-ci.org/scorelab/DroneSym.svg?branch=develop)](https://travis-ci.org/scorelab/DroneSym)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f21c3a60c4ec4c0caaf4ebdf60df0b26)](https://www.codacy.com/app/hcktheheaven/DroneSym?utm_source=github.com&utm_medium=referral&utm_content=scorelab/DroneSym&utm_campaign=Badge_Grade)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/scorelab/DroneSym)

### Setting Up the Project

### Prerequisites

1. Install Node.js 6.x (or higher)
2. Python version 2.7 (or higher)
3. MongoDB version 3.6 (or higher)

### Part 1 - Setting up the Node environment

1. After cloning the repo navigate to `dronesym-node` folder
2. Run `npm install` to pull the dependencies
3. To avoid the error : `exception in initAndListen: NonExistentPath: Data directory C:\data\db\ not found., terminating"(Windows)    or "Error: dbpath (/data/db) doesn't exist"(Linux)`, create the dbpath as follows before running mongodb with replica set.
**For Windows Users :**
  Create a folder C:\data\db
**For Linux Users :**
Run the following commands :
    To create the directory **/data/db** directory where **data** directory is in the **root** directory run:
    ```sh
    $  sudo mkdir -p /data/db
    ```
    As the owner and the group of '/data' directory are root, we need to change ownership of the directory to the current user to access it.
    We can change the ownership of the directory as follows:
    ```sh
    $  sudo chown -R username:group/data
    $  sudo chmod 0755 /data/db
    ```
    If one wants to change the MongoDB default data path i.e. "C:\data\db" (Windows) or "/data/db" (Linux) to some other directory then use:
    `mongod --dbpath /usr/local/mongodb-data`
4. Run `mongod --replSet rs` to start running Mongo with a Replica Set.
5. Open another terminal without disturbing the terminal running mongod, then import the database with `mongorestore --db dronesym dronedb/dronesym`
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

**_Note:_** You will have to rename the `example.environment.ts` to `environment.ts` or create new file, for example by copying the example file:

```sh
$ cp src/environments/example.environment.ts src/environments/environment.ts`
```
Edit the environment.ts as follows
```sh
mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
nodeApiURL: 'http://localhost:3000/dronesym/api/node',
feedURL: 'http://localhost:3000/feed'
```

**Note: Dronesym Node server (`./dronesym-node/`) and DroneSym Flask server (`./dronesym-python/flask-api/src`) should be running before starting the frontend server\_**

**Note: You should enable Google Maps JavaScript API before using API key**

Starting the Angular development server

```sh
$ npm install
$ ng serve
```
### Runing tests
1.Navigate to `dronesym-node` folder and run `npm install http`

2.Then run yarn test

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