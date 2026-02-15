import express from 'express'
import cors from 'cors'
import fs from 'fs'
import {DatabaseSync} from "node:sqlite"

let port = 3001;
let app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//creates database if it doesn't exist
if (!fs.existsSync('src/tasks.db')) {
    console.log("Database doesn't exist, creating...")
    const db = new DatabaseSync('src/tasks.db')
    db.exec(`create table tasks
             (
                 id          varchar(12)
                     primary key,
                 name        varchar(255),
                 description varchar(225),
                 completed   boolean default false,
                 created_at  timestamp,
                 deleted     boolean default false,
                 dateDue     date
             );`)
}

else console.log("Database already exists")

// GET ALL OPEN TASKS
app.get("/tasks", (req, res) => {
    const db = new DatabaseSync('src/tasks.db')

    let tasks = db.prepare("SELECT * FROM tasks where deleted = 0").all();

    res.status(200).send(
        {
            message: "Hello",
            data: tasks
        }
    )

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

    let insert = db.prepare(`INSERT INTO tasks (id, name, description, completed, created_at, dateDue)
        VALUES (?, ?, ?, ?, current_timestamp, ?)`)

    try {
        insert.run(body.id.toString(), body.name, body.description, body.completed? 1: 0, body.dateDue)
        res.status(201).send({message: "Task added"})
    }
    catch (e) {
        res.status(404).send(e)
    }

})

//update task
app.patch("/tasks", (req, res) => {
    const {id, ...others} = req.body

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    const updates = Object.keys(others).map(key => `${key} = ?`).join(', ')
    const values = Object.values(others)

    if (updates.length === 0) return res.status(400).send("No fields to update")

    try {
        db.prepare(`UPDATE tasks SET ${updates} WHERE id = ?`).run(...values, id.toString())
        res.send({message: "Task updated"})
    } catch (e) {
        res.status(500).send(e)
    }
})

//'delete' task
app.patch("/delete", (req, res) => {
    const {id} = req.query

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    db.prepare(`Update tasks set deleted = 1 WHERE id = ? `).run(id.toString())
    res.send({message: "Task deleted"})
})

app.patch("/restore", (req, res) => {
    const {id} = req.query

    if (!id) return res.status(404).send("No id provided")

    const db = new DatabaseSync('src/tasks.db')

    db.prepare(`Update tasks set deleted = 0 WHERE id = ? `).run(id.toString())
    res.send({message: "Task restored!"})
})

app.listen(port, (error) =>{
    console.log(`Example app listening on port http://localhost:${port}`)});

