const express = require("express");
const app = express();
const dotenv = require('dotenv');
const connectdb = require("./config/db");
const userRoutes = require('./routes/userRoutes')
const {notFound,errorHandler} = require('./middlewares/errorMiddleware')

dotenv.config();
const port = process.env.PORT;
connectdb();
app.use(express.json());

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

app.get('/',(req,res)=>{
    res.send("API is running");
})

app.use('/api/users',userRoutes);
app.use(notFound);
app.use(errorHandler);
