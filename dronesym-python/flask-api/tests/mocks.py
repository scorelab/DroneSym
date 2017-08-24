from dronekit import VehicleMode

class MockVehicle:
	class Commands:
		def __init__(self):
			self.cmds = []

		def wait_ready(self):
			return True

		def clear(self):
			return True


	class Location:
		class GlobalRelativeFrame:
			def __init__(self):
				self.alt = 0

		def __init__(self):
			self.global_relative_frame = self.GlobalRelativeFrame()

		def setAltitude(self, altitude):
			self.global_relative_frame.alt = altitude

	def __init__(self):
		self.mode = VehicleMode('GUIDED')
		self.armed = False
		self.commands = self.Commands()
		self.location = self.Location()

	def setAltitude(self, altitude):
		self.location.setAltitude(altitude)

class MockMavParser:
	def __init__(self):
		pass

	def create_mission(self, drone, waypoints):
		return True