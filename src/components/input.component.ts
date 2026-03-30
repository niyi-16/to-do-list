import { Component,inject, model, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from '../services/task.service';

@Component({
    selector: 'NewTaskForm',
    imports: [ReactiveFormsModule],
    standalone: true,
    template: `
         <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center mb-2">
                   <h3 class="text-xl font-bold text-slate-800">Create New Task</h3>
                   <button (click)="visible.set(false)" 
                           class="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                   </button>
              </div>

              <div class="flex flex-col gap-4">
                   <div class="flex flex-col gap-1">
                        <label class="text-sm font-semibold text-slate-600 ml-1">Task Title</label>
                        <input type='text' placeholder="What needs to be done?"
                               [formControl]="taskForm.controls.name"
                               class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400">
                   </div>

                   <div class="flex flex-col gap-1">
                        <label class="text-sm font-semibold text-slate-600 ml-1">Due Date</label>
                        <input type="date"
                               class="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800"
                               [formControl]="taskForm.controls.date">
                   </div>

                   <div class="flex flex-col gap-1">
                        <label class="text-sm font-semibold text-slate-600 ml-1">Description</label>
                        <textarea [formControl]="taskForm.controls.description"
                                  rows="4"
                                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none" 
                                  placeholder="Add some details..."></textarea>
                   </div>
              </div>

              <div class="flex gap-3 mt-4">
                   <button (click)="visible.set(false)"
                           class="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                        Cancel
                   </button>
                   <button (click)="taskService.addTask(this.taskForm.controls); visible.set(false)"
                           class="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                        Create Task
                   </button>
              </div>
         </div>
    `,
})


export class NewTaskForm {

    self = inject(ViewContainerRef)
    visible = model<boolean>()

    taskService = inject(TaskService)

    taskForm = new FormGroup({
        name: new FormControl(),
        description: new FormControl(),
        date: new FormControl()
    });

    ngOnInit(){
        // Position logic removed as it's now handled by modal container in app.component
    }
    ngOnDestroy(){
        console.log("Component was killed")
    }
}