import React, {useState} from "react";
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
import {signup} from '../auth';

const Signup = ()=> {

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    success: false
  })

  const {name, email, confirmPassword, password, success, error} = values

  const handleChange = name => event => {
    setValues({...values, error: false, [name]: event.target.value})
  }

  const clickSubmit = (event) =>{
    event.preventDefault()
    setValues({...values, error:false})
    signup({name, email, password, confirmPassword})
    .then(data=>{
      if(data.error){
        setValues({...values, error: data.error, success: false})
      } else {
        console.log({...values})
        setValues({...values, name:'', email:'', password:'', error:'', confirmPassword:'', success: true})
      }
    })
  }  

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className="form-control" value={name}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={handleChange('email')} type="email" className="form-control" value={email}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input onChange={handleChange('confirmPassword')} type="password" className="form-control" value={confirmPassword}/>
      </div>
      <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
    </form>
  )

  const showError = () =>(
  <div className="alert alert-danger" style={{display: error ? '':'none'}}>{error}</div>
  )
  const showSuccess = () =>(
  <div className="alert alert-info" style={{display: success ? '':'none'}}>New account is created. Please <Link to="/signin">Sign In!</Link></div>
  )

  return (
    <Layout title="Sign up" description="Sign up to MERN Ecommerce App" className="container col-md-8 offset-md-2">
      {showError()}
      {showSuccess()}
      {signUpForm()}
    </Layout>
  );
}

export default Signup