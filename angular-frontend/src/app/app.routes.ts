import { Routes } from '@angular/router';
import { TodoScreenComponent } from './features/todo/components/todo-screen/todo-screen.component';

export const routes: Routes = [
    { path: '', redirectTo: 'todo-dashboard', pathMatch: 'full' },
    { path: 'todo-dashboard', component: TodoScreenComponent }
];
