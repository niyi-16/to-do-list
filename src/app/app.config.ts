import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, Route, Routes} from '@angular/router';
import {TasksComponent, TaskDetetedComponent} from "../components/tasks.component";
import {FragmentComponent} from "../components/fragment.component";


const taskRoute:Route = {path: '', component: TasksComponent}
const deletedRoute:Route = {path: 'deleted', component: TaskDetetedComponent}
const fragmentRoute:Route = {path: 'fragment', component: FragmentComponent}
const routes:Routes = [taskRoute, deletedRoute, fragmentRoute]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
