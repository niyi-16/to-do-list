import {Component, Directive, inject, TemplateRef, viewChild} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "../services/task.service";

//Main component
@Component({
  selector: "app-fragment",
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
          <button (click)="taskService.completeTask(task.id)" class="btn-hvr rounded-lg bg-green-300 p-4">
            <img class="w-6" src="/edit.svg" alt="Done icon">
          </button>
          <button (click)="taskService.edit(task.id)" class="btn-hvr rounded-lg bg-blue-300 p-4">
            <img class="w-6" src="/details.svg" alt="Edit button">
          </button>
          <button (click)="taskService.deleteTask(task.id)" class="btn-hvr rounded-lg bg-red-600 p-4">
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
export class FragmentComponent {

  taskService = inject(TaskService)
  tasks = this.taskService.tasks;
  newName = new FormControl();
  newDescription = new FormControl();
  ref = []
  //@ts-ignore
  doSome(e){
    console.log(e)
  }
}

