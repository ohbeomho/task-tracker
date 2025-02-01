import { useReducer } from 'react'

type Task = {
  id: string
  text: string
}

type TaskAction = {
  type: 'add' | 'remove' | 'mark'
  id?: string
  text?: string
  done?: boolean
}

function tasksReducer(tasks: Task[], action: TaskAction) {
  let updated: Task[]

  switch (action.type) {
    case 'add':
      updated = [...tasks, { id: crypto.randomUUID(), text: action.text! }]
      break
    case 'remove':
      updated = tasks.filter((task) => task.id !== action.id!)
      break
    case 'mark':
      updated = tasks.map((task) =>
        task.id === action.id! ? { ...task, done: action.done! } : task,
      )
  }

  localStorage.setItem('tasks', JSON.stringify(updated))
  return updated
}

function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, [])

  return <></>
}

export default App
