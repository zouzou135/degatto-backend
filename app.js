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
XLSX = require("xlsx");

var file_buffer = null;
var file = null;
var file_base64 = null;

app.post("/process-data", function (req, res) {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn("python3", ["sentiment_code.py"]);
  const pythonProcessMaterial = spawn("python3", ["material_code.py"]);
  const pythonProcessComfort = spawn("python3", ["comfort_code.py"]);
  const pythonProcessDesign = spawn("python3", ["design_code.py"]);
  const pythonProcessSize = spawn("python3", ["size_code.py"]);

  var sentiment_data = [];
  pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        sentiment_data = JSON.parse(data.toString());
      }
    }
  });

  var material_data = [];
  pythonProcessMaterial.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        material_data = JSON.parse(data.toString());
      }
    }
  });

  var comfort_data = [];
  pythonProcessComfort.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        comfort_data = JSON.parse(data.toString());
      }
    }
  });

  var design_data = [];
  pythonProcessDesign.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        design_data = JSON.parse(data.toString());
      }
    }
  });

  var size_data = [];
  pythonProcessSize.stdout.on("data", (data) => {
    console.log(data.toString());
    if (data.toString() != "") {
      if (data.toString()[0] == "[") {
        size_data = JSON.parse(data.toString());
      }
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    // console.log("fail", data.toString());
    // res.send({
    //   success: false,
    // });
  });

  var sentenceDone = false;
  var materialDone = false;
  var comfortDone = false;
  var designDone = false;
  var sizeDone = false;

  pythonProcessSize.on("exit", (code) => {
    console.log("exit Size", code);
    if (code == 0) {
      sizeDone = true;

      if (
        sentenceDone &&
        materialDone &&
        comfortDone &&
        designDone &&
        sizeDone
      ) {
        res.send({
          success: true,
          sentiment_data: sentiment_data,
          material_data: material_data,
          comfort_data: comfort_data,
          design_data: design_data,
          size_data: size_data,
        });
      }
    } else {
      res.send({
        success: false,
      });
    }
  });

  pythonProcessDesign.on("exit", (code) => {
    console.log("exit Design", code);
    if (code == 0) {
      designDone = true;

      if (
        sentenceDone &&
        materialDone &&
        comfortDone &&
        designDone &&
        sizeDone
      ) {
        res.send({
          success: true,
          sentiment_data: sentiment_data,
          material_data: material_data,
          comfort_data: comfort_data,
          design_data: design_data,
          size_data: size_data,
        });
      }
    } else {
      res.send({
        success: false,
      });
    }
  });

  pythonProcessComfort.on("exit", (code) => {
    console.log("exit Comfort", code);
    if (code == 0) {
      comfortDone = true;

      if (
        sentenceDone &&
        materialDone &&
        comfortDone &&
        designDone &&
        sizeDone
      ) {
        res.send({
          success: true,
          sentiment_data: sentiment_data,
          material_data: material_data,
          comfort_data: comfort_data,
          design_data: design_data,
          size_data: size_data,
        });
      }
    } else {
      res.send({
        success: false,
      });
    }
  });

  pythonProcessMaterial.on("exit", (code) => {
    console.log("exit Material", code);
    if (code == 0) {
      materialDone = true;

      if (
        sentenceDone &&
        materialDone &&
        comfortDone &&
        designDone &&
        sizeDone
      ) {
        res.send({
          success: true,
          sentiment_data: sentiment_data,
          material_data: material_data,
          comfort_data: comfort_data,
          design_data: design_data,
          size_data: size_data,
        });
      }
    } else {
      res.send({
        success: false,
      });
    }
  });

  pythonProcess.on("exit", (code) => {
    console.log("exit", code);
    if (code == 0) {
      sentenceDone = true;

      if (
        sentenceDone &&
        materialDone &&
        comfortDone &&
        designDone &&
        sizeDone
      ) {
        res.send({
          success: true,
          sentiment_data: sentiment_data,
          material_data: material_data,
          comfort_data: comfort_data,
          design_data: design_data,
          size_data: size_data,
        });
      }
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

  if (file.name.endsWith("xlsx")) {
    fs.writeFile("test.xlsx", file_base64, "base64", function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
        const workBook = XLSX.readFile("test.xlsx");
        XLSX.writeFile(workBook, "test.csv", { bookType: "csv" });
      }
    });
  } else {
    fs.writeFile("test.csv", file_base64, "base64", function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });
  }

  const fileName = file.name;
  res.send({
    success: true,
  });
});

// what port to run server on`
app.listen(3001, function () {
  console.log("server started on port 3001");
});

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
