import { HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Todo } from '@domain/todo/todo.model';
import { TodoService } from '@domain/todo/todo.service';
import { User } from '@domain/user/user.model';
import { UserService } from '@domain/user/user.service';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { TodoItem } from '../todo-item/todo-item.model';
import { TodoItemService } from './../todo-item/todo-item.service';
import { TodoScreen, TodoUser } from './todo-screen.model';

@Injectable({
    providedIn: 'root',
})
export class TodoScreenService {
    private readonly todoService = inject(TodoService);
    private readonly userService = inject(UserService);
    private readonly todoItemService = inject(TodoItemService);

    initTodoScreen(currentState: TodoScreen): TodoScreen {
        return {
            ...currentState,
            loading: true,
            todoItems: [],
            users: [],
            filter: 'all',
        };
    }

    loadTodoScreen(currentState: TodoScreen): Observable<TodoScreen> {
        return forkJoin({
            users: this.userService.getUsers(),
            todos: this.todoService.getTodos(),
        }).pipe(
            map(({ users, todos }) => {
                const mappedUsers = this.mapTodoUsers(users);
                const mappedTodos = this.todoItemService.mapTodos(todos, users);

                return {
                    ...currentState,
                    todoItems: mappedTodos,
                    users: mappedUsers,
                }
            }),
            catchError(error => {
                console.error('Failed to load todo screen:', error);
                return of({
                    ...currentState,
                    loading: false,
                    todoItems: [],
                    users: [],
                });
            })
        );
    }

    addTodo(currentState: TodoScreen, todo: TodoItem): Observable<TodoScreen> {
        const newTodo: Todo = {
            id: this.generateTodoId(currentState),
            title: todo.title,
            userId: todo.userId,
            completed: todo.completed
        }
        return this.todoService.addTodo(newTodo).pipe(
            map((addedTodo: Todo) => {
                const mappedTodoItem = this.todoItemService.mapTodo(addedTodo, currentState.users);
                return {
                    ...currentState,
                    loading: false,
                    todoItems: [mappedTodoItem, ...currentState.todoItems]
                }
            }),
            catchError(error => {
                console.error('Failed to add todo:', error);
                return of({ ...currentState, loading: false });
            })
        )
    }

    deleteTodo(currentState: TodoScreen, todo: TodoItem): Observable<TodoScreen> {
        return this.todoService.deleteTodo(todo).pipe(
            map((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    const updatedTodos = currentState.todoItems.filter(item => item.id !== todo.id);
                    return {
                        ...currentState,
                        loading: false,
                        todoItems: updatedTodos
                    }
                }
                return currentState;
            }),
            catchError(error => {
                console.error('Failed to delete todo:', error);
                return of({ ...currentState, loading: false });
            })
        )
    }

    editTodo(currentState: TodoScreen, todo: TodoItem): Observable<TodoScreen> {
        const editedTodo: Todo = {
            id: todo.id,
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed
        }
        return this.todoService.updateTodo(editedTodo).pipe(
            map((updatedTodo: Todo) => {
                const updatedItem = this.todoItemService.mapTodo(updatedTodo, currentState.users);
                const updatedTodos = currentState.todoItems.map(item => item.id === updatedTodo.id ? updatedItem : item);
                return {
                    ...currentState,
                    loading: false,
                    todoItems: updatedTodos
                }
            }),
            catchError(error => {
                console.error('Failed to update todo:', error);
                return of({ ...currentState, loading: false });
            })
        )
    }

    private generateTodoId(currentState: TodoScreen): number {
        const maxId = currentState.todoItems.length > 0 ? Math.max(...currentState.todoItems.map(todo => todo.id)) : 0;
        return maxId + 1;
    }

    private mapTodoUsers(users: User[]): TodoUser[] {
        return users.map((user) => this.mapTodoUser(user));
    }

    private mapTodoUser(user: User): TodoUser {
        return {
            id: user.id,
            name: user.name,
        };
    }
}
