var express = require("express");
var cors = require('cors');
var app = express();
const path = require('path')
// var bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const port = process.env.PORT || 8080;

const userRoutes = require('./src/routes/user');
const roleRoutes = require('./src/routes/roles');
const departmentRoutes = require('./src/routes/departments');
const processhistoryRoutes =require('./src/routes/processhistory');
const currenciesRoutes = require('./src/routes/currencies');
const budgetsRoutes = require('./src/routes/budgets');
const requestRoutes = require('./src/routes/requests');
const loginRoutes = require('./src/routes/login'); 





app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/roles/", roleRoutes);
app.use("/api/v1/departments",departmentRoutes);
app.use("/api/v1/processhistory",processhistoryRoutes);
app.use("/api/v1/currencies", currenciesRoutes);
app.use("/api/v1/budgets", budgetsRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/login", loginRoutes);


app.use(express.static(path.join(__dirname, 'client')))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'))
})



console.clear();

app.listen(port, function () {
    console.log("App now running on port", port);
});





// var express = require("express");
// // var bodyParser = require("body-parser");
// var cors = require('cors');
// var app = express(); //creating an express application instance

// // Body Parser Middleware
// app.use(cors());
// app.use(express.json()); 
// // app.use(express.urlencoded(true)); 


// const port = process.env.PORT || 8080;

// const roleRoutes =require('./src/routes/roles');
// const userRoutes =require('./src/routes/user');

// //creating routes

// app.use("/api/v1/users",userRoutes)
// app.use("/api/v1/roles",roleRoutes)




// console.clear()

// //Setting up server
// app.listen(port, function () {
//     console.log("App now running on port", port);
//  });


