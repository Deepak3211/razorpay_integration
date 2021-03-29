const express = require('express');
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');


//middleware
app.use(express.json());
app.use(cors());
//routes

app.use('/payment', require('./routes/payment'));


app.listen(PORT, () => {
  console.log(`server is listening on port : ${PORT}`);
})