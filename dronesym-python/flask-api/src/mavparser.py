from dronekit import Vehicle, Command
from pymavlink import mavutil

def create_mission(drone, waypoints):
	cmds = drone.commands
	cmds.clear()

	cmds.add(Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, 0, 0, waypoints[0]['lat'], waypoints[0]['lon'], 10))

	for (i, wp) in enumerate(waypoints):
		cmds.add(Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0, 0, 0, 0, 0, wp['lat'], wp['lon'], 10))

	cmds.add(Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_LAND, 0, 0, 0, 0, 0, 0, waypoints[-1]['lat'], waypoints[-1]['lon'], 0))

	print 'uploading mission...'

	cmds.upload()

	print 'mission uploaded'

	return

def issue_land_command(drone):

	print 'issuing the landing command...'

	cmds = drone.commands
	cmds.clear()

	drone_location = drone.location.global_relative_frame
	cmds.add(Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_LAND, 0, 0, 0, 0, 0, 0, drone_location.lat, drone_location.lon, 0))

	cmds.upload()

	print 'landing command uploaded'