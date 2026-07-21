import express from 'express'
import cors from 'cors'
import "dotenv/config"
import {dbrouter} from "./dbserver.js";

const port = process.env.PORT || 3001;

const app = express();


app.use(cors({ origin: '*'}))
app.use(express.json());
app.use(express.static('dist/to-do-list/browser'));
app.use(express.urlencoded({ extended: true }));

app.use("/api/tasks", dbrouter)

app.get("/", (req, res) => {
    res.sendFile('index.html')
})
app.listen(port, (error) =>{
    console.log(`Example app listening on port http://localhost:${port}`)});