import {Component, inject, OnInit} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "../services/task.service"


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

                             <div class="col-start-2 row-span-2 flex w-2/3 justify-between place-self-center-safe">
                                  <button (click)="taskService.completeTask(task.id)"
                                          class="btn-hvr rounded-lg p-4 bg-green-300">
                                       <img class="w-6" src="/edit.svg" alt="Done icon">
                                  </button>
                                  <button (click)="taskService.edit(task.id)"
                                          class="btn-hvr rounded-lg p-4 bg-blue-300">
                                       <img class="w-6" src="/details.svg" alt="Edit button">
                                  </button>
                                  <button (click)="taskService.deleteTask(task.id)"
                                          class="btn-hvr rounded-lg p-4 bg-red-600">
                                       <img class="w-6" src="/delete.svg" alt="Delete icon">
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

                        <div class="col-start-2 row-span-2 mr-3 justify-between place-self-end">
                             <button (click)="taskService.restoreTask(r_task.id)"
                                     class="btn-hvr rounded-lg px-4 py-2 bg-black text-white">
                                  Restore
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

