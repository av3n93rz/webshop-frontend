import React, {useState, useEffect}from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom'
import {read, update, updateUser} from './apiUser'

const Profile = ({match}) => {
  const [values, setValues] = useState({
    name: '', 
    email: '',
    error: false,
    success: false
  })

  const {token} = isAuthenticated()

  const {name, email, password, error, success} = values

  const init = (userId) =>{
    read(userId, token).then(data=>{
      if(data.error){
        setValues({...values, error: true})
      } else {
        setValues({...values, name: data.name, email: data.email})
      }
    })
  }

  useEffect(()=>{
    init(match.params.userId)
  }, [])

  const handleChange = name => event => {
    setValues({...values, error: false, [name]: event.target.value})
  }

  const clickSubmit = (e) => {
    e.preventDefault()
    update(match.params.userId, token, {name, email, password}).then(data=>{
      if(data.error){
        console.log(data.error)
      } else {
        updateUser(data, ()=>{
          setValues({...values, name: data.name, email: data.email, success: true})
        })
      }
    })
  }

  const redirectUser = (success) => {
    if(success){
      return <Redirect to="/" />
    }
  }

  const profileUpdate = (name, email, password) =>(
    <form>
      <div className="form-grou">
        <label className="text-muted">Name</label>
        <input type="text" className="form-control" value={name} onChange={handleChange('name')} />
      </div>
      <div className="form-grou">
        <label className="text-muted">Email</label>
        <input type="email" className="form-control" value={email} onChange={handleChange('email')} />
      </div>
      <div className="form-grou">
        <label className="text-muted">Password</label>
        <input type="password" className="form-control" value={password} onChange={handleChange('password')} />
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
    </form>
  )

  return (
    <Layout title="User Profile" description="Edit profile" className="container-fluid">
      <h2 className="mb-4">Profile</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  )

}

export default Profile