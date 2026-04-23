import React, { useActionState, useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

const Register = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")

  const {loading, handleRegister} = useAuth()

   const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleRegister({username, email, password})
      navigate("/")
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Check console for details or try again.')
    }
   }

  if(loading){
    return (<main>Loading.....</main>)
  }
  
  return (
    <main>
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">username</label>
              <input
              onChange={(e)=> (setUsername(e.target.value))}
              type="text" id='username' name='username' placeholder='Enter username' />
            </div>
            <div className="input-group">
              <label htmlFor="email">email</label>
              <input
              onChange={(e) => {setEmail(e.target.value)}}
              type="email" id='email' name='email' placeholder='Enter email address' />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
              onChange={(e) => (setpassword(e.target.value))}
              type="password" id='password' name='password' placeholder='Enter password' />
            </div>

            <button className='button primary-button'>Register</button>
          </form>

          <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
      </main>
  )
}

export default Register