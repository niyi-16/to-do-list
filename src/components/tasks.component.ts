import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "../services/task.service"
import {NgTemplateOutlet} from "@angular/common";


//Main components
@Component({
    selector: "tasksComponent",
    standalone: true,
    imports: [ReactiveFormsModule, NgTemplateOutlet],
    template: `
         @for (task of tasks; track task.id) {
              <div class="task grid grid-cols-2 grid-rows-1 my-1.5 p-3" [class.completed]="task.completed">
                   <ng-container *ngTemplateOutlet="task.edit ? editMode : viewMode; context: { $implicit: task }"/>
              </div>
         } @empty {
              <p class="text-center text-gray-500">No tasks available.</p>
         }
         
         <!-- View Mode Template -->
         <ng-template #viewMode let-task>
              <div class="col-start-1">
                   <h2 class="row-start-1">{{ task.name }}</h2>
                   <p class="row-start-2">{{ task.description }}</p>
              </div>
              <div class="flex w-2/3 place-self-center-safe justify-between col-start-2 row-span-2">
                   <button (click)="taskService.completeTask(task.id)" 
                           class="btn-hvr rounded-lg bg-green-300 p-4">
                        <img class="w-6" src="/edit.svg" alt="Done icon">
                   </button>
                   <button (click)="taskService.edit(task.id)" 
                           class="btn-hvr rounded-lg bg-blue-300 p-4">
                        <img class="w-6" src="/details.svg" alt="Edit button">
                   </button>
                   <button (click)="taskService.deleteTask(task.id)" 
                           class="btn-hvr rounded-lg bg-red-600 p-4">
                        <img class="w-6" src="/delete.svg" alt="Delete icon">
                   </button>
              </div>
         </ng-template>

         <!-- Edit Mode Template -->
         <ng-template #editMode let-task>
              <div class="grid col-start-1">
                   <input type="text" class="border row-start-1" [formControl]="newName" [placeholder]="task.name">
                   <input type="text" class="border row-start-2" [formControl]="newDescription" [placeholder]="task.description">
              </div>
              <div class="flex col-start-2 row-span-2">
                   <button (click)="taskService.updateTask(task.id, {newName, newDescription})"
                           class="btn-hvr w-20 rounded-lg bg-blue-300 p-4">Done
                   </button>
                   <button (click)="taskService.edit(task.id)" class="btn-hvr w-20 rounded-lg bg-red-300 p-4">Cancel</button>
              </div>
         </ng-template>
    `

})
export class TasksComponent{
    taskService = inject(TaskService)
    newName = new FormControl();
    newDescription = new FormControl();

    get tasks(){
        return this.taskService.tasks
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
