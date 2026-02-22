import React from 'react'

const Register = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 shadow-sm rounded-md">
      <h2 className="font-semibold mb-6">Register</h2>
      <p className="mb-5">Create a new account</p>

      <form>
        <div className="field mb-4">
          <label className="block text-left mb-2">Name:</label>
          <input
            type="text"
            placeholder="Enter Your Name"
            className="border border-black p-2 rounded-sm w-full"
          />
        </div>

        <div className="field mb-4">
          <label className="block text-left mb-2">Email:</label>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="border border-black p-2 rounded-sm w-full"
          />
        </div>

        <div className="field mb-4">
          <label className="block text-left mb-2">Password:</label>
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border border-black p-2 rounded-sm w-full"
          />
        </div>

        <div className="field mb-6">
          <label className="block text-left mb-2">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Your Password"
            className="border border-black p-2 rounded-sm w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full btn btn--primary py-2.5 bg-blue-500 text-white cursor-pointer"
        > 
          Register
        </button>
      </form>
    </div>
  )
}


export default Register