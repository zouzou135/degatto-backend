var express = require("express");
var app = express();
app.set("view engine", "ejs");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());
app.use(fileUpload());
var fs = require("fs");

var file_buffer = null;
var file = null;
var file_base64 = null;

app.post("/process-data", function (req, res) {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn("python3", ["sentiment_code.py"]);

  var sentiment_data = [];
  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        sentiment_data = JSON.parse(data.toString());
      }
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    // console.log("fail", data.toString());
    // res.send({
    //   success: false,
    // });
  });

  pythonProcess.on("exit", (code) => {
    console.log("exit", code);
    if (code == 0) {
      res.send({
        success: true,
        sentiment_data: sentiment_data,
      });
    } else {
      res.send({
        success: false,
      });
    }
  });
});

app.post("/upload-file", function (req, res) {
  file = JSON.parse(JSON.stringify(req.files)).files;
  file_buffer = Buffer.from(file.data);
  file_base64 = file_buffer.toString("base64");

  fs.writeFile("test.csv", file_base64, "base64", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  const fileName = file.name;
  res.send({
    success: true,
  });
});

// what port to run server on`
app.listen(3001, function () {
  console.log("server started on port 3001");
});
