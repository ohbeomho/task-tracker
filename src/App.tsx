'use client'

import { useCallback, useReducer, useState, useEffect } from 'react'
import { useTheme } from './contexts/ThemeContext'
import Button from './components/Button.styled'
import Input from './components/Input.styled'
import {
  TaskList,
  TaskListItem,
  TaskContentInput,
} from './components/TaskList.styled.tsx'
import Checkbox from './components/Checkbox.styled.tsx'
import type { Space, Task } from './task'
import Menu from './components/Menu.styled.tsx'
import MenuIcon from './components/MenuIcon.tsx'

type TaskAction = {
  type: 'add' | 'remove' | 'mark' | 'edit' | 'clear' | 'set'
  task?: Task
  tasks?: Task[]
  content?: string
  status?: number
  id?: number
}

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'

function sortTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => a.status - b.status)
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
        task === action.task! ? { ...task, status: action.status! } : task,
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
      break
    case 'clear':
      updated = []
      break
    case 'set':
      updated = action.tasks || []
      break
  }

  if (action.type !== 'set') {
    localStorage.setItem('tasks', JSON.stringify(sortTasks(updated)))
  }

  return updated
}

async function fetchTasks(spaceId: string): Promise<Task[]> {
  const url = `${API_HOST}/api/task/space/${spaceId}`
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 404) {
      const error = new Error('Space not found')
      error.name = 'SpaceError'
      throw error
    }
    throw new Error('Failed to fetch tasks')
  }
  return await response.json()
}

async function getInitialTasks(): Promise<Task[]> {
  const space = await getSpace()
  return sortTasks(
    space
      ? await fetchTasks(space.id)
      : JSON.parse(localStorage.getItem('tasks') || '[]'),
  )
}

async function getSpace(): Promise<Space | null> {
  const space = JSON.parse(localStorage.getItem('space') || 'null')

  if (space) {
    const response = await fetch(`${API_HOST}/api/space/${space.id}`)
    if (!response.ok) {
      localStorage.removeItem('space')
      return null
    }

    const spaceData = await response.json()
    space.name = spaceData.name
  }

  return space
}

