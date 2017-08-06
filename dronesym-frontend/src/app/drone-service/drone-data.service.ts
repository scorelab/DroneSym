import { Injectable } from '@angular/core';
import { AuthHttpService } from '../auth-http/auth-http.service';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class DroneDataService {

  private baseUrl: string;
  feed: any;

  constructor(private http: AuthHttpService) {
    this.baseUrl = environment.nodeApiURL;
  }

  public createDrone(name: string, location: any): Promise<any>{
    return this.http.post(`${this.baseUrl}/create`, { 'location' : location, 'name' : name})
        .map((res) => res.json())
        .toPromise();
  }

  public getDroneFeed(): Observable<any>{
    let feedObservable = new Observable((observer) => {
        this.feed = io(environment.feedURL);

        this.feed.on('SOCK_FEED_UPDATE', (data) => {
          observer.next(data);
        });

        return () => {
          this.feed.disconnect();
        }
    });

    return feedObservable;
  }

  public updateDroneWaypoints(droneId: string, waypoints: [any]){
    return this.http.post(`${this.baseUrl}/update/waypoints/${droneId}`, { 'waypoints': waypoints})
        .map((res) => res.json())
        .toPromise();
  }

  public takeOffDrone(droneId: string, waypoints: [any]){
    return this.http.post(`${this.baseUrl}/takeoff/${droneId}`, {'waypoints': waypoints})
           .map((res) => res.json())
           .toPromise();
  }

  public landDrone(droneId: string){
    return this.http.post(`${this.baseUrl}/land/${droneId}`, {})
              .map((res) => res.json())
              .toPromise();
  }

  public resumeFlight(droneId: string){
    return this.http.post(`${this.baseUrl}/resume/${droneId}`, {})
               .map((res) => res.json())
               .toPromise();
  }

}
