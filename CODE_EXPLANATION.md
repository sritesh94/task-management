# Task Management App – Line-by-Line Code Explanation

This document explains every file in `src` that we built for the task management app: authentication, protected routes, and tasks with reducer + context + localStorage.

---

## 1. `src/App.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import React from 'react'` | Imports React (needed when using JSX). |
| 2 | `import { createBrowserRouter, RouterProvider } from 'react-router-dom'` | Imports the router API: `createBrowserRouter` defines routes and `RouterProvider` renders the app using that config. |
| 3 | `import { AuthProvider } from './context/AuthContext.jsx'` | Imports the auth context provider so the whole app can use login state. |
| 4 | `import { TaskProvider } from './context/TaskContext.jsx'` | Imports the task context provider so the app can use task state (add/delete/toggle). |
| 5–11 | Imports for `RootLayout`, `Home`, `Login`, `Register`, `Dashboard`, `ProtectedRoute`, `GuestRoute` | Imports layout and page components plus route guards. |
| 13 | `const route = createBrowserRouter([...])` | Creates the router config: one root route with nested children. |
| 14–22 | `path: '/'`, `element: <AuthProvider><TaskProvider><RootLayout />...</TaskProvider></AuthProvider>` | Root path renders `RootLayout` wrapped in `TaskProvider` then `AuthProvider`. Order: Auth wraps Task so auth is available everywhere; Task is inside so dashboard/tasks can use tasks. |
| 23 | `children: [...]` | Nested routes render inside `RootLayout` via `<Outlet />`. |
| 24–26 | `index: true`, `element: <Home />` | Default route for `/`: shows `Home`. |
| 27–34 | `path: 'login'`, `element: <GuestRoute><Login /></GuestRoute>` | `/login` only shows when not logged in; otherwise redirects to dashboard. |
| 35–42 | `path: 'register'`, `element: <GuestRoute><Register /></GuestRoute>` | Same for `/register`: guest-only. |
| 43–50 | `path: 'dashboard'`, `element: <ProtectedRoute><Dashboard /></ProtectedRoute>` | `/dashboard` only when logged in; otherwise redirects to login. |
| 55–59 | `const App = () => { return <RouterProvider router={route} /> }` | App component just renders the router with the config we defined. |
| 61 | `export default App` | Exports `App` as the default export. |

---

## 2. `src/context/AuthContext.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { createContext, useContext, useState, useEffect } from "react"` | React APIs: context + state + effect for auth. |
| 3 | `const AuthContext = createContext(null)` | Creates a context object. Default value `null`; real value comes from `AuthProvider`. |
| 5 | `export const AuthProvider = ({ children }) => {` | Provider component: wraps part of the tree and supplies auth state to all descendants. |
| 6–14 | `const [isLoggedIn, setIsLoggedIn] = useState(() => { try { const user = localStorage.getItem("user"); ... return !!(parsed && parsed.isLoggedIn) } catch { return false } })` | **Lazy initial state**: on first render we read `user` from localStorage. If it exists and has `isLoggedIn: true`, we set `isLoggedIn` to `true`; otherwise or on error, `false`. |
| 17–33 | `useEffect(() => { const syncFromStorage = () => { ... }; window.addEventListener("storage", syncFromStorage); return () => window.removeEventListener(...) }, [])` | Listens to the browser `storage` event (e.g. another tab logs out and clears localStorage). When it fires, we re-read `user` and update `isLoggedIn`. Cleanup removes the listener. |
| 35–38 | `const login = (userData) => { localStorage.setItem("user", JSON.stringify({ ...userData, isLoggedIn: true })); setIsLoggedIn(true) }` | Saves user (e.g. `{ email }`) to localStorage with `isLoggedIn: true` and sets React state so the UI updates immediately. |
| 40–43 | `const logout = () => { localStorage.clear(); setIsLoggedIn(false) }` | Clears all localStorage (including `user`) and sets `isLoggedIn` to `false`. |
| 45–48 | `return ( <AuthContext.Provider value={{ isLoggedIn, login, logout }}> {children} </AuthContext.Provider> )` | Provides `isLoggedIn`, `login`, and `logout` to any component that uses `useAuth()`. |
| 51–55 | `export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw ...; return ctx }` | Custom hook to read auth context. Throws if used outside `AuthProvider`; otherwise returns `{ isLoggedIn, login, logout }`. |

