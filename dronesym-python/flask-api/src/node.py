import requests
import json

apiUrl = 'http://localhost:3000/dronesym/api/node'

def update_drone(id, status):
	response = requests.post(apiUrl + '/update/' + str(id), json=status, headers={ 'Content-Type' : 'application/json' })
	return response.json()

def get_drone_by_id(id):
	response = requests.get(apiUrl + '/get/' + id)
	return response.json()

def get_drones():
	response = requests.get(apiUrl + '/get')
	return response.json()