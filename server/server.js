require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

const { ObjectID } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos
app.post("/todos", (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then((doc) => {
      return res.send(doc);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// GET /todos
app.get("/todos", (req, res) => {
  Todo.find({})
    .then((todos) => {
      return res.send({ todos });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// DELETE /todos/:id
app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// PATCH /todos/:id
app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  var body = _.pick(req.body, ["text", "completed"]);
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// POST /users
app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  var user = new User(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      return res.header("x-auth", token).send(user);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

// LISTEN
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}.`);
});

module.exports = { app };
