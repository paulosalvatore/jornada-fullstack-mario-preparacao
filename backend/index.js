const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "jornada-fullstack-preparacao";

async function main() {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  const collection = db.collection("scores");

  const app = express();

  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello, World!");
  });

  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  //

  // function getRandomInt() {
  //   return Math.floor(Math.random() * 100 + 1);
  // }

  // const scores = [
  //   { id: 1, name: "Paulo Salvatore", score: 94 },
  //   { id: 2, name: "Ana", score: 33 },
  //   { id: 3, name: "Fernando", score: 65 },
  //   ...new Array(2).fill({}).map((score, id) => ({
  //     id,
  //     name: `Pessoa ${id}`,
  //     score: getRandomInt(),
  //   })),
  // ];

  app.get("/scores", async function (req, res) {
    // let orderedScores = scores
    //   .filter(Boolean)
    //   .sort((a, b) => b.score - a.score);
    //
    // const limit = +req.query.limit;
    // const name = req.query.name;
    //
    // if (limit) {
    //   orderedScores = orderedScores.splice(0, limit);
    // }
    //
    // if (name) {
    //   orderedScores = orderedScores.filter((score) =>
    //     score.name.includes(name)
    //   );
    // }

    const filter = req.query.name ? { name: { $regex: req.query.name } } : {};

    const orderedScores = await collection
      .find(filter)
      .sort({ score: -1 })
      .limit(+req.query.limit)
      .toArray();

    res.send(orderedScores);
  });

  app.post("/scores", async function (req, res) {
    const newScore = req.body;

    if (!newScore || !newScore.name || !newScore.score) {
      res.status(400).send({
        message: `Certifique-se de que está enviando 'name' e 'score'.`,
      });
      return;
    }

    const scoreToAdd = {
      // id: scores.length + 1,
      name: newScore.name,
      score: newScore.score,
    };

    // scores.push(scoreToAdd);

    await collection.insertOne(scoreToAdd);

    res.send({
      message: "Score registrado com sucesso.",
      result: scoreToAdd,
    });
  });

  app.delete("/scores", async function (req, res) {
    // scores.length = 0;

    await collection.deleteMany({});

    res.send({ message: "Scores foram limpos com sucesso." });
  });

  app.delete("/scores/:id", async function (req, res) {
    const id = req.params.id;

    if (!id) {
      res.status(400).send({ message: `Nenhum ID foi informado.` });
      return;
    }

    await collection.deleteOne({ _id: new ObjectId(id) });

    // const scoreIndex = scores.findIndex((score) => score.id === id);
    // delete scores[scoreIndex];

    res.send({ message: "Score removido com sucesso." });
  });

  app.put("/scores/:id", async function (req, res) {
    const id = +req.params.id;

    if (!id) {
      res.status(400).send({ message: `Nenhum ID foi informado.` });
    }

    // const scoreIndex = scores.findIndex((score) => score.id === id);

    const isScoreFound =
      (await collection.countDocuments({
        _id: new ObjectId(id),
      })) > 0;

    if (!isScoreFound) {
      res
        .status(404)
        .send({ message: `Nenhum score foi encontrado para o ID ${id}.` });
    }

    const newScore = req.body;

    if (!newScore) {
      res.status(400).send({
        message: `Certifique-se de que está enviando 'name' ou 'score'.`,
      });
      return;
    }

    // const oldScore = scores[scoreIndex];

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: newScore.name,
          score: newScore.score,
        },
      }
    );

    // scores[scoreIndex] = {
    //   id: oldScore.id,
    //   name: newScore.name,
    //   score: newScore.score,
    // };

    res.send({ message: "Score atualizado com sucesso." });
  });

  app.listen(3000, () =>
    console.log("Servidor rodando em http://localhost:3000")
  );
}

main();
