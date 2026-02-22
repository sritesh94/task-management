import { createContext, useContext, useReducer, useEffect } from "react"
import { taskReducer, initialTaskState, TASK_ACTIONS } from "../reducers/taskReducer.js"

const TASKS_STORAGE_KEY = "task-management-tasks"

const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!stored) return initialTaskState
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : initialTaskState
  } catch {
    return initialTaskState
  }
}

const TaskContext = createContext(null)

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasksFromStorage)

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text) => {
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: { text } })
  }

  const deleteTask = (id) => {
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: { id } })
  }

  const toggleTask = (id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE_TASK, payload: { id } })
  }

  const value = {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks must be used within TaskProvider")
  return ctx
}
