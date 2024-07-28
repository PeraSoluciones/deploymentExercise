require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :info')
);
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
  const time = new Date();
  Person.find({}).then((persons) => {
    res.send(
      `<p>PhoneBook has info for ${
        persons.length
      } persons</p><p>${time.toString()}</p>`
    );
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // res.status(204).end();
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', async (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number)
    return res.status(404).json({ error: 'content missing' });
  if (await hasName(body.name))
    return res.status(404).json({ error: 'name must be unique' });
  // const person = { id: generatedId(), name: body.name, number: body.number };
  // persons = persons.concat(person);
  const person = new Person({ name: body.name, number: body.number });
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

morgan.token('info', (req, res) => {
  const body = req.body;
  const method = req.method;
  const output =
    method === 'POST' || method === 'PUT'
      ? JSON.stringify({ name: body.name, number: body.number })
      : null;
  return output;
});

// const generatedId = () => Math.floor(Math.random() * 10000);
const hasName = async (name) => {
  const result = await Person.find({ name: name }).exec();
  return result.length;
};
// persons.find((person) => person.name.toLowerCase() === name.toLowerCase());

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError')
    return res.status(400).send({ error: 'maslformatted id' });
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
