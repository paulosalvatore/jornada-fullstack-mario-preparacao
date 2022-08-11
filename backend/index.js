const express = require('express');
const app = express();

app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello, World!');
});

app.get('/oi', function (req, res) {
  res.send('Olá, mundo!');
});

//

function getRandomInt() {
  return Math.floor(Math.random() * 100 + 1);
}

const scores = [
  { id: 1, name: 'Paulo Salvatore', score: 94 },
  { id: 2, name: 'Ana', score: 33 },
  { id: 3, name: 'Fernando', score: 65 },
  ...new Array(2).fill({}).map((score, id) => ({ id, name: `Pessoa ${id}`, score: getRandomInt() })),
];

app.get('/scores', function (req, res) {
  let orderedScores = scores
    .filter(Boolean)
    .sort(((a, b) => b.score - a.score));

  const limit = +req.query.limit;
  const name = req.query.name;

  if (limit) {
    orderedScores = orderedScores.splice(0, limit);
  }

  if (name) {
    orderedScores = orderedScores.filter(score => score.name.includes(name));
  }

  res.send(orderedScores);
});

app.post('/scores', function (req, res) {
  const newScore = req.body;

  if (!newScore || !newScore.name || !newScore.score) {
    res.status(400).send({ message: `Certifique-se de que está enviando 'name' e 'score'.` });
    return;
  }

  const scoreToAdd = {
    id: scores.length + 1,
    name: newScore.name,
    score: newScore.score,
  };

  scores.push(scoreToAdd);

  res.send({
    message: 'Score registrado com sucesso.',
    result: scoreToAdd,
  });
});

app.delete('/scores', function (req, res) {
  scores.length = 0;

  res.send({ message: 'Scores foram limpos com sucesso.' });
});

app.delete('/scores/:id', function (req, res) {
  const id = +req.params.id;

  if (!id) {
    res.status(400).send({ message: `Nenhum ID foi informado.` });
    return;
  }

  const scoreIndex = scores.findIndex(score => score.id === id);
  delete scores[scoreIndex];

  res.send({ message: 'Scores foram limpos com sucesso.' });
});

app.put('/scores/:id', function (req, res) {
  const id = +req.params.id;

  if (!id) {
    res.status(400).send({ message: `Nenhum ID foi informado.` });
  }

  const scoreIndex = scores.findIndex(score => score.id === id);

  if (scoreIndex === -1) {
    res.status(404).send({ message: `Nenhum score foi encontrado para o ID ${id}.` });
  }

  const newScore = req.body;

  if (!newScore) {
    res.status(400).send({ message: `Certifique-se de que está enviando 'name' ou 'score'.` });
    return;
  }

  const oldScore = scores[scoreIndex];

  scores[scoreIndex] = {
    id: oldScore.id,
    name: newScore.name,
    score: newScore.score,
  };

  res.send({ message: 'Score atualizado com sucesso.' });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
