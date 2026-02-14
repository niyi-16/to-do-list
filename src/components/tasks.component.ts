import {Component, inject, model} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "../services/task.service"
import {NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {ROUTER_OUTLET_DATA} from "@angular/router";


//Main components
@Component({
    selector: `tasksComponent`,
    host: {'class': 'flex flex-col flex-wrap p-8 z-0 w-1/1'},
    standalone: true,
    imports: [ReactiveFormsModule, NgTemplateOutlet, NgOptimizedImage],
    template: `
         @for (dateDue of taskService.dates; track dateDue) {
              <div class="w-1/1 my-5">
                   <div class="text-xl font-bold text-blue-400 border-b border-b-gray-300 border-dashed">
                        <span>
                             {{ dateDue }}
                        </span>
                        <button (click)="taskService.addTask({name: 'word', description: 'gyygyg', dateDue: dateDue})"
                                class="border text-green-500  rounded-full w-8 h-8 btn-hvr-drkn">+
                        </button>
                   </div>

                   <!--Under the date-->
                   <div class="flex flex-wrap w-1/1 gap-3 mx-auto debug-r p-3">
                        @for (task of tasks; track task.id) {
                             <!--List all tasks-->
                             @if (task.dateDue === dateDue) {
                                  <!--Group them by dates-->
                                          <!--Task container-->
                                  <div class="w-1/5 max-h-25 border-2 border-gray-300 shadow">

                                       <div class="debug-g task w-19/20 mx-auto grid grid-cols-2 grid-rows-1 px-4"
                                            [class.completed]="task.completed">
                                            <ng-container
                                                    *ngTemplateOutlet="task.edit ? editMode : viewMode; context: { $implicit: task }"/>
                                       </div>
                                  </div>
                             }
                        } @empty {
                             <p class="text-center text-gray-500">No tasks available.</p>
                        }
                   </div>

              </div>
         }

         <!-- View Mode Template -->
         <ng-template #viewMode let-task>
              <div class="col-span-2 bg-amber-200">
                   <div class="row-start-1 grid grid-cols-[auto_auto] debug-b">
                        <h2 class="col-start-1 columns-xl">{{ task.name }}</h2>

                        <div class=" bg-green-100 col-start-2 w-1/1 debug-bk">
                             <div class="flex justify-between">

                                  <img (click)="taskService.completeTask(task.id)"
                                       class="w- cursor-pointer" ngSrc="/edit.svg" alt="Done icon" height="26"
                                       width="26">

                                  <img (click)="taskService.edit(task.id)"
                                       class="w-6 cursor-pointer" ngSrc="/details.svg" alt="Edit button" height="800"
                                       width="800">

                                  <img (click)="taskService.deleteTask(task.id)"
                                       class="w-6 cursor-pointer" ngSrc="/delete.svg" alt="Delete icon" height="800"
                                       width="800">
                             </div>
                        </div>
                   </div>
                   <p class="row-start-2">{{ task.description }}</p>
              </div>

         </ng-template>

         <!-- Edit Mode Template -->
         <ng-template #editMode let-task>
              <div class="grid col-start-1">
                   <input type="text" class="border row-start-1" [formControl]="newName" [placeholder]="task.name">
                   <input type="text" class="border row-start-2" [formControl]="newDescription"
                          [placeholder]="task.description">
              </div>
              <div class="flex col-start-2 row-span-2">
                   <button (click)="taskService.updateTask(task.id, {newName, newDescription})"
                           class="btn-hvr w-20 rounded-lg bg-blue-300 p-4">Done
                   </button>
                   <button (click)="taskService.edit(task.id)" class="btn-hvr w-20 rounded-lg bg-red-300 p-4">Cancel
                   </button>
              </div>
         </ng-template>
    `

})
export class TasksComponent{
    taskService = inject(TaskService)
    newName = new FormControl();
    newDescription = new FormControl();

    data__ = model<boolean>()
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
