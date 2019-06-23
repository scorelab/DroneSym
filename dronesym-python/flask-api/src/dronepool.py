# DronePool module which handles interaction with SITLs

from dronekit import Vehicle, VehicleMode, connect
from dronekit_sitl import SITL
from threading import Lock
import node
import time
import mavparser
import threadrunner
import tempfile

drone_pool = {}
instance_count = 0
env_test = False

q = None
mq = None
lock = Lock()


class Sim(SITL, object):
    def __init__(self, instance=1, home=None):
        super(Sim, self).download("copter", "3.3", verbose=True)
        self.instance = instance
        #Look here
        # self.wd = None
        self.defaults_filepath = None
        self.gdb = False
        self.valgrind =None

        if home:
            self.home = home
        else:
            self.home = {"lat": 6.9271, "lon": 79.8612, "alt": 1}

        self.p = None
        return

    def connection_string(self):
        return super(Sim, self).connection_string()[:-4] + str(5760 + self.instance * 10)

    def launch(self):
        home_str = str(self.home['lat']) + ',' + str(self.home['lon']) + ',0,353'
        wd = tempfile.mkdtemp()
        super(Sim, self).launch(["--instance", str(self.instance), "--home", home_str], await_ready=True, verbose=True,wd=wd)
#         home_str = str(self.home['lat']) + ',' + \
# str(self.home['lon']) + ',0,353'
#         super(Sim,self).launch(["--instance",
#                             str(self.instance),
#                             "--home",
#                             home_str],
#                            await_ready=True,
#                            verbose=not env_test,
#                            wd=None)

    def get_sitl_status(self):
        return {'id': self.instance, 'home': self.home}


def initialize():
    global q, mq, instance_count
    q = threadrunner.q
    mq = threadrunner.mq
    drones = node.get_drones()['drones']

    if not drones:
        return

    for drone_id in drones:
        if drone_id not in list(drone_pool.keys()):
            drone = node.get_drone_by_id(drone_id)
            location = drone[0]['location']
            q.put((create_new_drone, {"db_key": drone_id, "home": location}))

            if 'status' in list(drone[0].keys()) and drone[0]['status'] == 'FLYING':
                q.put((resume_flight, {"drone_id": drone_id}))


def resume_flight(kwargs):
    drone_id = kwargs.get("drone_id", None)
    drone = node.get_drone_by_id(drone_id)

    waypoints = []

    for wp in sorted(drone['waypoints']):
        waypoints.append(drone['waypoints'][wp])

    next_waypoint = waypoints.index(drone['waypoint'])
    print(next_waypoint)

    q.put((takeoff_drone, {"drone_id": drone_id,"waypoints": waypoints[next_waypoint:]}))


def create_new_drone(kwargs):
    global instance_count
    instance_count += 1
    home = kwargs.get("home", None)
    db_key = kwargs.get("db_key", None)
    retries = 3

    drone = Sim(instance_count, home)
    drone.launch()

    while retries > 0:
        try:
            #drone_conn = connect(drone.connection_string(), wait_ready=True)
            drone_conn = connect('tcp:127.0.0.1:5780', wait_ready=True)
            drone_conn.wait_ready(True, timeout=300)
            break
        except BaseException:
            print("Retrying...")
            retries -= 1

    drone_pool[db_key] = drone_conn

    res = {"status": "OK", "id": db_key}
    return res


def remove_drone(kwargs):
    drone_id = kwargs.get("drone_id", None)
    if drone_id not in drone_pool:
        return {"status": "ERROR", "msg": "Drone instance not found"}

    drone = drone_pool[drone_id]

    if drone.mode == VehicleMode('AUTO'):
        return {"status": "ERROR", "msg": "Drone in operation"}

    del drone_pool[drone_id]

    return {"status": "OK", "id": drone_id}


