import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
function App() {
const [amount, setAmount] = useState(0);

const handleChange = (e) => {
  setAmount(e.target.value)
}

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
const data = {
amount: amount * 100,
currency:'INR'
}
const displayRazorpay = async () => {
  const result = await axios.post(`${process.env.REACT_APP_ROUTES}/payment/orders`, data);
if (!result) {
alert("Server error")
return;
}
// console.log(result)
const { amount, id: order_id, currency } = result.data;

const options = {
key: process.env.REACT_APP_KEY,
amount: amount,
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
toast.info(result.data.msg, {
position: "top-center",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,

})
},
prefill: {
name: 'Deepak Kaushal',
email: 'chotasabji@gmail.com',
contact: '9999999999',
},
notes: {
address: 'Chota Sabji Pvt. Ltd'
}
,
theme: {
"color": "#0384fc"
},

}
const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  setAmount('')
}
return (
<div className="app">
    <input type="number" value={amount===0 ?'':amount} onChange={handleChange}className="inputField" placeholder = 'Enter Amount'/>
<button className='btn' onClick={displayRazorpay}>Pay ₹ { amount === 0 ? '' : amount }</button>
<ToastContainer
/>
</div>
);
}

export default App;