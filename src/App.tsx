import { useReducer } from 'react'
import Button from './components/Button.styled'
import Input from './components/Input.styled'
import { TaskList, TaskListItem } from './components/List.styled.tsx'
import Checkbox from './components/Checkbox.styled.tsx'

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

function getInitialTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]')
}

function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, getInitialTasks())

  return (
    <>
      <p>
        <Input placeholder="Enter your task here" />
        <Button>Add</Button>
      </p>
      <TaskList>
        <TaskListItem>
          <Checkbox id="test" />
          <label htmlFor="test">Test task</label>
          <Button>Remove</Button>
        </TaskListItem>
        <TaskListItem>
          <Checkbox id="test" />
          <label htmlFor="test">Test task</label>
          <Button>Remove</Button>
        </TaskListItem>
        <TaskListItem $done>
          <Checkbox id="test" />
          <label htmlFor="test">Test task</label>
          <Button>Remove</Button>
        </TaskListItem>
        <TaskListItem>
          <Checkbox id="test" />
          <label htmlFor="test">Test task</label>
          <Button>Remove</Button>
        </TaskListItem>
      </TaskList>
    </>
  )
}

export default App
