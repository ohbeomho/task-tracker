import React, { useCallback, useReducer, useState } from 'react'
import Button from './components/Button.styled'
import Input from './components/Input.styled'
import { TaskList, TaskListItem } from './components/List.styled.tsx'
import Checkbox from './components/Checkbox.styled.tsx'

type Task = {
  id: string
  text: string
  done: boolean
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
      updated = [
        ...tasks,
        { id: crypto.randomUUID(), text: action.text!, done: false },
      ]
      break
    case 'remove':
      updated = tasks.filter((task) => task.id !== action.id!)
      break
    case 'mark':
      updated = tasks.map((task) =>
        task.id === action.id! ? { ...task, done: action.done! } : task,
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
  const [text, setText] = useState('')

  const removeTask = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      dispatch({ type: 'remove', id: e.currentTarget.dataset.taskid }),
    [],
  )
  const addTask = useCallback(() => {
    dispatch({ type: 'add', text })
    setText('')
  }, [text])
  const markTask = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: 'mark',
        id: e.currentTarget.dataset.taskid,
        done: e.currentTarget.checked,
      }),
    [],
  )

  const textChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setText(e.currentTarget.value),
    [],
  )

  return (
    <div className="container">
      <h1>
        {tasks.length} Task{tasks.length === 1 ? '' : 's'}
      </h1>
      <div style={{ display: 'flex' }}>
        <Input
          placeholder="Enter your task here"
          style={{ flex: 1 }}
          value={text}
          onInput={textChange}
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <TaskList>
        {tasks.length ? (
          tasks.map((task, idx) => (
            <TaskListItem key={idx} $done={task.done}>
              <div>{task.text}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Done:
                  <Checkbox
                    data-taskid={task.id}
                    onChange={markTask}
                    checked={task.done}
                  />
                </div>
                <Button data-taskid={task.id} onClick={removeTask}>
                  Remove
                </Button>
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
