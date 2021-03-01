require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser"); //
const request = require("request");
const https = require("https");

//Mailchimp Key
const key = process.env.API_KEY;
// const mailchimpClient = require("mailchimp_transactional")("YOUR_API_KEY");
var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp(api_key);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
// app.use(express.json());//insted of require("body-parser") we can use it to parse json and get data from req.body


// Landing SignUpPage
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
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/2cbf90dd8e";
  const options = {
    method: "POST",
    auth: `alex:${key}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      // console.log("our data --->", JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// Try Again Button Funcionality
app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server started on port 3000!!");
});
