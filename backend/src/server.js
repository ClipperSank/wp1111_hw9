import express from 'express'
import cors from 'cors'
import db from './db'
import routes from './routes/index';

const path = require('path')

const app = express()

// init middleware
if(process.env.NODE_ENV === 'development'){
    app.use(cors())
}

app.use(express.json());
db.connect();
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, "../frontend", "build")))
    app.get("/*", function(req, res){
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"))
    })
}
// define routes
app.get("/api", (req, res) => {
    res.send({message: "helo"}).status(200)
})
app.use('/api', routes);





const port = process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})