// implement your API here
const express = require("express")
const db = require("./data/db")

const server = express()
const port = 3000

//middleware that allows express to parse JSON request bodies
server.use(express.json())

//------------------------------------------------------------------------
//Sends a message as JSON in my main endpoint
server.get("/", (req, res) => {
    res.json({
        message:"Welcome to users api"
    })
})

//--------------------------------------------------------------------------------------------------
//sends an <h1> element on the /API endpoint

server.get("/api", (req, res) => {
    res.send(`
    <h1> Welcome To My API </h1>
    
    `)
})

//--------------------------------------------------------------------------------------------------
//gets a full list of users (users.js) through db.js, as the db.js file is the one importing  users.js
//through knex
server.get("/api/users", (req, res) => {
 //this is calling the find() function located in the db.js file   
db.find()
 .then((users) => {
     //this is giving a response of 200, and its also sending data as a json file
     res.status(200).json(users)
 })
 .catch((error) => {
     //if nothing is getting pulled from funtion on top, this line will return a 500 error
     //with a message.
        res.status(500).json({
         message:"Error while getting users, please report to administrators",
     })
 })
})


//-------------------------------------------------------------------------
// Creating a new user:
server.post("/api/users", (req,res) => {

//conditional statement is saying that if name or bio 
//are false to return the response and the JSON file with message below:
if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
        message: "Missing name or bio, make sure to enter them"
    })
}

//else will executed here if both the name and bio were entered by the users input
else {
    //here im calling function insert() from db.js file and and im passing req.body as argument
    db.insert(req.body)
    //here im sendng new user as json
    .then((user) => {
        res.status(201).json(user)
    })
    //here if an error ocurred it will pass a 500, and a json message
    .catch((error) => {
        res.status(500).json({
            message:"error adding user"
        })
    })

}
})

//----------------------------------------------------------------------------

server.get("/api/users/:id", (req,res) => {
    db.findById(req.params.id)
    .then((user) => {
        if(user) {
            res.status(200).json(user)
        } 
        else{
           res.status(404).json({
               message: "User not found"
           })
        }
        
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error obtaining access to user"
        })
    })

})




//------------------------------------------------------------------------
// start the server on localhost at port 3000
server.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`)
})

