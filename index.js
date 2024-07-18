const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :info')
);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const time = new Date();
  res.send(
    `<p>PhoneBook has info for ${
      persons.length
    } persons</p><p>${time.toString()}</p>`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else {
    res.statusMessage = 'Resource not founded in this server';
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.phone)
    return res.status(404).json({ error: 'content missing' });
  if (hasName(body.name))
    return res.status(404).json({ error: 'name must be unique' });
  const person = { id: generatedId(), name: body.name, number: body.number };
  persons = persons.concat(person);
  res.json(persons);
});

morgan.token('info', (req, res) => {
  const body = req.body;
  const method = req.method;
  const output =
    method === 'POST'
      ? JSON.stringify({ name: body.name, number: body.number })
      : null;
  return output;
});

const generatedId = () => Math.floor(Math.random() * 10000);
const hasName = (name) =>
  persons.find((person) => person.name.toLowerCase() === name.toLowerCase());

const PORT = 3001;
app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
