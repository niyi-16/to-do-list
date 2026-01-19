import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

import { TaskService} from '../components/tasks.component';

@Component({
    selector: 'inputField',
    imports: [ReactiveFormsModule],
    standalone: true,
    template: `
         <input 
                type='text' placeholder="Enter Task Name"
                [formControl]="taskForm.controls.name"
                class="block min-w-0 bg-gray-200 py-1.5 px-1 text-base my-2  text-gray-900 placeholder:text-gray-400 
                focus:outline-green-600 sm:text-sm/6">
         
         <textarea [formControl]="taskForm.controls.description"
                   class="block min-w-0 bg-gray-200 py-1.5 px-1 text-base my-2  text-gray-900 placeholder:text-gray-400 
                focus:outline sm:text-sm/6" placeholder="Enter Description"></textarea>
         <button (click)="taskService.addTask(this.taskForm.controls)" 
                 class="rounded-lg p-3 bg-green-200 hover:brightness-112 cursor-pointer">Add Task</button>
         
    `,
})


export class myInput {
    taskService = inject(TaskService)

    taskForm = new FormGroup({
        name: new FormControl(),
        description: new FormControl()
    });

}