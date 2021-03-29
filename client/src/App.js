import './App.css';
import axios from 'axios';
import { useEffect } from 'react'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
function App() {

  useEffect(() => {
  
   
    
    const loadScripts =  (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          resolve(true);
        }
        script.onerror = () => reject()
        document.body.appendChild(script);
      });
    }
    const res =  loadScripts(
    "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
    alert("Razorpay sdk failed to load ")
    return;
    }
  }, [])
  
const displayRazorpay = async () => {
const result = await axios.post(`${process.env.REACT_APP_ROUTES}/payment/orders`);
if (!result) {
alert("Server error")
return;
}
const { amount, id: order_id, currency } = result.data;

const options = {
key: process.env.REACT_APP_KEY,
amount: amount.toString(),
currency: currency,
name: 'Chota Don',
description: 'Chota Don Pvt. Ltd',
image: 'https://www.dailyexcelsior.com/wp-content/uploads/2013/12/url.jpg',
order_id: order_id,
handler: async (response) => {
  const data = {
    orderCreationId: order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpayOrderId: response.razorpay_order_id,
    razorpaySignature: response.razorpay_signature,



  };
  const result = await axios.post(` ${process.env.REACT_APP_ROUTES}/payment/success`, data)
  // alert(result.data.msg)
  toast.success(result.data.msg)
  },
  prefill: {
    name: 'Chota Don',
    email: 'chotasabji@gmail.com',
    contact: '9999999999',
  },
  notes: {
    address: 'Chota Sabji Pvt. Ltd'
  }
,
theme: {
   "color": "#44d808"
},

}
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
return (
<div className="app">

    <button className='btn' onClick={displayRazorpay}>Pay ₹ 501</button>
    <ToastContainer
    position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
    />
</div>
);
}

export default App;
