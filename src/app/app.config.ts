import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, Route, Routes} from '@angular/router';
import {TasksComponent, TaskDetetedComponent} from "../components/tasks.component";

const taskRoute:Route = {path: '', component: TasksComponent}
const deletedRoute:Route = {path: 'deleted', component: TaskDetetedComponent}
const routes:Routes = [taskRoute, deletedRoute]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
