import {
  Component,
  inject,
  signal,
  ViewContainerRef, ViewRef,

} from '@angular/core';
import { myInput} from '../components/input.component';
import { TasksComponent} from "../components/tasks.component";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [myInput, RouterOutlet, RouterLink],
  template: `
    <main class="flex flex-col h-full ">
      <!--Nav section-->
      <div class="ng-gradient h-10">
        <p class="text-center">ANGULAR TO DO LIST.</p>
      </div>
      
      <!--main body-->
      <section class="flex-1 flex flex-col place-items-center">
        
        <div class="flex outline-1 w-3/7 shadow-xl mt-6">
          <div routerLink="" 
              class="w-1/2 text-center p-3 outline bg-neutral-200 hover:cursor-pointer hover:brightness-50">TASKS</div>
          <div routerLink="deleted" 
              class="w-1/2 text-center p-3 outline bg-red-200 hover:cursor-pointer hover:brightness-50">DELETED</div>
        </div>
        
        <div>
          <button (click)="elementsDisplay.tasks.set(!elementsDisplay.tasks())"
                class="my-3 btn-hvr rounded-lg bg-blue-300 p-4">Add New Task</button>
        </div>

        
        <router-outlet  />
        
          @if (elementsDisplay.tasks()){
            <inputField [(visible)]="elementsDisplay.tasks" class="absolute z-20 mt-6 outline-1 w-1/3 p-3 
            bg-neutral-100 shadow-xl shadow-gray-600/100 " />
          }
            
      </section>
    </main>

    <style>
      
      .ng-gradient{
        background: linear-gradient(135deg, #DD0031 0%, #E2324D 50%, #591c61 100%,#070606 25%);
      }
     
    </style>
  ` ,
})
export class AppComponent {
  title = 'to-do-list';
  self = inject(ViewContainerRef)
  // div = viewChild(myInput)
  elementsDisplay = {
    tasks: signal(false),
  }

  constructor(){
    console.log(window.innerHeight, window.outerHeight, window.scrollY)

    document.addEventListener("keydown", (key) => {
      if (key.altKey && key.key === "a") {
        console.log("Alt + A pressed")
        this.elementsDisplay.tasks.set(!this.elementsDisplay.tasks())
      }
    })

  }

  ngAfterViewInit(){
    this.self.element.nativeElement.onKeyDown = (key:KeyboardEvent) =>
      console.log(key)

  }

}
