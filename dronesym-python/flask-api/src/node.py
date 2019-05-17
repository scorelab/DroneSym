from __future__ import print_function
import json
import time
import requests


apiUrl = 'http://localhost:3000/dronesym/api/node'


def update_drone(id, status):
    try:
        response = requests.post(
            apiUrl + '/update/' + str(id),
            json=status,
            headers={
                'Content-Type': 'application/json'})
        return response.json()
    except requests.ConnectionError:
        print("Retrying...")
        time.sleep(0.1)
        return update_drone(id, status)


def get_drone_by_id(id):
    try:
        response = requests.get(apiUrl + '/get/' + id)
        return response.json()
    except requests.ConnectionError:
        print("Retrying...")
        time.sleep(1)
        return get_drone_by_id(id)


def get_drones():
    try:
        response = requests.get(apiUrl + '/get')
        return response.json()
    except requests.ConnectionError:
        print("Retrying...")
        time.sleep(1)
        return get_drones()
