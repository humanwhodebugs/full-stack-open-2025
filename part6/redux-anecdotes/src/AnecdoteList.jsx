import { useDispatch, useSelector } from "react-redux";
import { makeVote } from "./reducers/anecdoteReducer";
import { getFilteredAnecdotes } from "./reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => getFilteredAnecdotes(state));
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(makeVote(id));
  };

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes) // Menjaga urutan berdasarkan jumlah votes
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              Has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>Vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
