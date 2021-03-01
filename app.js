const express = require("express");
const bodyParser = require("body-parser"); // 
const request = require("request");
const https = require('https');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
// app.use(express.json());//insted of require("body-parser") we can use it to parse json and get data from req.body

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});



// Catch user input and render weather data
app.post("/", function (req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const userEmail = req.body.userEmail;

  const data = {
      members: [
          {
             email_address:  userEmail,
             status: "subscribed",
             merge_fields: {
                 FNAME: firstName,
                 LNAME: lastName
             }
          }
      ]
  };
    
  const jsonData = JSON.stringify(data);

  const url = 'https://us1.api.mailchimp.com/3.0/lists/2cbf90dd8e'
  const options = {
      method: "POST",
      auth: "alex:aaa3cab18d031cbfbc55ab721701b61b-us1"
  }

   const request = https.request(url, options, function (response){
       response.on("data", function(data){
           console.log('our data --->', JSON.parse(data));
           
       })
   })
  
   request.write(jsonData);
   request.end();
  
});


app.listen(3000, function () {
console.log("Server started on port 3000!!");
});
  