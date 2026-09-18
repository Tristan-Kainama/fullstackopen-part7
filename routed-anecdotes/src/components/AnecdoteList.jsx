import { useAnecdotes } from "../hooks/index"

const AnecdoteList = () => {
  const { anecdotes, remove } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => 
        <li key={anecdote.id}>
          {anecdote.content} <button onClick={() => remove(anecdote.id)}>remove</button>
        </li>)}
      </ul>
    </div>
  )
}

export default AnecdoteList
