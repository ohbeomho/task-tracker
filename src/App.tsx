import { useCallback, useReducer, useState } from 'react'
import Button from './components/Button.styled'
import Input from './components/Input.styled'
import {
  TaskList,
  TaskListItem,
  TaskTextInput,
} from './components/List.styled.tsx'
import Checkbox from './components/Checkbox.styled.tsx'

type Task = {
  text: string
  done: boolean
}

type TaskAction = {
  type: 'add' | 'remove' | 'mark' | 'edit'
  task?: Task
  text?: string
  done?: boolean
}

function tasksReducer(tasks: Task[], action: TaskAction) {
  let updated: Task[]

  switch (action.type) {
    case 'add':
      updated = [...tasks, { text: action.text!, done: false }]
      break
    case 'remove':
      updated = tasks.filter((task) => task !== action.task!)
      break
    case 'mark':
      updated = tasks.map((task) =>
        task === action.task! ? { ...task, done: action.done! } : task,
      )
      break
    case 'edit':
      updated = tasks.map((task) =>
        task === action.task! ? { ...task, text: action.text! } : task,
      )
  }

  localStorage.setItem(
    'tasks',
    JSON.stringify(
      updated.sort((a, b) => {
        if (a.done && !b.done) return -1
        else if (b.done && !a.done) return 1
        return 0
      }),
    ),
  )
  return updated
}

function getInitialTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]')
}

function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, getInitialTasks())
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [text, setText] = useState('')
  const [editText, setEditText] = useState('')

  const removeTask = useCallback(
    (task: Task) => dispatch({ type: 'remove', task }),
    [],
  )
  const addTask = useCallback(() => {
    if (!text) return
    dispatch({ type: 'add', text })
    setText('')
  }, [text])
  const markTask = useCallback(
    (task: Task, done: boolean) =>
      dispatch({
        type: 'mark',
        task,
        done,
      }),
    [],
  )
  const editTask = useCallback(
    (task: Task) => {
      if (!editText || !editingTask) return
      dispatch({
        type: 'edit',
        task,
        text: editText,
      })
      setEditText('')
      setEditingTask(undefined)
    },
    [editingTask, editText],
  )

  return (
    <div className="container">
      <h1>
        {tasks.length} Task{tasks.length === 1 ? '' : 's'}
      </h1>
      <div style={{ display: 'flex' }}>
        <Input
          placeholder="Enter your task here"
          value={text}
          onInput={(e) => setText(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <TaskList>
        {tasks.length ? (
          tasks.map((task, idx) => (
            <TaskListItem key={idx} $done={task.done}>
              {editingTask === task ? (
                <TaskTextInput
                  defaultValue={task.text}
                  onInput={(e) => setEditText(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === 'Enter' && editTask(task)}
                  autoFocus
                />
              ) : (
                <div>{task.text}</div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Done:
                  <Checkbox
                    onChange={(e) => markTask(task, e.currentTarget.checked)}
                    checked={task.done}
                    disabled={editingTask !== undefined}
                  />
                </div>
                {editingTask === task ? (
                  <div>
                    <Button onClick={() => setEditingTask(undefined)}>
                      Cancel
                    </Button>
                    <Button onClick={() => editTask(task)}>Apply</Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => setEditingTask(task)}
                      disabled={Boolean(editingTask) && editingTask !== task}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => removeTask(task)}
                      disabled={Boolean(editingTask) && editingTask !== task}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </TaskListItem>
          ))
        ) : (
          <li style={{ color: 'gray', textAlign: 'center' }}>Nothing here</li>
        )}
      </TaskList>
    </div>
  )
}

export default App