---

## 3. `src/context/TaskContext.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { createContext, useContext, useReducer, useEffect } from "react"` | Context + useReducer for task state + useEffect for persistence. |
| 2 | `import { taskReducer, initialTaskState, TASK_ACTIONS } from "../reducers/taskReducer.js"` | Reducer and action types for tasks. |
| 4 | `const TASKS_STORAGE_KEY = "task-management-tasks"` | Key used to read/write tasks in localStorage. |
| 6–14 | `const loadTasksFromStorage = () => { try { const stored = localStorage.getItem(...); ... return Array.isArray(parsed) ? parsed : initialTaskState } catch { return initialTaskState } }` | Reads tasks from localStorage. Returns parsed array if valid; otherwise empty array. Used as initial state for the reducer. |
| 16 | `const TaskContext = createContext(null)` | Context that will hold `tasks` and task actions. |
| 19 | `export const TaskProvider = ({ children }) => {` | Provider that wraps the app (or the part that needs tasks). |
| 20 | `const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasksFromStorage)` | **Lazy init**: `useReducer` calls `loadTasksFromStorage()` once to get initial state. All updates go through `taskReducer` via `dispatch`. |
| 22–24 | `useEffect(() => { localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)) }, [tasks])` | Whenever `tasks` changes (add/delete/toggle), we save the full array to localStorage. |
| 26–28 | `const addTask = (text) => { dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: { text } }) }` | Dispatches add action; reducer adds a new task. |
| 30–32 | `const deleteTask = (id) => { dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: { id } }) }` | Dispatches delete action; reducer removes task by id. |
| 34–36 | `const toggleTask = (id) => { dispatch({ type: TASK_ACTIONS.TOGGLE_TASK, payload: { id } }) }` | Dispatches toggle action; reducer flips `completed` for that task. |
| 38–43 | `const value = { tasks, addTask, deleteTask, toggleTask }` | Object passed to context so consumers get state and actions. |
| 45–48 | `return ( <TaskContext.Provider value={value}> {children} </TaskContext.Provider> )` | Provides `value` to the tree. |
| 52–56 | `export const useTasks = () => { const ctx = useContext(TaskContext); if (!ctx) throw ...; return ctx }` | Hook to use task context; throws if used outside `TaskProvider`. |

---

## 4. `src/components/ProtectedRoute.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { Navigate } from "react-router-dom"` | Component that redirects to a URL when rendered. |
| 2 | `import { useAuth } from "../context/AuthContext.jsx"` | To read if the user is logged in. |
| 4 | `const ProtectedRoute = ({ children }) => {` | Wraps routes that require login (e.g. Dashboard). |
| 5 | `const { isLoggedIn } = useAuth()` | Gets current login status from context. |
| 7–9 | `if (!isLoggedIn) { return <Navigate to="/login" replace /> }` | If not logged in, render a redirect to `/login`. `replace` replaces current history entry so back button doesn’t send to protected page again. |
| 11 | `return children` | If logged in, render the child (e.g. `<Dashboard />`). |
| 14 | `export default ProtectedRoute` | Default export for use in `App.jsx`. |

---

## 5. `src/components/GuestRoute.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { Navigate } from "react-router-dom"` | For redirecting. |
| 2 | `import { useAuth } from "../context/AuthContext.jsx"` | To read login status. |
| 4 | `const GuestRoute = ({ children }) => {` | Wraps routes that should only be visible when **not** logged in (Login, Register). |
| 5 | `const { isLoggedIn } = useAuth()` | Current auth state. |
| 7–9 | `if (isLoggedIn) { return <Navigate to="/dashboard" replace /> }` | If logged in, redirect to dashboard so user can’t open login/register again. |
| 11 | `return children` | If not logged in, show the child (Login or Register). |
| 14 | `export default GuestRoute` | Default export. |

