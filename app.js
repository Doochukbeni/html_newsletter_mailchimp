const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signUp.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/7b93d3c419";
  const options = {
    method: "POST",
    auth: "benjamin:99a31263178e0c3d5ff5dcdc64f0738b-us18",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");

      response.on("data", (data) => {
        console.log(JSON.parse(data));
      });
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3006, () => {
  console.log("server is connected on port 3006");
});

// api key
// 99a31263178e0c3d5ff5dcdc64f0738b-us18

// audience ID
// 7b93d3c419.
