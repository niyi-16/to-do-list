import {
  Component,
  HostListener,
  inject,
  signal,
  ViewContainerRef, ViewRef,

} from '@angular/core';
import { NewTaskForm} from '../components/input.component';
import { TasksComponent} from "../components/tasks.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [NewTaskForm, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main class="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <!-- Header / Nav -->
      <header class="bg-teal-600 text-white shadow-md p-4 sticky top-0 z-30">
        <div class="max-w-5xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold tracking-tight">TASKS APP</h1>
          <nav class="flex gap-2">
            <a routerLink="" routerLinkActive="bg-blue-700 shadow-inner" [routerLinkActiveOptions]="{exact: true}"
               class="px-4 py-2 rounded-md transition-colors hover:bg-blue-500 font-medium">Dashboard</a>
            <a routerLink="deleted" routerLinkActive="bg-red-700 shadow-inner"
               class="px-4 py-2 rounded-md transition-colors hover:bg-red-500 font-medium text-red-100">Deleted</a>
          </nav>
        </div>
      </header>
      
      <!-- Main Content Area -->
      <section class="flex-1 max-w-5xl w-full mx-auto p-6">
        
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-800">Your Tasks</h2>
            <p class="text-slate-500">Organize your day efficiently.</p>
          </div>
          <button (click)="elementsDisplay.tasks.set(!elementsDisplay.tasks())"
                  class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-95">
            <svg  class="h-5 w-5">
              <use href="/plus.svg"></use>
            </svg>
            Add New Task
          </button>
        </div>

        <div class="relative">
          <router-outlet />
        </div>
        
        @if (elementsDisplay.tasks()){
          <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
               (click)="$event.target === $event.currentTarget && elementsDisplay.tasks.set(false)">
            <NewTaskForm [(visible)]="elementsDisplay.tasks" 
                        class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all animate-in zoom-in duration-200" />
          </div>
        }
            
      </section>
    </main>
  ` ,
})
export class AppComponent {
  title = 'to-do-list';
  self = inject(ViewContainerRef)
  // div = viewChild(NewTaskForm)
  elementsDisplay = {
    tasks: signal(false),
  }

  constructor(){}

  @HostListener("window:keydown.alt.a", ["$event"])
  onAltA(event: KeyboardEvent) {
    console.log("Alt + A pressed")
    this.elementsDisplay.tasks.set(!this.elementsDisplay.tasks())
  }

}
