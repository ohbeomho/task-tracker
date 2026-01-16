import { useCallback, useReducer, useState, use } from 'react'
import Button from './components/Button.styled'
import Input from './components/Input.styled'
import {
  TaskList,
  TaskListItem,
  TaskContentInput,
} from './components/List.styled.tsx'
import Checkbox from './components/Checkbox.styled.tsx'
import type { Space, Task } from './task'

type TaskAction = {
  type: 'add' | 'remove' | 'mark' | 'edit'
  task?: Task
  content?: string
  done?: boolean
  id?: number
}

function tasksReducer(tasks: Task[], action: TaskAction): Task[] {
  let updated: Task[]

  switch (action.type) {
    case 'add':
      updated = [...tasks, action.task!]
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
        task === action.task!
          ? {
              ...task,
              content: action.content || task.content,
              id: action.id || task.id,
            }
          : task,
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

async function fetchTasks(spaceId: string): Promise<Task[]> {
  try {
    const url = `/api/tasks/${spaceId}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching tasks:', error)
    // Fallback to local storage if API fails
    const localTasks = localStorage.getItem('tasks')
    return localTasks ? JSON.parse(localTasks) : []
  }
}

async function getInitialTasks(): Promise<Task[]> {
  const space = getSpace()
  return space
    ? fetchTasks(space.id)
    : JSON.parse(localStorage.getItem('tasks') || '[]')
}

function getSpace(): Space | null {
  const spaceId = JSON.parse(localStorage.getItem('space') || 'null')
  return spaceId ? { id: spaceId } : null
}

function App() {
  const [space, setSpace] = useState<Space | null>(getSpace())
  const [spaceId, setSpaceId] = useState<string>(space?.id || '')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [content, setContent] = useState('')
  const [editText, setEditText] = useState('')

  // Use the use hook to fetch tasks
  const tasks = use<Task[]>(getInitialTasks())
  const [tasksState, dispatch] = useReducer(tasksReducer, tasks)

  const removeTask = useCallback(
    (task: Task) => {
      dispatch({ type: 'remove', task })
      // You might want to add an API call here to delete from server
    },
    [spaceId],
  )

  const addTask = useCallback(() => {
    if (!content) return
    const newTask: Task = { content, done: false }
    // Add to local state immediately for better UX
    dispatch({ type: 'add', task: newTask })
    setContent('')

    if (!spaceId) return

    // Then sync with server
    fetch('/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, spaceId }),
    })
      .then((res) => res.json())
      .then((createdTask) =>
        dispatch({ type: 'edit', task: newTask, id: createdTask.id }),
      )
      .catch((error) => {
        console.error('Error adding task:', error)
        // Optionally revert the local state on error
      })
  }, [content, spaceId])

  const markTask = useCallback(
    (task: Task, done: boolean) => {
      dispatch({ type: 'mark', task, done })

      if (!spaceId) return

      // Update server
      fetch(`/api/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done }),
      }).catch(console.error)
    },
    [spaceId],
  )

  const editTask = useCallback(
    (task: Task) => {
      if (!editText || !editingTask) return

      dispatch({
        type: 'edit',
        task,
        content: editText,
      })

      if (!spaceId) return

      // Update server
      fetch(`/api/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editText }),
      }).catch(console.error)

      setEditText('')
      setEditingTask(null)
    },
    [editingTask, editText, spaceId],
  )

  const changeSpace = useCallback(
    (space: string) => {
      if (
        spaceId &&
        !confirm(
          `Current tasks are stored in browser's localStorage.
If you connect to a space, your current tasks will be lost.
Continue?`,
        )
      )
        return

      setSpaceId(space)
      // TODO: Load tasks from server for the new space
    },
    [setSpaceId, spaceId],
  )

  return (
    <div className="container">
      <h1>
        {tasks.length} Task{tasks.length === 1 ? '' : 's'}
      </h1>
      <div style={{ display: 'flex' }}>
        <Input
          placeholder="Enter your task here"
          value={content}
          onInput={(e) => setContent(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <TaskList>
        {tasksState.length ? (
          tasksState.map((task, idx) => (
            <TaskListItem key={idx} $done={task.done}>
              {editingTask === task ? (
                <TaskContentInput
                  defaultValue={task.content}
                  onInput={(e) => setEditText(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === 'Enter' && editTask(task)}
                  autoFocus
                />
              ) : (
                <div>{task.content}</div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Done:
                  <Checkbox
                    onChange={(e) => markTask(task, e.currentTarget.checked)}
                    checked={task.done}
                    disabled={editingTask !== null}
                  />
                </div>
                {editingTask === task ? (
                  <div>
                    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
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
      <div style={{ position: 'fixed', left: 10, top: 10 }}>
        <summary>{space ? space.id : 'No space connected'}</summary>
        <details>
          <Input
            placeholder="Enter space ID"
            value={spaceId}
            onInput={(e) => setSpaceId(e.currentTarget.value)}
          />
          <Button onClick={() => changeSpace(spaceId)}>Set Space</Button>
        </details>
      </div>
    </div>
  )
}

export default App