function App() {
  const [space, setSpace] = useState<Space | null>(null)
  const [spaceId, setSpaceId] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [content, setContent] = useState('')
  const [editText, setEditText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const [tasks, dispatch] = useReducer(tasksReducer, [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { theme, toggleTheme } = useTheme()

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const initialTasks = await getInitialTasks()
      dispatch({ type: 'set', tasks: initialTasks })
    } catch (err) {
      if (err instanceof Error && err.name === 'SpaceError') {
        setError(err)
        setSpace(null)
        setSpaceId('')
        localStorage.removeItem('space')
        dispatch({ type: 'clear' })
      } else {
        console.error('Failed to load tasks:', err)
        setError(err instanceof Error ? err : new Error('Failed to load tasks'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getSpace().then((space) => {
      setSpace(space)
      setSpaceId(space?.id || '')
      loadTasks()
    })
  }, [loadTasks])

  const removeTask = useCallback(
    (task: Task) => {
      dispatch({ type: 'remove', task })

      if (!spaceId) return

      fetch(`${API_HOST}/api/task/${task.id}`, {
        method: 'DELETE',
      }).catch(console.error)
    },
    [spaceId],
  )

  const addTask = useCallback(() => {
    if (!content) return
    const newTask: Task = { content, status: 0 }
    // Add to local state immediately for better UX
    dispatch({ type: 'add', task: newTask })
    setContent('')

    if (!spaceId) return

    // Then sync with server
    fetch(`${API_HOST}/api/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, spaceId }),
    })
      .then((res) =>
        res.status === 201
          ? res.json()
          : Promise.reject(new Error('Failed to add task')),
      )
      .then((createdTask) =>
        dispatch({ type: 'edit', task: newTask, id: createdTask.id }),
      )
      .catch((error) => {
        console.error('Error adding task:', error)
        dispatch({ type: 'remove', task: newTask })
      })
  }, [content, spaceId])

  const changeStatus = useCallback(
    (task: Task, status: number) => {
      dispatch({ type: 'mark', task, status })

      if (!spaceId) return

      // Update server
      fetch(`${API_HOST}/api/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
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
      fetch(`${API_HOST}/api/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editText }),
      }).catch(console.error)

      setEditText('')
      setEditingTask(null)
    },
    [editingTask, editText, spaceId],
  )

  const changeSpace = useCallback(async () => {
    if (space && spaceId === space.id) return
    if (
      !space
        ? !confirm(
            `Current tasks are stored in browser's localStorage.
If you connect to a space, your current tasks will be lost.
Continue?`,
          )
        : !confirm('Are you sure you want to change space?')
    )
      return

    // Clear tasks when switching spaces
    dispatch({ type: 'clear' })

    if (spaceId === 'local') {
      localStorage.removeItem('space')
      setSpace(null)
      setSpaceId('')
      return
    }

    localStorage.setItem('space', JSON.stringify({ id: spaceId }))
    setSpace(await getSpace())

    loadTasks()
  }, [spaceId, space, loadTasks])

  const createSpace = useCallback(async () => {
    if (spaceId) return

    const spaceName = prompt('Enter space name:')
    if (!spaceName) return

    // Create space on server
    try {
      const response = await fetch(`${API_HOST}/api/space`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: spaceId, name: spaceName }),
      })

      if (!response.ok) {
        throw new Error('Failed to create space')
      }
      const createdSpace = await response.json()
      localStorage.setItem(
        'space',
        JSON.stringify({ id: createdSpace.id, name: spaceName }),
      )

      setSpace(await getSpace())
      setSpaceId(createdSpace.id)
      dispatch({ type: 'clear' })
    } catch (error) {
      console.error('Error creating space:', error)
    }
  }, [spaceId, setSpace, setSpaceId])

  const deleteSpace = useCallback(async () => {
    if (!spaceId) return

    // Delete space on server
    try {
      const response = await fetch(`${API_HOST}/api/space/${spaceId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete space')
      }

      localStorage.removeItem('space')
      setSpace(null)
      setSpaceId('')
      dispatch({ type: 'clear' })
    } catch (error) {
      console.error('Error deleting space:', error)
    }
  }, [spaceId, setSpace, setSpaceId])

  return (
    <div className="container">
      <Menu className={`menu ${menuOpen ? 'open' : ''}`}>
        <h1>Menu</h1>
        <div>
          <div
            style={{
              backgroundColor: 'var(--bg-color)',
              padding: '10px',
              borderRadius: '5px',
              border: '2px solid var(--border-color)',
              whiteSpace: 'wrap',
              wordBreak: 'break-word',
            }}
          >
            <span>
              {space ? (
                <>
                  Space Connected
                  <br />
                  {space.name}
                </>
              ) : (
                'No space connected'
              )}
            </span>
            <br />
            <details>
              <summary>Options</summary>
              <p>
                {space && (
                  <>
                    <span style={{ color: 'gray' }}>
                      Enter 'local' to use localStorage
                    </span>
                    <br />
                  </>
                )}
                <Input
                  placeholder="Enter space ID"
                  value={spaceId}
                  onInput={(e) => setSpaceId(e.currentTarget.value)}
                />
                <Button onClick={changeSpace}>Set Space</Button>
              </p>
              {!space && <Button onClick={createSpace}>Create Space</Button>}
              {space && (
                <>
                  <Button onClick={deleteSpace}>Delete Space</Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(space.id)}
                  >
                    Copy Space ID
                  </Button>
                  <br />
                  <Button onClick={loadTasks}>Refresh Tasks</Button>
                </>
              )}
            </details>
          </div>
          <Button onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </Menu>
      <main>
        <MenuIcon isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
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
          {error ? (
            <TaskListItem style={{ color: 'red', textAlign: 'center' }}>
              Error: {(error as Error).message}
            </TaskListItem>
          ) : isLoading ? (
            <TaskListItem style={{ textAlign: 'center' }}>
              Loading...
            </TaskListItem>
          ) : tasks.length ? (
            tasks.map((task, idx) => (
              <TaskListItem key={idx} $status={task.status}>
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
                    Done:&nbsp;
                    <Checkbox
                      onChange={(e) =>
                        changeStatus(task, e.currentTarget.checked ? 1 : 0)
                      }
                      checked={task.status === 1}
                      disabled={editingTask !== null}
                    />
                    &nbsp;Active:
                    <Checkbox
                      onChange={(e) =>
                        changeStatus(task, e.currentTarget.checked ? -1 : 0)
                      }
                      checked={task.status === -1}
                      disabled={editingTask !== null}
                    />
                  </div>
                  {editingTask === task ? (
                    <div>
                      <Button onClick={() => setEditingTask(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => editTask(task)}>Apply</Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
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
            <TaskListItem style={{ color: 'gray', textAlign: 'center' }}>
              Nothing here
            </TaskListItem>
          )}
        </TaskList>
      </main>
    </div>
  )
}

export default App
