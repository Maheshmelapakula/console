const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const cors = require('cors');

const connection = require("./config/db")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users");
const productRoutes = require('./routes/productRoutes');
const transactionsRouter = require('./routes/transaction')
const logsRouter = require("./routes/logs")
const reportsRouter = require('./routes/reports')










const app = express();
app.use(cors(
    '*',
    
  ));
app.use(bodyParser.json());  // Add this line
app.use(bodyParser.urlencoded({ extended: true })); 


app.get("/", (req,res)=>{
    res.send("Hello World");
})



app.use("/api/auth",authRoutes);
// app.use("api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/reports', reportsRouter);

const PORT = 9090;

app.listen(PORT, async()=>{
    try {
        await connection;
        console.log("Conneted to the DataBase");    
    } catch (error) {
        console.log("Error in connecting to the database");
        console.log(error);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
    
})