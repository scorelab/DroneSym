#DronePool module which handles interaction with SITLs

from dronekit import Vehicle, VehicleMode, connect
from dronekit_sitl import SITL
import db, time
import mavparser

drone_pool = {}
instance_count = 0
firebase = None

class Sim(SITL, object):
	def __init__(self, instance=1, home=None):
		super(Sim, self).download("copter", "3.3", verbose=True)
		self.instance = instance

		if home:
			self.home = home
		else:
			self.home = {"lat":6.9271, "lon":79.8612, "alt": 1}

		self.p = None
		return

	def connection_string(self):
		return super(Sim, self).connection_string()[:-4] + str(5760 + self.instance * 10)

	def launch(self):
		home_str = str(self.home['lat']) + ',' + str(self.home['lon']) + ',' + str(self.home['alt']) + ',353'
		super(Sim, self).launch(["--instance", str(self.instance), "--home", home_str], await_ready=True, verbose=True)

	def get_sitl_status(self):
		return { 'id': self.instance, 'home': self.home }

def initialize():
	global firebase
	firebase = db.get_db_handle()

	drones = firebase.get('/drones', None)

	if not drones:
		return

	for drone_id in drones:
		if drone_id not in drone_pool.keys():
			location = firebase.get('/drones/'+ drone_id, 'global_rel')
			create_new_drone(db_key=drone_id, home=location)

def create_new_drone(home=None, db_key=None):
	global instance_count
	drone = Sim(instance_count, home)
	drone.launch()
	drone_conn = connect(drone.connection_string(), wait_ready=True)
	status = get_drone_status(drone_conn)

	if not db_key:
		res = firebase.post('/drones',  status)
	else:
		res = { 'name': db_key }

	drone_pool[res['name']] = drone_conn

	instance_count += 1
	return res

def get_drone_status(drone):
	status = {}

	status['global_loc'] = { 'lat': drone.location.global_frame.lat, 'lon': drone.location.global_frame.lon, 'alt': drone.location.global_frame.alt}
	status['global_rel'] = {'lat': drone.location.global_relative_frame.lat, 'lon': drone.location.global_relative_frame.lon, 'alt': drone.location.global_relative_frame.alt}
	status['attitude'] = {'roll': drone.attitude.roll, 'pitch': drone.attitude.pitch, 'yaw': drone.attitude.yaw }
	status['airspeed'] = drone.airspeed
	status['heading'] = drone.heading

	return status

def takeoff_drone(drone_id, target_height=10, waypoints=None):
	try:
		drone = drone_pool[drone_id]
	except:
		raise

	drone.initialize()

	while not drone.is_armable:
		time.sleep(1)

	drone.mode = VehicleMode('GUIDED')
	drone.armed = True


	while not drone.armed:
		time.sleep(1)

	drone.simple_takeoff(target_height)

	while True:
		if drone.location.global_relative_frame.alt >= target_height * 0.9:
			break

	mavparser.create_mission(drone, waypoints)

	drone.mode = VehicleMode('AUTO')

	url = '/drones/' + drone_id

	@drone.on_attribute('location')
	def update_location(self, attr_name, value):
		print 'lat: ' + `value.global_frame.lat` + ' - lon: ' + `value.global_frame.lon`
		firebase.patch(url + '/global_loc/', {'lat': value.global_frame.lat, 'lon': value.global_frame.lon, 'alt': value.global_frame.alt})
		firebase.patch(url + '/global_rel/', {'lat': value.global_relative_frame.lat, 'lon': value.global_relative_frame.lon, 'alt': value.global_relative_frame.alt})

	return True