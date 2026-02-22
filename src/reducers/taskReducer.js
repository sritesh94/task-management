const generateId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2)}`

export const TASK_ACTIONS = {
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
}

export const initialTaskState = []

export const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.ADD_TASK: {
      const text = action.payload?.text?.trim()
      if (!text) return state
      return [
        ...state,
        { id: generateId(), text, completed: false },
      ]
    }
    case TASK_ACTIONS.DELETE_TASK: {
      const { id } = action.payload
      return state.filter((task) => task.id !== id)
    }
    case TASK_ACTIONS.TOGGLE_TASK: {
      const { id } = action.payload
      return state.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }
    default:
      return state
  }
}
