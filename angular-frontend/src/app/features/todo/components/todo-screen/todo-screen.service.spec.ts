import { TestBed } from '@angular/core/testing';

import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TodoService } from '../../../../domain/todo/todo.service';
import { UserService } from '../../../../domain/user/user.service';
import { TodoItemService } from '../todo-item/todo-item.service';
import { TodoScreenSample } from './todo-screen.sample';
import { TodoScreenService } from './todo-screen.service';

describe('TodoScreenService', () => {
    let service: TodoScreenService;
    let todoServiceSpy: jasmine.SpyObj<TodoService>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let itemServiceSpy: jasmine.SpyObj<TodoItemService>;

    beforeEach(() => {
        const todoSpy = jasmine.createSpyObj('TodoService', ['getTodos', 'addTodo', 'deleteTodo', 'updateTodo']);
        const userSpy = jasmine.createSpyObj('UserService', ['getUsers']);
        const itemSpy = jasmine.createSpyObj('TodoItemService', ['mapTodos', 'mapTodo']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(), 
                provideHttpClientTesting(),
                { provide: TodoService, useValue: todoSpy },
                { provide: UserService, useValue: userSpy },
                { provide: TodoItemService, useValue: itemSpy }
            ]
        });

        service = TestBed.inject(TodoScreenService);
        todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
        userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
        itemServiceSpy = TestBed.inject(TodoItemService) as jasmine.SpyObj<TodoItemService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load todos and users', (done) => {
        const mockTodos = TodoScreenSample.getTodos();
        const mockUsers = TodoScreenSample.getUsers();
        const mockMappedTodos = TodoScreenSample.getMappedTodos();
        const initialState = service.initTodoScreen({ loading: false, todoItems: [], users: [], filter: 'all' });

        userServiceSpy.getUsers.and.returnValue(of(mockUsers));
        todoServiceSpy.getTodos.and.returnValue(of(mockTodos));
        itemServiceSpy.mapTodos.and.returnValue(mockMappedTodos);

        service.loadTodoScreen(initialState).subscribe(state => {
            expect(state.loading).toBeTrue();
            expect(state.todoItems.length).toBe(2);
            expect(state.users.length).toBe(1);
            done();
        });
    });

    it('should add a todo', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const mockNewTodo = TodoScreenSample.getNewTodo();
        todoServiceSpy.addTodo.and.returnValue(of({ ...mockNewTodo }));
        itemServiceSpy.mapTodo.and.returnValue(mockNewTodo);

        service.addTodo(mockCurrentState, mockNewTodo).subscribe(updated => {
            expect(updated.todoItems.length).toBe(3);
            expect(updated.todoItems[0].title).toBe('New Task');
            done();
        });
    });

    it('should delete a todo', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const todoToDelete = mockCurrentState.todoItems[0];
        todoServiceSpy.deleteTodo.and.returnValue(of(new HttpResponse({ status: 200 })));

        service.deleteTodo(mockCurrentState, todoToDelete).subscribe(updated => {
            expect(updated.todoItems.length).toBe(1);
            expect(updated.todoItems.find(t => t.id === todoToDelete.id)).toBeUndefined();
            done();
        });
    });

    it('should return original todo list when status code is not 200', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const todoToDelete = mockCurrentState.todoItems[0];
        todoServiceSpy.deleteTodo.and.returnValue(of(new HttpResponse({ status: 0 })));

        service.deleteTodo(mockCurrentState, todoToDelete).subscribe(updated => {
            expect(updated.todoItems.length).toBe(2);
            expect(updated.todoItems.find(t => t.id === todoToDelete.id)).toBeDefined();
            done();
        });
    });

  it('should edit a todo', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const edited = { ...mockCurrentState.todoItems[0], title: 'Updated Task' };
        todoServiceSpy.updateTodo.and.returnValue(of(edited));
        itemServiceSpy.mapTodo.and.returnValue(edited);

        service.editTodo(mockCurrentState, edited).subscribe(updated => {
            expect(updated.todoItems[0].title).toBe('Updated Task');
            done();
        });
    });
});
