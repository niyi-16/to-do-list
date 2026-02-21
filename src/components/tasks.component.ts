import {Component, inject, model} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "../services/task.service"
import {NgTemplateOutlet} from "@angular/common";
import {ROUTER_OUTLET_DATA} from "@angular/router";


//Main components
@Component({
    selector: `tasksComponent`,
    host: {'class': 'block w-full'},
    standalone: true,
    imports: [ReactiveFormsModule, NgTemplateOutlet],
    template: `
         @for (dateDue of taskService.dates; track dateDue) {
              <div class="mb-10">
                   <div class="flex items-center gap-4 mb-4">
                        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">
                             {{ dateDue }}
                        </h3>
                        <div class="h-px flex-1 bg-slate-200"></div>
                        <button (click)="taskService.addTask({name: 'New Task', description: '', dateDue: dateDue})"
                                class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Quick add task for this date">
                            <svg class="h-5 w-5">
                                 <use href="/plus.svg"></use>
                            </svg>
                        </button>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        @for (task of tasks; track task.id) {
                             @if (task.dateDue === dateDue) {
                                  <div class="group relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                                       [class.bg-slate-50]="task.completed">
                                       
                                       <div class="task" [class.completed]="task.completed">
                                            <ng-container
                                                    *ngTemplateOutlet="task.edit ? editMode : viewMode; context: { $implicit: task }"/>
                                       </div>
                                  </div>
                             }
                        } @empty {
                             <p class="col-span-full text-center py-8 text-slate-400 italic">No tasks Available.</p>
                        }
                   </div>
              </div>
         }

         <!-- View Mode Template -->
         <ng-template #viewMode let-task>
              <div class="flex flex-col h-full">
                   <div class="flex justify-between items-start mb-2">
                        <h2 class="text-lg font-bold text-slate-800 leading-tight">{{ task.name }}</h2>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button (click)="taskService.completeTask(task.id)" 
                                     class="p-1.5 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg transition-colors"
                                     [title]="task.completed ? 'Mark as incomplete' : 'Mark as complete'">
                                  <svg class="h-5 w-5">
                                       <use href="/mark.svg"></use>
                                  </svg>
                             </button>
                             <button (click)="taskService.edit(task.id); newName.setValue(task.name); newDescription.setValue(task.description)" 
                                     class="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                     title="Edit task">
                                  <svg class="h-5 w-5">
                                       <use href="/edit.svg"></use>
                                  </svg>
                             </button>
                             <button (click)="taskService.deleteTask(task.id)" 
                                     class="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                     title="Delete task">
                                  <svg class="h-5 w-5">
                                       <use href="/delete.svg"></use>
                                  </svg>
                             </button>
                        </div>
                   </div>
                   <p class="text-slate-600 text-sm flex-1">{{ task.description }}</p>
              </div>
         </ng-template>

         <!-- Edit Mode Template -->
         <ng-template #editMode let-task>
              <div class="flex flex-col gap-3">
                   <input type="text" 
                          class="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                          [formControl]="newName" 
                          [defaultValue]="task.name" 
                          placeholder="Task Name">
                   <textarea class="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400" 
                             rows="3"
                             [formControl]="newDescription"
                             [defaultValue]="task.description"
                             [placeholder]="'Task Description'"
                   ></textarea>
                   <div class="flex gap-2 justify-end mt-2">
                        <button (click)="taskService.edit(task.id)" 
                                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancel</button>
                        <button (click)="taskService.updateTask(task.id, {newName, newDescription})"
                                class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium shadow-sm">Save</button>
                   </div>
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
         @if (taskService.tasksRecycler.length > 0) {
              <div class="flex items-center gap-4 mb-6">
                   <h3 class="text-sm font-bold uppercase tracking-wider text-red-400">
                        Deleted tasks
                   </h3>
                   <div class="h-px flex-1 bg-red-100"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   @for (r_task of recycledTasks; track r_task.id) {
                        <div class="group relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm opacity-75">
                             <div class="task completed flex flex-col h-full">
                                  <div class="flex justify-between items-start mb-2">
                                       <h2 class="text-lg font-bold text-slate-800 leading-tight">{{ r_task.name }}</h2>
                                       <button (click)="taskService.restoreTask(r_task.id)"
                                               class="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                                               title="Restore task">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                                       </button>
                                  </div>
                                  <p class="text-slate-600 text-sm flex-1">{{ r_task.description }}</p>
                             </div>
                        </div>
                   }
              </div>
         } @else {
              <div class="flex flex-col items-center justify-center py-20 text-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                   <p class="text-xl font-medium">Trash is empty</p>
              </div>
         }
    `
})
export class TaskDetetedComponent{
    taskService = inject(TaskService)

    get recycledTasks(){
        return this.taskService.tasksRecycler
    }

}
