import { Injectable } from '@angular/core';
import {Task} from "../interfaces/task.interface"

@Injectable({ providedIn: 'root'})
export class TaskService{
  static counter =  0;
  readonly api:string = 'http://localhost:3000'

  tasks: Task[] = []
  tasksRecycler: Task[] = [];

  constructor() {
    this.loadTasks()
  }

  async loadTasks(){
    console.clear()
    const activeData = await fetch(`${this.api}/tasks`, {method:"GET"}).then(res => res.json())
    const deletedData = await fetch(`${this.api}/deleted`, {method:"GET"}).then(res => res.json())
    console.log(activeData)
    console.log(deletedData)
    this.tasks = activeData
    this.tasksRecycler = deletedData
  }

  async addTask(values:any){
    const {name, description} = values;

    if (!name.value || !description.value) return;

    console.log(this.generateId());
    const newTask = {
      id: this.generateId(),
      name: name.value,
      completed:false,
      description: description.value
    };

    const postData = JSON.stringify(newTask);
    let post = await fetch(`${this.api}/tasks`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: postData
        })

    if (!post.ok) return;

    this.loadTasks()
  }
  completeTask(id:number){
    this.tasks.filter(task => task.id === id)
        .map(task => task.completed = !task.completed)
  }

  edit(id:number){
    this.tasks.filter(task => task.id === id)
        .map(task => task.edit = !task.edit)
  }

  updateTask(id:number, values:any){
    this.tasks.filter(task => task.id === id)
        .map(task => {
          if (!values.newName.value || !values.newDescription.value) return;
          task.name = values.newName.value;
          task.description = values.newDescription.value;
          task.edit = false;
        })
  }
  async deleteTask(id: number) {
    // this.tasks.filter(task => task.id === id)
    //     .map(task => {
    //         this.tasksRecycler.push(task)
    //         this.tasks.splice(this.tasks.indexOf(task), 1)
    //     })

    const deleteTask = await fetch(`${this.api}/delete?id=${id}`, {method:"PATCH"})
    console.log(deleteTask)
    if (!deleteTask.ok) return;

    this.loadTasks()
  }

  async restoreTask(id:number){
    // this.tasksRecycler.filter(task => task.id === id)
    //     .map(task => {
    //         this.tasks.push(task)
    //         this.tasksRecycler.splice(this.tasksRecycler.indexOf(task), 1)
    //     })

    const restoreTask = await fetch(`${this.api}/restore?id=${id}`, {method:"PATCH"})
    console.log(restoreTask)
    if (!restoreTask.ok) return;

    this.loadTasks()
  }

  generateId(){
    const date = new Date();
    const month = (date.getMonth() < 10)? '0'+(date.getMonth() + 1): date.getMonth()+1
    return Number(`${date.getFullYear()}${month}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`)
  }

}