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
app.use(express.json());

var file_buffer = null;
var file = null;

app.post("/process-data", function (req, res) {
  console.log(file);
  setTimeout(function () {
    res.send({
      success: true,
    });
  }, 3000);
});

app.post("/upload-file", function (req, res) {
  file = req.files;
  file_buffer = file.data;
  const fileName = file.name;
  res.send({
    success: true,
  });
});

// what port to run server on`
app.listen(3001, function () {
  console.log("server started on port 3001");
});
