#Main entry point for the Flask API. The API will provide
#an interface to communicate with Dronekit instances

from flask import jsonify, Flask
from flask import abort, request
from flask import make_response
import json, dronepool


app = Flask(__name__)

@app.errorhandler(404)
def send_not_found(error):
	return make_response(jsonify({"message": "Resource not found"}), 404)

@app.errorhandler(400)
def send_bad_request(error):
	return make_response(jsonify({"message": "Bad request"}), 400)

@app.route('/dronesym/api/create', methods=['POST'])
def create_new_drone():
	#This routes creates a new Dronekit SITL in the Drone Pool.
	#The initial position needs to be send along the request as a JSON

	if not request.json or not 'location'in request.json:
		abort(400)

	home = request.json['location']
	res = dronepool.create_new_drone(home=home)

	return jsonify(res)

@app.route('/dronesym/api/get/drones', methods=['GET'])
def get_all_drones():
	#This route returns all the drones in the pool
	return jsonify({"drones": ["drone-1", "drone-2", "drone-3"]})

@app.route('/dronesym/api/get/<int:drone_id>', methods=['GET'])
def get_drone_by_id(drone_id):
	#This routes returns the current state of the drone specified by the id
	return jsonify({"state": "drone_state", "drone_id": drone_id})

@app.route('/dronesym/api/<string:drone_id>/takeoff', methods=['POST'])
def send_takeoff(drone_id):
	#This route issues a takeoff command to a specific drone
	if request.json and request.json['waypoints']:
		dronepool.takeoff_drone(drone_id, waypoints=request.json['waypoints'])
	else:
		dronepool.takeoff_drone(drone_id)
	return jsonify({"status": "taking_off", "drone_id": drone_id})

@app.route('/dronesym/api/<int:drone_id>/land', methods=['POST'])
def send_land(drone_id):
	#This routes issues a landing command to a specific drone
	return jsonify({"status": "landing", "drone_id": drone_id})

@app.route('/dronesym/api/<int:drone_id>/flightpath', methods=['POST'])
def send_flightpath(drone_id):
	#This route issues a flightpath to a specific drone
	if not request.json or 'flightpath' not in request.json:
		abort(400)

	return jsonify({"status": "flightpath_configured", "drone_id": drone_id})


if __name__ == '__main__':
	dronepool.initialize()
	app.run(debug=True, use_reloader=False)