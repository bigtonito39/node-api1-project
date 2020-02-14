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
         message: "The users information could not be retrieved.",
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
        message: "Please provide name and bio for the user."
    })
}

//else will executed here if both the name and bio were entered by the users input and its valid
else {
    //here im calling function insert() from db.js file and and im passing req.body as argument to database
    db.insert(req.body)
    //here im sendng new user as json
    .then((user) => {
        res.status(201).json(user)
    })
    //here if an error ocurred it will pass a 500, and a json message
    .catch((error) => {
        res.status(500).json({
            message:"There was an error while saving the user to the database"
        })
    })

}
})

//----------------------------------------------------------------------------
//get an user by ID
server.get("/api/users/:id", (req,res) => {
    //HERE IM PASSING ID TO DATABASE AND RUNNING findById funtion
    db.findById(req.params.id)
    //here is returning an 200 HTTP status code and sending specific user to database
    .then((user) => {
        if(user) {
            res.status(200).json(user)
        } 
        //If the user with the specified id is not found:
        else{
           res.status(404).json({
               message: "The user with the specified ID does not exist.",
           })
        }
        
    })
    //If there's an error in retrieving the user from the database:
    .catch((error) => {
        res.status(500).json({
            message: "The user information could not be retrieved."
        })
    })

})

//------------------------------------------------------------------------
//updating the users name and bio
server.put("/api/users/:id", (req, res) => {
    //if user does not put a name or bio in, it would return a 400 error and json with message
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({
            message: "Please provide name and bio for the user."
        })
    }
    //if user does put the info in, this will run
    else{
        //update function from db.js is being called, and passing an id and user through arguments
        db.update(req.params.id, req.body)
        //here im passing new user info as a json, and responding with a 200
        .then((updatedUser) => {
            if(updatedUser){
                //HERE IM RETURNING AN 200 HTTP STATUS CODE, AND RETURNING NEW USER UDPATED
                res.status(200).json(updatedUser)
            }
            else{
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                message:"The user information could not be modified."
            })
        })
    }
})
//------------------------------------------------------------------------------------------------------
//Deleting a user
server.delete("/api/users/:id", (req, res)=> {
//pasing user to funtion in the data base (db.js file)    
db.remove(req.params.id)

//This is pretty much saying that if user id is greater than 0 to return a http status 200 and 
//a message (note that deletion here happens on the database by the ID we are sending with
// this line of code db.remove(req.params.id))
.then((userCount) => {
    if (userCount > 0){
        res.status(200).json({
            message: "the user has been deleted"
        })
    }
    else{
        res.status(404).json({
            message:"The user with the specified ID does not exist."
        })
    }
})

.catch((error) => {
    res.status(500).json({
        message: "The user could not be removed"
    })
})

})

//------------------------------------------------------------------------------------------------------
// start the server on localhost at port 3000
server.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`)
})

