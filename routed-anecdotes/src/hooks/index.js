import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        reset
    }
}

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then(data => setAnecdotes(data))
    }, [])

    const addNew = (anecdote) => {
        anecdoteService.createNew(anecdote).then(data => setAnecdotes([...anecdotes, data]))
    }

    const remove = (id) => {
        anecdoteService.remove(id).then(() => {
            setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== id))
        })
    }

    return {
        anecdotes,
        addNew,
        remove
    }
}