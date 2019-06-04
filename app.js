var ObjectID = require("bson-objectid");
var express = require("express");
var app = express();
var port = 3010;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise; mongoose.connect("mongodb://localhost:27017/task");


app.listen(port, () => {
  console.log("Server listening on port " + port);
});

var nameSchema = new mongoose.Schema({

  quizesLavel: { type: String, default: '' },
  Question: { type: String, default: '' },
  A: { type: String, default: '' },
  B: { type: String, default: '' },
  C: { type: String, default: '' },
  D: { type: String, default: '' },
  marks: { type: String, default: '' },
  correctAns: [{ type: String, default: '' }]
});

var quizes = mongoose.model("quizes", nameSchema);

app.post("/quizeQuestion", (req, res) => {
  var myData = new quizes(req.body);
  myData.save()
    .then(item => {
      res.send({ info: "item saved to database", data: item });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

app.get("/quizeList", (req, res) => {

  quizes.find().select({ quizesLavel: 1 })
    .then(item => {
      res.send({ info: "item saved to database", data: item });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

app.get("/question", (req, res) => {

  quizes.find()
    .then(item => {
      res.send({ info: "item saved to database", data: item });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

app.post("/submitQuestion", (req, res) => {
  var myData = req.body;
  let info = ""
  let marks
  quizes.findOne({ _id: myData._id })
    .then(item => {
      console.log("item",item);
      if (myData.correctAns.length == 1) {
        console.log("length",myData.correctAns.length);
        if (item.correctAns[0] == myData.correctAns[0]) {
          info = "Your Answer is correct you got" + item.marks;
          console.log("marks",item.marks);
        }

        else {
          console.log("marks",item.marks);
          marks = item.marks / 4;
          info = "You have selected wrong answer" + marks;
        }
      } else {
        if (myData.correctAns.length !== item.correctAns.length) {
          console.log("same length",myData.correctAns);
          marks = item.marks / 4;
          info = "You have selected wrong answer" + marks;
        } else if (myData.correctAns.length == item.correctAns.length) {
          console.log("same length",myData.correctAns);
          let sortedUserArray = myData.correctAns.sort();
          let sortCorrectArray = item.correctAns.sort();
          let count = 0
          sortedUserArray.forEach(element => {
            sortCorrectArray.forEach(item => {
              if (element == item) {
                count++
              }
            })
          });
          if (count == item.correctAns.length) {
            info = "You have selected wrong answer" + item.marks;
          }
        }
      }
      res.send({ info: info });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});