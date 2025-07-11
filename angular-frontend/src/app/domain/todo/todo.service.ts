import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from '../../features/todo/components/todo-item/todo-item.model';
import { Todo } from './todo.model';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private readonly todoUrl = 'https://jsonplaceholder.typicode.com/todos';

    constructor(private readonly httpClient: HttpClient) {}

    getTodos(): Observable<Todo[]> {
        return this.httpClient.get<Todo[]>(this.todoUrl);
    }

    deleteTodo(item: TodoItem): Observable<HttpResponse<any>> {
        return this.httpClient.delete<any>(this.todoUrl + `/${item.id}`, { observe: 'response' })
    }

    updateTodo(item: Todo): Observable<Todo> {
        return this.httpClient.put<Todo>(this.todoUrl + `/${item.id}`, item);
    }

    addTodo(item: Todo): Observable<Todo> {
        return this.httpClient.post<Todo>(this.todoUrl, item)
    }
}
