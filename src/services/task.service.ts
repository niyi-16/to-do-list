import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class TaskService{
  readonly api:string = import.meta.env["NG_APP_API_URL"];


  async loadTasks(){
    return Promise.all([this.getTasks(), this.getDeletedTasks()])
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
    const deleteTask = await fetch(`${this.api}/tasks?id=${id}`, {method:"DELETE"})
    console.log(deleteTask)
    return deleteTask.ok
  }

  async restoreTask(id:number){
    const restoreTask = await fetch(`${this.api}/tasks/restore?id=${id}`, {method:"PATCH"})
    console.log(restoreTask)
   return restoreTask.ok
  }

  async getTasks(){
    const tasks = await fetch(`${this.api}/tasks`)
    if (!tasks.ok) return;
    return await tasks.json()
  }

  async getDeletedTasks(){
    const tasks = await fetch(`${this.api}/tasks/deleted`)
    if (!tasks.ok) return;
    return await tasks.json()
  }

  generateId(){
    const date = new Date();
    const month = (date.getMonth() < 10)? '0'+(date.getMonth() + 1): date.getMonth()+1
    return Number(`${date.getFullYear()}${month}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`)
  }

}