def run_mission(drone, target_height, waypoints):
    while True:
        print(("Reaching target alt : " +
               str(drone.location.global_relative_frame.alt)))
        if drone.location.global_relative_frame.alt >= target_height * 0.9:
            break

    print('target alt reached')

    mavparser.create_mission(drone, waypoints)
    print('mission acquired')

    drone.mode = VehicleMode('AUTO')
    print('initiating sequence')

    print('in mission')


def attach_listener(kwargs):
    attr = kwargs.get('attr', None)
    fn = kwargs.get('fn', None)
    attach_fn = kwargs.get('attach_fn', None)

    if fn is not None and attr is not None and attach_fn is not None:
        attach_fn(attr, fn)


def takeoff_drone(kwargs):
    global q

    drone_id = kwargs.get("drone_id", None)
    target_height = kwargs.get("target_height", 10)
    waypoints = kwargs.get("waypoints", None)
    print(drone_pool)
    print(waypoints)
    try:
        drone = drone_pool[drone_id]
    except BaseException:
        raise

    drone.initialize()

    drone.mode = VehicleMode('GUIDED')
    drone.armed = True

    while not drone.armed:
        time.sleep(1)

    drone.simple_takeoff(target_height)

    print(waypoints)

    if waypoints:
        run_mission(drone, target_height, waypoints)

    def detach_event_listeners(drone, value, status):
        drone.remove_attribute_listener('location', update_location)
        drone.remove_attribute_listener('airspeed', update_airspeed)
        drone.remove_attribute_listener('attitude', udpate_attitude)
        drone.remove_attribute_listener('heading', update_heading)
        node.update_drone(drone_id,
                          {"location": {"lat": value.global_relative_frame.lat,
                                        "lon": value.global_relative_frame.lon,
                                        "alt": value.global_relative_frame.alt},
                           "status": status})
        return

    def update_location(self, attr_name, value):

        node.update_drone(drone_id,
                          {"location": {"lat": value.global_relative_frame.lat,
                                        "lon": value.global_relative_frame.lon,
                                        "alt": value.global_relative_frame.alt},
                           "status": "FLYING"})

        command_len = len(drone.commands)
        wp_len = len(waypoints)

        if command_len >= wp_len:
            diff = command_len - wp_len
            next_wp = max(drone.commands.__next__ - diff, 0) % len(waypoints)
            waypoint = waypoints[next_wp]
            # print "df: " + `diff`
            # print next_wp
            node.update_drone(drone_id, {"waypoint": waypoint})

        if drone.mode == VehicleMode(
                'LAND') and drone.location.global_relative_frame.alt <= 0.1:
            detach_event_listeners(drone, value, "HALTED")
            return

        if drone.commands.__next__ == len(drone.commands):
            detach_event_listeners(drone, value, "FINISHED")
            return

    def update_airspeed(self, attr_name, value):
        node.update_drone(drone_id, {"airspeed": value})

    def udpate_attitude(self, attr_name, value):
        node.update_drone(
            drone_id, {
                "pitch": value.pitch, 'roll': value.roll, 'yaw': value.yaw})

    def update_heading(self, attr_name, value):
        node.update_drone(drone_id, {"heading": value})

    mq.put((attach_listener,
            {"attach_fn": drone.add_attribute_listener,
             "attr": 'location',
             "fn": update_location}))
    mq.put((attach_listener,
            {"attach_fn": drone.add_attribute_listener,
             "attr": 'airspeed',
             "fn": update_airspeed}))
    mq.put((attach_listener,
            {"attach_fn": drone.add_attribute_listener,
             "attr": 'attitude',
             "fn": udpate_attitude}))
    mq.put((attach_listener,
            {"attach_fn": drone.add_attribute_listener,
             "attr": 'heading',
             "fn": update_heading}))

    print('took off')

    return True


def land_drone(kwargs):
    drone_id = kwargs.get("drone_id", None)
    try:
        drone = drone_pool[drone_id]
    except BaseException:
        raise

    if not drone.armed:
        return False

    cmds = drone.commands
    cmds.wait_ready()
    cmds.clear()

    drone.mode = VehicleMode('LAND')
    print((drone.mode))
    return True
