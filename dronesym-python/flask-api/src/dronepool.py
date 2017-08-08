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
		home_str = str(self.home['lat']) + ',' + str(self.home['lon']) + ',0,353'
		super(Sim, self).launch(["--instance", str(self.instance), "--home", home_str], await_ready=True, verbose=True)

	def get_sitl_status(self):
		return { 'id': self.instance, 'home': self.home }

def initialize():

	drones = node.get_drones()['drones']

	if not drones:
		return

	for drone_id in drones:
		if drone_id not in drone_pool.keys():
			drone = node.get_drone_by_id(drone_id)
			location = drone['location']
			create_new_drone(db_key=drone_id, home=location)

			if 'status' in drone.keys() and drone['status'] == 'FLYING':
				resume_flight(drone_id)

def resume_flight(drone_id):
	drone = node.get_drone_by_id(drone_id)

	waypoints = []

	for wp in sorted(drone['waypoints']):
		waypoints.append(drone['waypoints'][wp])

	next_waypoint = waypoints.index(drone['waypoint'])
	print next_waypoint

	takeoff_drone(drone_id, waypoints=waypoints[next_waypoint:])

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

	print waypoints

	if waypoints:
		run_mission(drone, target_height, waypoints)

	def detach_event_listeners(drone, value, status):
		drone.remove_attribute_listener('location', update_location)
		drone.remove_attribute_listener('airspeed', update_airspeed)
		drone.remove_attribute_listener('attitude', udpate_attitude)
		drone.remove_attribute_listener('heading', update_heading)
		node.update_drone(drone_id, { "location" : {"lat": value.global_relative_frame.lat, "lon": value.global_relative_frame.lon, "alt": value.global_relative_frame.alt}, "status": status})
		return

	def update_location(self, attr_name, value):

		node.update_drone(drone_id, { "location" : {"lat": value.global_relative_frame.lat, "lon": value.global_relative_frame.lon, "alt": value.global_relative_frame.alt}, "status": "FLYING"})

		command_len = len(drone.commands)
		wp_len = len(waypoints)

		if command_len >= wp_len :
			diff = command_len - wp_len
			next_wp = max(drone.commands.next - diff, 0) % len(waypoints)
			waypoint = waypoints[next_wp]
			# print "df: " + `diff`
			# print next_wp
			node.update_drone(drone_id, { "waypoint" : waypoint })

		if drone.mode == VehicleMode('LAND') and drone.location.global_relative_frame.alt <= 0.1:
			detach_event_listeners(drone, value, "HALTED")
			return

		if drone.commands.next == len(drone.commands):
			detach_event_listeners(drone, value, "FINISHED")
			return


	def update_airspeed(self, attr_name, value):
		node.update_drone(drone_id, {"airspeed": value})

	def udpate_attitude(self, attr_name, value):
		node.update_drone(drone_id, { "pitch": value.pitch, 'roll': value.roll, 'yaw': value.yaw })

	def update_heading(self, attr_name, value):
		node.update_drone(drone_id, { "heading": value })

	drone.add_attribute_listener('location', update_location)
	drone.add_attribute_listener('airspeed', update_airspeed)
	drone.add_attribute_listener('attitude', udpate_attitude)
	drone.add_attribute_listener('heading', update_heading)

	print 'took off'

	return True

def land_drone(drone_id):
	try:
		drone = drone_pool[drone_id]
	except:
		raise

	if not drone.armed:
		return False

	cmds = drone.commands
	cmds.wait_ready()
	cmds.clear()

	drone.mode = VehicleMode('LAND')

	return True
