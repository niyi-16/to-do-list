import express from 'express'
import cors from 'cors'
import {DatabaseSync} from "node:sqlite"

let port = 3000;
let app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET ALL OPEN TASKS
app.get("/tasks", (req, res) => {
    const db = new DatabaseSync('src/tasks.db')

    let tasks = db.prepare("SELECT * FROM tasks where deleted = 0").all();

    res.json(tasks)
})

// GET DELETED TASKS
app.get("/deleted", (req, res) => {
    const db = new DatabaseSync('src/tasks.db')
    let tasks = db.prepare("SELECT * FROM tasks WHERE deleted = 1").all();

    res.json(tasks)
})

// ADD NEW TASK
app.post("/tasks", (req, res) => {
    const db = new DatabaseSync('src/tasks.db')

    let body = req.body;
    console.log(body);

    let insert = db.prepare(`INSERT INTO tasks (id, name, description, completed, created_at)
        VALUES (?, ?, ?, ?, current_timestamp)`)

    try {
        insert.run(body.id.toString(), body.name, body.description, body.completed? 1: 0)
        res.send("Task added")
    }
    catch (e) {
        res.status(404).send(e)
    }

})

//update task
app.patch("/tasks", (req, res) => {
    const {id, ...others} = req.query

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    Object.keys(others).forEach(key => {})
})

//'delete' task
app.patch("/delete", (req, res) => {
    const {id} = req.query

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    db.prepare(`Update tasks set deleted = true WHERE id = ? `).run(id)
    res.send("Task deleted")
})

app.patch("/restore", (req, res) => {
    const {id} = req.query

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    db.prepare(`Update tasks set deleted = false WHERE id = ? `).run(id)
    res.send("Task restored!")
})
app.listen(port, (error) =>{
    console.log(`Example app listening on port http://localhost:${port}`)});

