var express = require("express");
var bodyParser = require("body-parser");

var { ObjectID } = require("mongodb");
var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos
app.post("/todos", (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

// GET /todos
app.get("/todos", (req, res) => {
  Todo.find({}).then(
    (todos) => {
      res.send({
        todos
      });
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  Todo.findById(id).then(
    (todo) => {
      if (todo) {
        res.send({todo});
      } else {
        res.status(404).send();
      }
    },
    (e) => {
      res.status(400).send(e);
    }
  );
});

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}.`);
});

module.exports = { app };
