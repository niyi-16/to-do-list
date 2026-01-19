import {Component, inject, Injectable, OnInit} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";


@Component({
    selector: "tasksComponent",
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
         @if (tasks.length > 0) {
              @for (task of tasks; track task.id) {

                   <div class="task p-3 my-1.5 grid grid-cols-2 grid-rows-1"
                        [class]="{completed :task.completed}">
                        <!--Start edit-->
                        @if (task.edit) {
                             <input type="text" class="border col-start-1 row-start-1"
                                    [formControl]="newName" [placeholder]="task.name">
                             <input type="text" class="border col-start-1 row-start-2"
                                    [formControl]="newDescription" [placeholder]="task.description">

                             <div class="col-start-2 row-span-2 flex">

                                  <button (click)="taskService.updateTask(task.id, {newName, newDescription})"
                                          class="btn-hvr rounded-lg p-4 w-20 bg-blue-300">
                                       Done
                                  </button>
                                  <button (click)="taskService.edit(task.id)"
                                          class="btn-hvr rounded-lg p-4 w-20 bg-red-300">
                                       Cancel
                                  </button>
                             </div>
                        } @else {
                             <h2 class="col-start-1 row-start-1">{{ task.name }}</h2>
                             <p class="col-start-1 row-start-2">{{ task.description }}</p>

                             <div class="col-start-2 row-span-2 flex justify-between">
                                  <button (click)="taskService.completeTask(task.id)"
                                          class="btn-hvr rounded-lg p-4 w-1/3 bg-green-300">
                                       Done
                                  </button>
                                  <button (click)="taskService.edit(task.id)"
                                          class="btn-hvr rounded-lg p-4 w-1/3 bg-blue-300">
                                       Edit
                                  </button>
                                  <button (click)="taskService.deleteTask(task.id)"
                                          class="btn-hvr rounded-lg p-4 w-1/3 bg-red-600">
                                       Delete
                                  </button>
                             </div>
                        }
                   </div>
              }
         }

    `

})
export class TasksComponent implements OnInit{
    taskService = inject(TaskService)

    get tasks(){
        return this.taskService.tasks
    }

    newName = new FormControl();
    newDescription = new FormControl();

    ngOnInit(){
        this.taskService.loadTasks()
    }
}

@Component({
    selector: 'taskDeleted',
    standalone: true,
    template: `
         <!--Deleted Tasks-->
         @if (taskService.tasksRecycler.length > 0) {
              <h2 class="text-red-400">Deleted tasks</h2>
              @for (r_task of recycledTasks; track r_task.id) {
                   <div class="task p-3 my-1.5 grid grid-cols-2 grid-rows-1"
                        [class]="{completed :r_task.completed}">
                        <h2 class="col-start-1 row-start-1">{{ r_task.name }}</h2>
                        <p class="col-start-1 row-start-2">{{ r_task.description }}</p>

                        <div class="col-start-2 row-span-2 flex justify-between outline">
                             <button (click)="taskService.restoreTask(r_task.id)"
                                     class="btn-hvr rounded-lg p-4 w-20 bg-black text-white">Restore
                             </button>
                        </div>
                   </div>
              }
         }
    `
})
export class TaskDetetedComponent{
    taskService = inject(TaskService)

    get recycledTasks(){
        return this.taskService.tasksRecycler
    }

}


@Injectable({ providedIn: 'root'})
export class TaskService{
    static counter =  0;
    readonly api:string = 'http://localhost:3000'

    tasks: TaskInterface[] = []
    tasksRecycler: TaskInterface[] = [];

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

        // this.tasks.push(newTask);
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
export interface TaskInterface{
    id: number;
    name: string;
    completed: boolean;
    description: string;
    edit?: boolean;
    deleted?: boolean;
    createdAt?: string;
}
