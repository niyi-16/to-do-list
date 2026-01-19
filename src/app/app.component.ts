import { Component } from '@angular/core';
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
      <section class="flex-1 place-items-center bg-blend-color">
        <div class="flex outline-1 w-3/7 shadow-xl mt-6">
          <div routerLink="" 
              class="w-1/2 text-center p-3 outline bg-neutral-200 hover:cursor-pointer hover:brightness-50">TASKS</div>
          <div routerLink="deleted" 
              class="w-1/2 text-center p-3 outline bg-red-200 hover:cursor-pointer hover:brightness-50">DELETED</div>
        </div>  
        
        <div class="mt-6 outline-1 w-3/7 p-3 shadow-xl shadow-gray-600/100 ">
          <inputField class="flex flex-col justify-evenly w-full p-2"/>
          <router-outlet />
        </div>
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
}
