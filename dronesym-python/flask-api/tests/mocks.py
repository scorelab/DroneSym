from dronekit import VehicleMode

class MockVehicle:
	class Commands:
		def __init__(self):
			self.cmds = []

		def wait_ready(self):
			return True

		def clear(self):
			return True

	def __init__(self):
		self.mode = VehicleMode('GUIDED')
		self.armed = False
		self.commands = self.Commands()
