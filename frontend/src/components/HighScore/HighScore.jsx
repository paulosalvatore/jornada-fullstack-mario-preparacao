import "./HighScore.css";

export default function HighScore() {
  const scores = [
    { name: "Paulo", score: 90 },
    { name: "Ana", score: 30 },
    { name: "Julio", score: 20 },
  ];

  function onSubmit(event) {
    event.preventDefault();

    alert("Score sent successfully!");
  }

  return (
    <div className="high-score">
      <div className="title">Congratulations!</div>

      <div className="result">You made 90 points.</div>

      <div className="title">High Scores</div>

      <div className="body">
        {scores.map((item, index) => (
          <div key={`score_${index}`} className="high-score-item">
            {item.name} - {item.score}
          </div>
        ))}
      </div>

      <div className="new-score">
        <div className="title">Submit your score!</div>

        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Your name..." />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}
