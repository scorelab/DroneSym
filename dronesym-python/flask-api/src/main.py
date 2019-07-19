"""
Main entry point for the Flask API. The API will provide
"""
# an interface to communicate with Dronekit instances
from flask import jsonify, Flask
from flask import abort, request
from flask import make_response
import dronepool
import threadrunner

app = Flask(__name__)
api_base_url = '/dronesym/api/flask'


@app.errorhandler(404)
def send_not_found(error):
    return make_response(jsonify({"message": "Resource not found"}), 404)


@app.errorhandler(400)
def send_bad_request(error):
    return make_response(jsonify({"message": "Bad request"}), 400)


@app.route(api_base_url + '/spawn', methods=['POST'])
def create_new_drone():
    # This routes creates a new Dronekit SITL in the Drone Pool.
    # The initial position needs to be send along the request as a JSON
    global q

    if not request.json or not 'location'in request.json or 'droneId' not in request.json:
        abort(400)
    print(request.json)
    home = request.json['location']
    drone_id = request.json['droneId']
    q.put((dronepool.create_new_drone, {"db_key": drone_id, "home": home}))

    return jsonify({"status": "OK", "message": "Created new drone"})


@app.route(api_base_url + '/remove/<string:drone_id>', methods=['POST'])
def remove_drone(drone_id):
    global q
    q.put((dronepool.remove_drone, {"drone_id": drone_id}))
    return jsonify({"status": "OK", "message": "Removed drone"})


@app.route(api_base_url + '/<string:drone_id>/takeoff', methods=['POST'])
def send_takeoff(drone_id):
    # This route issues a takeoff command to a specific drone
    global q
    if request.json and request.json['waypoints'] and len(
            request.json['waypoints']) > 0:
        q.put(
            (dronepool.takeoff_drone, {
                "drone_id": drone_id, "waypoints": request.json['waypoints']}))
    else:
        q.put((dronepool.takeoff_drone, {"drone_id": drone_id}))
    return jsonify({"status": "taking_off", "drone_id": drone_id})


@app.route(api_base_url + '/<string:drone_id>/land', methods=['POST'])
def send_land(drone_id):
    global q
    q.put((dronepool.land_drone, {"drone_id": drone_id}))
    return jsonify({"status": "landing", "drone_id": drone_id})


@app.route(api_base_url + '/<string:drone_id>/resume', methods=['POST'])
def send_resume(drone_id):
    global q
    q.put((dronepool.resume_flight, {"drone_id": drone_id}))
    return jsonify({"status": "resuming", "drone_id": drone_id})


if __name__ == '__main__':
    threadrunner.initialize()
    q = threadrunner.q
    dronepool.initialize()
    app.run(debug=True, use_reloader=False)
