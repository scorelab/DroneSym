import { Injectable } from '@angular/core';
import { AuthHttpService } from '../auth-http/auth-http.service';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DroneDataService {

  private baseUrl: string;
  private drones: any;
  private droneObserver: any;

  feed: any;

  constructor(private http: AuthHttpService) {
    this.baseUrl = environment.nodeApiURL;
    this.drones = [];
  }

  public createDrone(name: string, description: string, flying_time: string, location: any): Promise<any> {
    return this.http.post(`${this.baseUrl}/create`,
    { 'location' : location, 'name' : name, 'description': description, 'flying_time': flying_time})
        .pipe(map((res) => res.json()))
        .toPromise();
  }

  public removeDrone(droneId: string, droneStatus: string) {
    return this.http.post(`${this.baseUrl}/remove/${droneId}`, { 'status' : droneStatus })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public getDroneFeed(): Observable<any> {
    const feedObservable = new Observable((observer) => {
        const token = localStorage.getItem('token').slice(4);
        this.feed = io(environment.feedURL, { 'query' : `token=${token}`});
        this.droneObserver = observer;

        this.feed.on('SOCK_FEED_UPDATE', (data) => {
          // console.log(data);
          this.drones = data;
          observer.next(this.drones);
        });

        return () => {
          this.feed.disconnect();
        };
    });

    return feedObservable;
  }

  public updateDroneWaypoints(droneId: string, waypoints: [any]) {
    return this.http.post(`${this.baseUrl}/update/waypoints/${droneId}`, { 'waypoints': waypoints})
        .pipe(map((res) => res.json()))
        .toPromise();
  }

  public takeOffDrone(droneId: string, waypoints: [any]) {
    return this.http.post(`${this.baseUrl}/takeoff/${droneId}`, {'waypoints': waypoints})
           .pipe(map((res) => res.json()))
           .toPromise();
  }

  public landDrone(droneId: string) {
    return this.http.post(`${this.baseUrl}/land/${droneId}`, {})
              .pipe(map((res) => res.json()))
              .toPromise();
  }

  public resumeFlight(droneId: string) {
    return this.http.post(`${this.baseUrl}/resume/${droneId}`, {})
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public createGroup(name: string) {
    return this.http.post(`${this.baseUrl}/groups/create`, { 'name' : name })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public getGroups() {
    return this.http.get(`${this.baseUrl}/groups`)
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public addToGroup(groupId: string, drones: [string]) {
    return this.http.post(`${this.baseUrl}/groups/${groupId}/add`, { 'drones' : drones })
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public removeFromGroup(groupId: string, droneId: string) {
    return this.http.post(`${this.baseUrl}/groups/${groupId}/remove/${droneId}`, {})
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public removeGroup(groupId: string) {
    return this.http.post(`${this.baseUrl}/groups/remove/${groupId}`, {})
               .pipe(map((res) => res.json()))
               .toPromise();
  }

  public updateName(droneId: string, newName: string) {
    return this.http.post(`${this.baseUrl}/update/${droneId}`, { 'name' : newName })
               .pipe(map((res) => res.json()))
               .toPromise();
  }
}
