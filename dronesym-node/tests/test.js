var https = require("http")


try{
var request = https.get({host:"127.0.0.1:3000/feed"},function(response){
  console.log(response.statusCode); 
});

} catch(e) {

      console.error(e.message);
}