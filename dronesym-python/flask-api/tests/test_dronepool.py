import unittest
import mocks
from dronekit import VehicleMode
import unittest
from inspect import getsourcefile
import os.path
import sys

current_path = os.path.abspath(getsourcefile(lambda:0))
current_dir = os.path.dirname(current_path)
parent_dir = current_dir[:current_dir.rfind(os.path.sep)]
source_dir = os.path.join(parent_dir, 'src')

sys.path.insert(0, source_dir)

import dronepool

class TestDronePool(unittest.TestCase):
	def setUp(self):
		dronepool.env_test = True
		dronepool.instance_count = 0

	def tearDown(self):
		dronepool.instance_count = 0
		dronepool.drone_pool = {}

	def test_create_new_drone(self):
		res = dronepool.create_new_drone( { "db_key" : "test" })
		self.assertEqual(res['status'], "OK")
		self.assertEqual(res['id'], "test")
		self.assertEqual("test" in dronepool.drone_pool, True)

	def test_remove_drone(self):
		vehicle = mocks.MockVehicle()
		dronepool.drone_pool["test"] = vehicle

		res = dronepool.remove_drone({ "drone_id" : "test" })
		self.assertEqual(res['status'], "OK")
		self.assertEqual(res['id'], "test")
		self.assertEqual("test" in dronepool.drone_pool, False)

	def test_remove_in_flight_drone(self):
		vehicle = mocks.MockVehicle()
		vehicle.mode = VehicleMode('AUTO')

		dronepool.drone_pool["test"] = vehicle
		res = dronepool.remove_drone({ "drone_id" : "test" })
		self.assertEqual(res['status'], "ERROR")
		self.assertEqual("test" in dronepool.drone_pool, True)

	def test_remove_drone_with_invalid_key(self):
		res = dronepool.remove_drone({ "drone_id" : "test" })
		self.assertEqual(res['status'], "ERROR")

	def test_land_drone_armed(self):
		vehicle = mocks.MockVehicle()
		vehicle.armed = True
		dronepool.drone_pool = { "test" : vehicle }
		res = dronepool.land_drone({ "drone_id" : "test" })
		self.assertEqual(res, True)
		self.assertEqual(vehicle.mode, VehicleMode('LAND'))

	def test_land_drone_unarmed(self):
		vehicle = mocks.MockVehicle()
		vehicle.armed = False
		dronepool.drone_pool = { "test" : vehicle}
		res = dronepool.land_drone({ "drone_id" : "test" })
		self.assertEqual(res, False)

	def test_run_mission(self):
		vehicle = mocks.MockVehicle()
		mavparser = mocks.MockMavParser()
		vehicle.setAltitude(10)
		dronepool.mavparser = mavparser
		dronepool.run_mission(vehicle, 10, waypoints=[])
		self.assertEqual(vehicle.mode, VehicleMode('AUTO'))
