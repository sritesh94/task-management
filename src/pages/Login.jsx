import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "123456") {
      login({ email })
      navigate("/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 shadow-sm rounded-md ">
      <h2 className='font-semibold mb-6'>Login</h2>
      <p className='mb-5'>Log in with admin@example.com and password 123456</p>
      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label className="block text-left mb-2">Email:</label>
          <input type="email" placeholder='Enter Your Email' className='border border-black p-2 rounded-sm w-full' value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="field mb-4">
            <label className="block text-left mb-2">Password:</label>
            <input type="password" placeholder='Enter Your Password' className='border border-black p-2 rounded-sm w-full' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="w-full btn btn--primary py-2.5 bg-blue-500 text-white cursor-pointer">Log in</button>
      </form>
    </div>
  )
}

export default Login