---

## 6. `src/pages/Login.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { useState } from "react"` | For email/password input state. |
| 2 | `import { useNavigate } from "react-router-dom"` | To redirect after successful login. |
| 3 | `import { useAuth } from "../context/AuthContext.jsx"` | To call `login()` and update auth state. |
| 5 | `const Login = () => {` | Login page component. |
| 6 | `const navigate = useNavigate()` | Navigate function from React Router. |
| 7 | `const { login } = useAuth()` | Get `login` from auth context. |
| 8–9 | `const [email, setEmail] = useState('')` and same for password | Controlled inputs for email and password. |
| 11–19 | `const handleSubmit = (e) => { e.preventDefault(); if (email === "admin@example.com" && password === "123456") { login({ email }); navigate("/dashboard") } else { alert("Invalid credentials") } }` | On submit: prevent default form post. If credentials match, call `login({ email })` (saves user + sets isLoggedIn), then navigate to dashboard. Otherwise show alert. |
| 21–35 | JSX: div, h2, p, form with onSubmit={handleSubmit}, two inputs (value/onChange), submit button | Renders the login form; form submit runs `handleSubmit`. |
| 38 | `export default Login` | Default export. |

---

## 7. `src/pages/Register.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import React from 'react'` | React import. |
| 3 | `const Register = () => {` | Register page (UI only; no submit logic yet). |
| 4–54 | JSX: container, heading, form with name/email/password/confirm password inputs and Register button | Static form layout; inputs are uncontrolled (no state or submit handler). |
| 57 | `export default Register` | Default export. |

---

## 8. `src/pages/RootLayout.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { NavLink, Outlet, useNavigate } from "react-router-dom"` | `NavLink` for nav links, `Outlet` for child route content, `useNavigate` for redirect after logout. |
| 2 | `import { useAuth } from "../context/AuthContext.jsx"` | To read `isLoggedIn` and `logout`. |
| 4 | `const RootLayout = () => {` | Layout that wraps all pages: header + main content. |
| 5 | `const navigate = useNavigate()` | For programmatic navigation. |
| 6 | `const { isLoggedIn, logout } = useAuth()` | Auth state and logout function. |
| 7–10 | `const navClass = ({ isActive }) => isActive ? '...' : '...'` | Function for `NavLink`’s `className`: active link gets blue underline, inactive gets gray. |
| 12–15 | `const handleLogout = () => { logout(); navigate("/login") }` | Calls context `logout()` (clears localStorage + sets isLoggedIn false), then navigates to login. |
| 17–39 | JSX: header with nav. `NavLink` to "/" (Home). Then `{!isLoggedIn && (<> Login, Register </>)}` and `{isLoggedIn && (<> Dashboard, Logout button </>)}`. `<main><Outlet /></main>` | Shows Home always. Shows Login/Register only when not logged in; Dashboard and Logout only when logged in. `<Outlet />` renders the matched child route (Home, Login, Dashboard, etc.). |
| 42 | `export default RootLayout` | Default export. |

---

## 9. `src/pages/Home.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import React from 'react'` | React import. |
| 3 | `const Home = () => {` | Home page component. |
| 4–15 | JSX: centered div with title "Home Page" and welcome text | Simple static content. |
| 17 | `export default Home` | Default export. |

---

## 10. `src/pages/Dashboard.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import Tasks from './Tasks.jsx'` | Imports the Tasks component. |
| 3 | `const Dashboard = () => {` | Dashboard page (only rendered when logged in, via ProtectedRoute). |
| 4–11 | JSX: wrapper div, heading "Dashboard", then `<Tasks />` | Layout and task list; all task logic is in `Tasks` and TaskContext. |
| 13 | `export default Dashboard` | Default export. |

---

