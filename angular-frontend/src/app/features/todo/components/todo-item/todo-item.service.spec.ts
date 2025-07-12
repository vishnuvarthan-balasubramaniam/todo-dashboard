import { TestBed } from '@angular/core/testing';

import { Todo } from '../../../../domain/todo/todo.model';
import { TodoUser } from '../todo-screen/todo-screen.model';
import { TodoItemSample } from './todo-item.sample';
import { TodoItemService } from './todo-item.service';

describe('TodoItemService', () => {
    let service: TodoItemService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TodoItemService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should map Todo and matching user to TodoItem', () => {
        const mockTodo: Todo = TodoItemSample.getTodo();
        const mockUsers: TodoUser[] = TodoItemSample.getUsers();
        const result = service.mapTodo(mockTodo, mockUsers);

        expect(TodoItemSample.getTodoItem()).toEqual(result);
    });

    it('should set empty username if user is not found', () => {
      const mockTodoWithNoUser: Todo = TodoItemSample.getTodoWithNoUser();
      const mockUsers: TodoUser[] = TodoItemSample.getUsers();
      const result = service.mapTodo(mockTodoWithNoUser, mockUsers);

      expect(result.username).toBe('');
    });

    it('shoud set empty string when users not available', () => {
        const mockTodo: Todo = TodoItemSample.getTodo();
        const mockUsers = undefined;
        const result = service.mapTodo(mockTodo, mockUsers);

        expect(result.username).toBe('');
    })

    it('should map list of Todos to TodoItems', () => {
        const mockTodos: Todo[] = TodoItemSample.getTodos();
        const mockUsers: TodoUser[] = TodoItemSample.getUsers();
        const result = service.mapTodos(mockTodos, mockUsers);
        
        expect(TodoItemSample.getTodoItems()).toEqual(result);
    });
});
