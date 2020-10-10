import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom'
import {getBraintreeClientToken, processPayment, createOrder} from './apiCore'
import {emptyCart} from './cartHelpers'
import {isAuthenticated} from '../auth'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({products, setRun = f => f, run= undefined}) => {

  const [data, setData] = useState({
    success: false,
    clientToken: null,
    error: '',
    instance:{},
    address: '',
    loading: false
  })

  const userId = isAuthenticated() && isAuthenticated().user._id
  const token = isAuthenticated() && isAuthenticated().token

  const getToken = (userId, token) =>{
    getBraintreeClientToken(userId, token).then(data=>{
      if(data.error){
        setData({...data, error: data.error})
      } else {
        setData({clientToken: data.clientToken})
      }
    })
  }

  useEffect(()=>{
    getToken(userId, token)
  }, [])

  const getTotal = () => {
    return products.reduce((currentValue, nextValue)=>{
      return currentValue + nextValue.count * nextValue.price;
    }, 0)
  }

  const showCheckout = () =>{
    return (
      isAuthenticated() ? (
        <div className="col-5">{showDropIn()}</div>
      ):(
        <Link to="/signin">
          <button className="btn btn-primary">
            Sign in to checkout!
          </button>
        </Link>
      )
    )
  }


  const buy = () =>{
    setData({loading:true})
    let deliveryAddress = data.address
    let nonce
    let getNonce = data.instance.requestPaymentMethod().then(data=>{
      nonce = data.nonce
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getTotal(products)
      }
      processPayment(userId, token, paymentData)
      .then(response => {
        const createOrderData = {
          products: products,
          transaction_id: response.transaction.id,
          amount: response.transaction.amount,
          address: deliveryAddress
        }
        createOrder(userId, token, createOrderData)
        setData({...data, success: response.success});
        emptyCart(()=>{
          setRun(!run)
        })
      })
        .catch(error => {console.log(error); setData({loading: false})})
      })
      .catch(error=>{
        console.log('dropin error:', error)
        setData({...data, error: error.message})
      })
    }

  const showError = error =>
    <div className="alert alert-danger" style={{display: error ? '':'none'}}>
      {error}
    </div>

  const showSuccess = success =>
    <div className="alert alert-info" style={{display: success ? '':'none'}}>
      Thank you for your purchase!
    </div>
  
  const showLoading = (loading) =>(
    loading && <h2>Loading...</h2>
  )

  const handleAddress = event => {
    setData({...data, address: event.target.value})
  }

  const showDropIn = () =>(
    <div onBlur={()=> setData({...data, error:""})} >
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <p>2223000048400011</p>
          <div className="form-group mb-3">
            <label className="text-muted"> Delivery address:</label>
            <textarea onChange={handleAddress} className="form-control" value={data.address} placeholder="Type sour address here..."></textarea>
          </div>
          <DropIn options={{
            authorization: data.clientToken,
            paypal:{
              flow: "vault"
            },
            card:{
              cardholderName:{
                required: true
              }
            }
          }} onInstance={ instance =>(data.instance = instance)}/>
          <button onClick={buy} className="btn btn-success btn-block">Pay</button>
        </div>
      ):null
      }
    </div>
  )

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
    </div>
  )
}

export default Checkout