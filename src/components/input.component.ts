import { Component,inject, model, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from '../services/task.service';

@Component({
    selector: 'inputField',
    imports: [ReactiveFormsModule],
    standalone: true,
    template: `
         <div class="flex flex-col justify-evenly max-w-1/1 p-2">
             <button (click)="visible.set(!visible())" class="btn-hvr-drkn bg-gray-200 w-1/16 self-end rounded-2xl">X</button>
              <div class="flex flex-row gap-4">
                   <input
                           type='text' placeholder="Enter Task Name"
                           [formControl]="taskForm.controls.name"
                           class="block min-w-3/4 bg-gray-200 py-1.5 px-1 text-base my-2  text-gray-900 placeholder:text-gray-400 
                focus:outline-green-600 sm:text-sm/6">

                   <input type="date"
                          [formControl]="taskForm.controls.date"
                          class="block bg-gray-200 w-1/4 py-1.5 px-1 text-base my-2  text-gray-900 placeholder:text-gray-400 ">
              </div>


              <textarea [formControl]="taskForm.controls.description"
                        class="block min-w-0 min-h-50 bg-gray-200 py-1.5 px-1 text-base my-2 resize-none text-gray-900 placeholder:text-gray-400 
                focus:outline sm:text-sm/6" placeholder="Enter Description"></textarea>
              <button (click)="taskService.addTask(this.taskForm.controls)"
                      class="rounded-lg p-3 bg-green-200 hover:brightness-112 cursor-pointer">Add Task
              </button>
         </div>
    `,
})


export class myInput {

    self = inject(ViewContainerRef)
    visible = model<boolean>()

    taskService = inject(TaskService)

    taskForm = new FormGroup({
        name: new FormControl(),
        description: new FormControl(),
        date: new FormControl()
    });

    ngOnInit(){
        const top = this.self.element.nativeElement.offsetTop
        const height = this.self.element.nativeElement.clientHeight
        console.log(
            {
                "innerheight": window.innerHeight,
                "scrollY": window.scrollY,
                "selfHeight": this.self.element.nativeElement.clientHeight,
                "selfTop": this.self.element.nativeElement.offsetTop,
            })

        this.self.element.nativeElement.style.top = `${window.scrollY + (window.innerHeight - height)*.5}px`
    }
    ngOnDestroy(){
        console.log("Component was killed")
    }
}