import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [voted, setVoted] = useState(Array(anecdotes.length).fill(0));

  const nextClick = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomNumber);
  };

  const voteClick = () => {
    const newVotes = [...voted];
    newVotes[selected] += 1;
    setVoted(newVotes);
  };

  const max = Math.max(...voted);
  const index = voted.indexOf(max);

  return (
    <div>
      <Title title="Anecdote of the day" />
      <Anecdotes anecdotes={anecdotes[selected]} votes={voted[selected]} />
      <Button handleClick={voteClick} text="Vote" />
      <Button handleClick={nextClick} text="Next Anecdote" />
      <Title title="Anecdote with most votes" />
      <MostVotes anecdotes={anecdotes[index]} max={max} />
    </div>
  );
};

const Title = ({ title }) => {
  return <h1>{title}</h1>;
};

const Anecdotes = ({ anecdotes, votes }) => {
  return (
    <div>
      <p>{anecdotes}</p>
      <p>Has {votes} votes</p>
    </div>
  );
};

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const MostVotes = ({ anecdotes, max }) => {
  return (
    <div>
      <p>{anecdotes}</p>
      <p>Has {max} votes</p>
    </div>
  );
};

export default App;
