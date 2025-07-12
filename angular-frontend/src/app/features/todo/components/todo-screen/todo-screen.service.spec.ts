import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoService } from '@domain/todo/todo.service';
import { UserService } from '@domain/user/user.service';
import { of } from 'rxjs';
import { TodoItemService } from '../todo-item/todo-item.service';
import { TodoScreenSample } from './todo-screen.sample';
import { TodoScreenService } from './todo-screen.service';

describe('TodoScreenService', () => {
    let service: TodoScreenService;
    let todoServiceSpy!: jasmine.SpyObj<TodoService>;
    let userServiceSpy!: jasmine.SpyObj<UserService>;
    let itemServiceSpy!: jasmine.SpyObj<TodoItemService>;

    beforeEach(() => {
        todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTodos', 'addTodo', 'deleteTodo', 'updateTodo']);
        userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
        itemServiceSpy = jasmine.createSpyObj('TodoItemService', ['mapTodos', 'mapTodo']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(), 
                provideHttpClientTesting(),
                { provide: TodoService, useValue: todoServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TodoItemService, useValue: itemServiceSpy }
            ]
        });

        service = TestBed.inject(TodoScreenService);
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
            expect(updated.todoItems[0].title).toBe('quis ut nam');
            done();
        });
    });

    it('should delete a todo', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const todoToDelete = mockCurrentState.todoItems[0];
        todoServiceSpy.deleteTodo.and.returnValue(of(new HttpResponse({ status: 200 })));

        service.deleteTodo(mockCurrentState, todoToDelete).subscribe(updated => {
            expect(updated.todoItems.length).toBe(1);
            expect(updated.todoItems.find(todo => todo.id === todoToDelete.id)).toBeUndefined();
            done();
        });
    });

    it('should return original todo list when status code is not 200', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const todoToDelete = mockCurrentState.todoItems[0];
        todoServiceSpy.deleteTodo.and.returnValue(of(new HttpResponse({ status: 0 })));

        service.deleteTodo(mockCurrentState, todoToDelete).subscribe(updated => {
            expect(updated.todoItems.length).toBe(2);
            expect(updated.todoItems.find(todo => todo.id === todoToDelete.id)).toBeDefined();
            done();
        });
    });

  it('should edit a todo', (done) => {
        const mockCurrentState = TodoScreenSample.getInitialState();
        const editedTodo = { ...mockCurrentState.todoItems[0], title: 'Updated Task' };
        todoServiceSpy.updateTodo.and.returnValue(of(editedTodo));
        itemServiceSpy.mapTodo.and.returnValue(editedTodo);

        service.editTodo(mockCurrentState, editedTodo).subscribe(updated => {
            expect(updated.todoItems[0].title).toBe('Updated Task');
            done();
        });
    });
});
