import { Injectable } from '@angular/core';
import { Todo } from '../../../../domain/todo/todo.model';
import { TodoUser } from '../todo-screen/todo-screen.model';
import { TodoItem } from './todo-item.model';

@Injectable({
    providedIn: 'root',
})
export class TodoItemService {
    constructor() {}

    mapTodos(todos: Todo[], users: TodoUser[]): TodoItem[] {
        return todos.map((todo) => this.mapTodo(todo, users));
    }

    mapTodo(todo: Todo, users?: TodoUser[]): TodoItem {
        return {
            id: todo.id,
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed,
            username: this.mapUserWithTodo(todo, users!),
        };
    }

    private mapUserWithTodo(todo: Todo, users: TodoUser[]): string {
        if (!users) return ''
        
        const user = users.find((user) => user.id === todo.userId);
        if (!user) return '';
        return user.name;
    }
}
