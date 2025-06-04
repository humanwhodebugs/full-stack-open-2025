const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};
console.log(asObject);

const initialState = anecdotesAtStart.map(asObject);
console.log(initialState);

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "VOTE": {
      const id = action.payload.id;
      return state.map((anecdote) =>
        anecdote.id === id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote,
      );
    }
    case "MAKE_ANECDOTE":
      return [...state, action.payload];
  }

  return state;
};

export const makeVote = (id) => {
  return {
    type: "VOTE",
    payload: { id },
  };
};
console.log(makeVote);

export const makeAnecdote = (content) => {
  return {
    type: "MAKE_ANECDOTE",
    payload: { content, id: getId(), votes: 0 },
  };
};
console.log(makeAnecdote);

export const getFilteredAnecdotes = (state) => {
  const filter = state.filter.toLowerCase();
  return state.anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter),
  );
};
console.log(getFilteredAnecdotes);

export default anecdoteReducer;
