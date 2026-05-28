import { Injectable } from '@angular/core';
import {Task} from "@interfaces/task.interface"
import {formatDate} from "@angular/common";

@Injectable({ providedIn: 'root'})
export class TaskService{
  readonly api:string = import.meta.env["NG_APP_API_URL"];

  tasks: Task[] = []
  dates: string[] = []
  tasksRecycler: Task[] = [];

  async loadTasks(){
    const activeData:{message:string, data:Task[]} = await fetch(`${this.api}/tasks`, {method:"GET"}).then(res => res.json())
    const deletedData:Task[] = await fetch(`${this.api}/deleted`, {method:"GET"}).then(res => res.json())
    console.log("active data", activeData)
    console.log(deletedData)
    // return {activeData, deletedData}
    this.tasks = activeData["data"]
    this.tasksRecycler = deletedData
    ///////////////////////////////////////
    const dates = new Set(this.tasks.map(task => task.dateDue).sort())
    this.dates = [...new Set(dates)] as string[]
    console.log(this.dates)

  }

  async addTask(values:any){
    console.log(values)
    const {name, description, date} = values;
    console.log(name.value, name)
    // if (!name.value || !description.value) return;

    console.log(this.generateId());
    const newTask = {
      id: this.generateId(),
      name: name.value,
      completed:false,
      description: description.value,
      dateDue: date.value,
    };

    const postData = JSON.stringify(newTask);
    let post = await fetch(`${this.api}/tasks`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: postData
        })

    if (!post.ok) return;

    await this.loadTasks()
  }
  async completeTask(id:number){
    this.tasks.filter(task => task.id === id)
        .map(task => task.completed = !task.completed)

    const completeTask = await fetch(`${this.api}/complete?id=${id}`, {method:"PATCH"})
    console.log(completeTask)
    if (!completeTask.ok) return;
  }

  edit(id:number){
    this.tasks.filter(task => task.id === id)
        .map(task => task.edit = !task.edit)
  }

  async updateTask(id: number, values: any) {
    const { newName, newDescription, newDateDue } = values;
    if (!newName.value || newDescription.value === undefined) return;

    const updateData = {
      id: id,
      name: newName.value,
      description: newDescription.value,
      dateDue: newDateDue.value
    };

    let patch = await fetch(`${this.api}/tasks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!patch.ok) return;
    await this.loadTasks();
  }
  async deleteTask(id: number) {
    const deleteTask = await fetch(`${this.api}/delete?id=${id}`, {method:"PATCH"})
    console.log(deleteTask)
    if (!deleteTask.ok) return;

    await this.loadTasks()
  }

  async restoreTask(id:number){
    const restoreTask = await fetch(`${this.api}/restore?id=${id}`, {method:"PATCH"})
    console.log(restoreTask)
    if (!restoreTask.ok) return;

    await this.loadTasks()
  }

  generateId(){
    const date = new Date();
    const month = (date.getMonth() < 10)? '0'+(date.getMonth() + 1): date.getMonth()+1
    return Number(`${date.getFullYear()}${month}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`)
  }

}