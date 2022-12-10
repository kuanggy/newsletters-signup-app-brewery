const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const fname = req.body.floatingFname;
    const lname = req.body.floatingLname;
    const email = req.body.floatingEmail
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
            }
        }]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/3b500ba5c3";
    const option = {
        method: "POST",
        auth: "Kuang:apikey"
    };

    const request = https.request(url, option, (response) => {
        console.log(response.statusCode)
        response.on("data", (data) => {
            var endpoint = req.protocol + "://" + req.hostname + ":" + port;
            if (response.statusCode === 200) {
                var successUrl = endpoint + "/success";
                res.redirect(successUrl);
            } else {
                var failureUrl = endpoint + "/failure";
                res.redirect(failureUrl);
            }
        });
    });
    request.write(jsonData);
    request.end();
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/failure", (req, res) => {
    res.sendFile(__dirname + "/failure.html");
});

app.listen(port, () => {
    console.log("server start at port localhost:3000");
});
