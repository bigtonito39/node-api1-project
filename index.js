// implement your API here
const express = require("express")

const server = express()
const port = 3000

//middleware that allows express to parse JSON request bodies
server.use(express.json())

server.get("/", (req, res) => {
    res.json({message:"Testing my server, i will remove this after im done with project"})
})


// start the server on localhost at port 3000
server.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`)
})

