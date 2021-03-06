const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Persons = require("./model/personData");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

let db = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/persons", (req, res) => {
  Persons.find({}).then((person) => {
    res.json(person);
  });
  // res.json(db);
});

// app.get("/info", (req, res) => {
//   res.send(
//     `<p>Phonebook has a length for ${db.length} people <br> ${new Date()}</p>`
//   );
// });

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  // const person = db.find((person) => person.id === id);
  // person ? res.json(person) : res.status(404).end();
  Persons.findById(id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  // const persons = db.filter((person) => person.id !== id);
  // //   console.log(persons);
  // res.status(204).end();
  Persons.findByIdAndRemove(id).then((person) => {
    res.status(204).end();
  });
});

app.post("/api/persons", (request, res) => {
  const body = request.body;

  if (!body.name || !body.number) {
    res.status(404).json({
      error: "content missing",
    });
  } else if (db.find((person) => person.name === body.name)) {
    res.status(404).json({
      error: `${body.name} is already added.`,
    });
  }

  // const newPerson = {
  //   name: body.name,
  //   number: body.number,
  //   id: Math.floor(Math.random() * 100),
  // };

  const newPerson = new Persons({
    name: body.name,
    number: body.number,
  });

  // db = db.concat(newPerson);
  // //   console.log(body);
  // res.json(body);
  newPerson.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put("/api/person/:id", (req, res) => {
  const body = request.body;
  const update = {
    name: body.name,
    number: body.number,
  };

  Persons.findByIdAndUpdate(req.params.id, update, { new: true })
    .then((updatedInfo) => {
      res.json(updatedInfo);
    })
    .catch((error) => console.log(error.message));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
