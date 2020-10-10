import React, {useState} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom'
import {createCategory} from './apiAdmin'

const AddCategory = () =>{
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const {user, token} = isAuthenticated()

  const handleChange = (e) =>{
    setError('')
    setName(e.target.value)
  }

  const clickSubmit = (e) =>{
    e.preventDefault()
    setError('')
    setSuccess(false)
    createCategory(user._id, token, {name})
    .then(data =>{
      if(data.error){
        setError(data.error)
      } else {
        setError('')
        setSuccess(true)
      }
    })
  }

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input type="text" className="form-control" onChange={handleChange} value={name} autoFocus required/>
      </div>
      <button className="btn btn-outline-primary">Create Category</button>
    </form>
  )

  const showSuccess = () =>{
    if(success){
      return <h3 className="text-success">{name} is created</h3>
    }
  }
  const showError = () =>{
    if(error){
      return <h3 className="text-danger">The name must be unique!</h3>
    }
  }

  const goBack = () =>(
    <div className="mt-5">
      <Link className="text-warning" to="/admin/dashboard">Back to Dashboard</Link>
    </div>
  )

  return (
    <Layout title="Dashboard" description={'Add New Category'} className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  )
}
export default AddCategory