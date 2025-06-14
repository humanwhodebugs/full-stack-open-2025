import AnecdoteFilter from "./AnecdoteFilter";
import AnecdoteForm from "./AnecdoteForm";
import AnecdoteList from "./AnecdoteList";

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
