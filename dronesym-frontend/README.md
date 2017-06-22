# DroneSym Frontend

The frontend app written in angular2 for DroneSym project

### Installation

Install AngularCLI

```sh
$ npm install -g @angular/cli
```
Set environmental variable in `./dronesym-frontend/src/environment.ts`

```sh
mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
nodeApiURL: 'http://localhost:3000/dronesym/api/node',
feedURL: 'http://localhost:3000/feed'
```
_Note: Dronesym Node server (`./dronesym-node/`) and DroneSym Flase server (`./dronesym-python/flask-api/src`) should be running before starting the frontend server_

Starting the Angular2 development server

```sh
$ npm install
$ ng serve
```
