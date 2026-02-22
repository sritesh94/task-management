import { useState } from "react"
import { useTasks } from "../context/TaskContext.jsx"

const Tasks = () => {
  const { tasks, addTask, deleteTask, toggleTask } = useTasks()
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    addTask(inputValue)
    setInputValue("")
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-medium mb-4">Tasks</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add new task"
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add
        </button>
      </form>

      <ul className="space-y-3">
        {tasks.length === 0 ? (
          <li className="text-gray-500 py-4 text-center">No tasks yet. Add one above.</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={`flex break-all items-center justify-between border rounded-md px-4 py-3 ${task.completed ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span
                  className={task.completed ? "line-through text-gray-500" : "text-gray-800"}
                >
                  {task.text}
                </span>
              </div>
              <button
                type="button"
                className="text-red-600 hover:text-red-700"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default Tasks
