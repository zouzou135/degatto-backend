var express = require("express");
var app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());

app.post("/process-data", function (req, res) {
  setTimeout(function () {
    res.send({
      success: true,
    });
  }, 3000);
});

// what port to run server on
app.listen(3001, function () {
  console.log("server started on port 3001");
});
