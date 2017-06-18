import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class DroneDataService {

  baseUrl: string;
  feed: any;

  constructor(private http: Http) {
    this.baseUrl = environment.nodeApiURL;
  }

  public createDrone(location: any): Promise<any>{
    return this.http.post(`${this.baseUrl}/create`, location)
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

}
