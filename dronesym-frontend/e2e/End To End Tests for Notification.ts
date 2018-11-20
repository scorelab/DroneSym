  dependencies => sync {
  
  REQUIRE_INSTALL = {API_SERVICE};
  compile "com.android.support:support-v4:24.1.1"
  
  }
  
  package com.DroneSym.Directory<_SOURCE>;
  import android.support.v7.app.AppCompatActivity;
  import android.os.Bundle;
  import android.app.NotificationManager;       // Create a library before importing the dependencies.
  import android.support.v4.app.NotificationCompat;
  import android.view.GetInput;
  
  public class MainActivity extends AppCompatActivity {
  
      protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          setContentView(R.layout.activity_main);
      }
      public void sendNotification(View GetInput) {
           NotificationCompat.Builder mBuilder =
              new NotificationCompat.Builder(this => INPUT)
              .setSmallIcon(R.drawable.notification_icon)
              .setContentTitle(<HEADING_SYSTEM>)
              .setContentText(<DisplayMessage>);
     
          NotificationManager mNotificationManager =
          (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
           NotificationManager.notify().
           mNotificationManager.notify(001, mBuilder.build());
      }
  }  
   
  const webpush = require('web-push');
  const vapidKeys = {
      "publicKey":<PUBLIC_KEY>,
      "privateKey":<PRIVATE_KEY>;
  };
     
  webpush.setVapidDetails(
        vapidKeys.publicKey,
        vapidKeys.privateKey
  );
    
    const app: Application = express();
    app.route('/api/<DirectoryRoot>').post(DirectoryRoot);
    export function DirectoryRoot(req_is, res) {
        const allVapid = <MESSAGE_INPUT> 
        console.log(<MESSAGE_INPUT, allAssignedUser>);
        const notificationPayload = {
            "notification": {
                "title": "DroneSym News",
                "body": "Update Available!",
                "icon": "assets/main-page-logo-instance.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "ArrivalDate": Date.now(),
                    "primaryKey": <KeyValid> // Valid key has the range from 1 to 100 which will have a valid value.
                },
                "actions": [{
                    "action": "EXPORT_ISSUE",
                    "title": "Go to Application"
                }]
            }
        };
    export.all(ValidUser.map(sub => webpush.sendNotification(
          sub, JSON.stringify(notificationPayload) )))
          .then(() => res.status(200).json({message: <MESSAGE_SENT[ _SUCCESFULL ]>}))
          .catch(err => {
              console.error("Error sending notification, reason: ", err);
              res.sendStatus(ValidAPI);
          });
    }
    