## 11. `src/pages/Tasks.jsx`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `import { useState } from "react"` | For the “add task” input value. |
| 2 | `import { useTasks } from "../context/TaskContext.jsx"` | To read tasks and call add/delete/toggle. |
| 4 | `const Tasks = () => {` | Task list + add form component. |
| 5 | `const { tasks, addTask, deleteTask, toggleTask } = useTasks()` | Gets task state and actions from context. |
| 6 | `const [inputValue, setInputValue] = useState("")` | Controlled input for new task text. |
| 8–12 | `const handleSubmit = (e) => { e.preventDefault(); addTask(inputValue); setInputValue("") }` | On form submit: prevent reload, add task with current input, clear input. |
| 18–29 | Form with input (value=inputValue, onChange updates state) and Add button (type="submit") | Add-task form; submit triggers `handleSubmit`. |
| 31–64 | `<ul>`. If `tasks.length === 0` show "No tasks yet." Else `tasks.map(task =>` each item: checkbox (checked=task.completed, onChange=toggleTask), span with task.text (strikethrough if completed), Delete button (onClick=deleteTask). `key={task.id}`. | Renders list from context; checkbox toggles completion, Delete removes task. |
| 68 | `export default Tasks` | Default export. |

---

## 12. `src/reducers/taskReducer.js`

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `const generateId = () => \`task_${Date.now()}_${Math.random().toString(36).slice(2)}\`` | Creates a unique id for each new task (time + random string). |
| 3–7 | `export const TASK_ACTIONS = { ADD_TASK: 'ADD_TASK', DELETE_TASK: 'DELETE_TASK', TOGGLE_TASK: 'TOGGLE_TASK' }` | Action type constants to avoid typos and share with context. |
| 9 | `export const initialTaskState = []` | Default state: empty task list. |
| 11 | `export const taskReducer = (state, action) => {` | Reducer: (current state, action) => new state. |
| 12 | `switch (action.type) {` | Branch by action type. |
| 13–19 | `case TASK_ACTIONS.ADD_TASK`: get `text` from payload, trim; if empty return state; else return `[...state, { id: generateId(), text, completed: false }]` | Adds one new task; ignores empty text. |
| 20–23 | `case TASK_ACTIONS.DELETE_TASK`: get `id` from payload; return `state.filter(task => task.id !== id)` | Removes the task with that id. |
| 24–29 | `case TASK_ACTIONS.TOGGLE_TASK`: get `id`; return state.map: if task.id === id then `{ ...task, completed: !task.completed }` else task | Flips `completed` for the matching task. |
| 30–31 | `default: return state` | Unknown action: state unchanged. |
| 33 | `}` | End of switch and reducer. |

---

## Flow summary

1. **App.jsx**  
   Defines routes and wraps the app in `AuthProvider` and `TaskProvider`.  
   - `/` → Home  
   - `/login` → GuestRoute → Login  
   - `/register` → GuestRoute → Register  
   - `/dashboard` → ProtectedRoute → Dashboard → Tasks  

2. **Auth**  
   - `AuthContext`: `isLoggedIn` from localStorage + `login` / `logout`.  
   - `ProtectedRoute`: not logged in → redirect to `/login`.  
   - `GuestRoute`: logged in → redirect to `/dashboard`.  
   - `Login`: valid credentials → `login({ email })` then navigate to `/dashboard`.  
   - `RootLayout`: shows Login/Register or Dashboard/Logout based on `isLoggedIn`.  

3. **Tasks**  
   - `taskReducer`: add, delete, toggle; state = array of `{ id, text, completed }`.  
   - `TaskContext`: `useReducer` with lazy init from localStorage; `useEffect` saves tasks to localStorage on change; exposes `tasks`, `addTask`, `deleteTask`, `toggleTask`.  
   - `Tasks.jsx`: form adds task; list shows tasks with checkbox (toggle) and Delete; all state from context, persisted in localStorage.

This is the full line-by-line explanation of the `src` code we built for the task management app.
