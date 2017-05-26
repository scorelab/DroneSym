#DronePool module which handles interaction with SITLs

from dronekit import Vehicle, VehicleMode, connect
from dronekit_sitl import SITL
import node, time
import mavparser

drone_pool = {}
instance_count = 0

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

	drones = node.get_drones()['drones']

	if not drones:
		return

	for drone_id in drones:
		if drone_id not in drone_pool.keys():
			location = node.get_drone_by_id(drone_id)['location']
			create_new_drone(db_key=drone_id, home=location)

def create_new_drone(home=None, db_key=None):
	global instance_count
	drone = Sim(instance_count, home)
	drone.launch()
	drone_conn = connect(drone.connection_string(), wait_ready=True)

	drone_pool[db_key] = drone_conn
	instance_count += 1

	res = { "status" : "OK", "id" : db_key }
	return res

def run_mission(drone, target_height, waypoints):
	while True:
		if drone.location.global_relative_frame.alt >= target_height * 0.9:
			break

	print 'target alt reached'

	mavparser.create_mission(drone, waypoints)
	print 'mission acquired'

	drone.mode = VehicleMode('AUTO')
	print 'initiating sequence'

	print 'in mission'


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

	if waypoints:
		run_mission(drone, target_height, waypoints)

	@drone.on_attribute('location')
	def update_location(self, attr_name, value):
		node.update_drone(drone_id, { "location" : {"lat": value.global_relative_frame.lat, "lon": value.global_relative_frame.lon, "alt": value.global_relative_frame.alt}})

	@drone.on_attribute('airspeed')
	def update_airspeed(self, attr_name, value):
		node.update_drone(drone_id, {"airspeed": value})

	@drone.on_attribute('attitude')
	def udpate_attitude(self, attr_name, value):
		node.update_drone(drone_id, { "pitch": value.pitch, 'roll': value.roll, 'yaw': value.yaw })

	@drone.on_attribute('heading')
	def update_heading(self, attr_name, value):
		node.update_drone(drone_id, { "heading": value })

	print 'took off'

	return True

def land_drone(drone_id):
	try:
		drone = drone_pool[drone_id]
	except:
		raise

	if not drone.armed:
		return False

	mavparser.issue_land_command(drone)
	drone.mode = VehicleMode('AUTO')

	return True
