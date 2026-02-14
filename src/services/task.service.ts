import { Injectable } from '@angular/core';
import {Task} from "../interfaces/task.interface"
import {formatDate} from "@angular/common";

@Injectable({ providedIn: 'root'})
export class TaskService{
  static counter =  0;
  readonly api:string = 'http://localhost:3001'

  tasks: Task[] = []
  dates: string[] = []
  tasksRecycler: Task[] = [];
  moreTasks: Task[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Task ${i + 1}`,
    description: `This is a detailed description for task number ${i + 1}.`,
    completed: i % 3 === 0, // Mark every 3rd task as completed
    edit: false,
    deleted: false,
    createdAt: new Date().toISOString(),
    dateDue: formatDate(`2026-01-${16+i}`, "yyyy-MM-dd", "en-US")
  }));
  constructor() {
    this.loadTasks()
  }

  async loadTasks(){
    // console.clear()
    const activeData:{message:string, data:Task[]} = await fetch(`${this.api}/tasks`, {method:"GET"}).then(res => res.json())
    const deletedData:Task[] = await fetch(`${this.api}/deleted`, {method:"GET"}).then(res => res.json())
    console.log(activeData)
    console.log(deletedData)
    // return {activeData, deletedData}
    this.tasks = activeData["data"]
    this.tasks.push(...this.moreTasks)
    this.tasksRecycler = deletedData
    ///////////////////////////////////////
    const dates = new Set(this.tasks.map(task => task.dateDue).sort())
    this.dates = [...new Set(dates)] as string[]
    console.log(this.dates)

  }

  ngAfterInitView(){
  }

  async addTask(values:any){
    console.log(values)
    const {name, description, dateDue} = values;
    console.log(name.value, name)
    // if (!name.value || !description.value) return;

    console.log(this.generateId());
    const newTask = {
      id: this.generateId(),
      name: name.value || name,
      completed:false,
      description: description.value || description,
      dateDue: dateDue.value || dateDue,
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