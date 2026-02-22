import Tasks from './Tasks.jsx'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <Tasks />
      </div>
    </div>
  )
}

export default Dashboard