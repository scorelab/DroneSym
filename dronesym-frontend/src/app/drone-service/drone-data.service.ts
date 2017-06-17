import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

@Injectable()
export class DroneDataService {

  constructor(private db: AngularFireDatabase) { }

  public getDronesList(): FirebaseListObservable<any[]>{
    return this.db.list('/drones');
  }

}
