import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TodoScreenComponent } from './todo-screen.component';
import { TodoScreenSample } from './todo-screen.sample';
import { TodoScreenService } from './todo-screen.service';

describe('TodoScreenComponent', () => {
    let component: TodoScreenComponent;
    let fixture: ComponentFixture<TodoScreenComponent>;
    let mockService: jasmine.SpyObj<TodoScreenService>;
    let mockDialog: jasmine.SpyObj<MatDialog>;


    beforeEach(async () => {
        mockService = jasmine.createSpyObj<TodoScreenService>('TodoScreenService', [
            'initTodoScreen',
            'loadTodoScreen',
            'addTodo',
            'deleteTodo',
            'editTodo'
        ]);
        mockDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        
        await TestBed.configureTestingModule({
            imports: [TodoScreenComponent],
            providers: [
                provideHttpClient(), 
                provideHttpClientTesting(),
                { provide: TodoScreenService, useValue: mockService },
                { provide: MatDialog, useValue: mockDialog }
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoScreenComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should compute filteredTodos correctly for completed', () => {
        const mockState = TodoScreenSample.getInitialState();
        component.todoScreen.set(mockState);

        component.todoScreen.update(state => ({
            ...state,
            filter: 'completed'
        }));

        const completedTodos = component.filteredTodos();
        expect(completedTodos.length).toBe(1);
        expect(completedTodos[0].completed).toBeTrue();
    });

    it('should compute filteredTodos correctly for active', () => {
        const mockState = TodoScreenSample.getInitialState();
        component.todoScreen.set(mockState);

        component.todoScreen.update(state => ({
            ...state,
            filter: 'active'
        }));

        const activeTodos = component.filteredTodos();
        expect(activeTodos.length).toBe(1);
        expect(activeTodos[0].completed).toBeFalse();
    });

    it('should compute filteredTodos correctly for active', () => {
        const mockState = TodoScreenSample.getInitialState();
        component.todoScreen.set(mockState);

        component.todoScreen.update(state => ({
            ...state,
            filter: 'all'
        }));

        const filteredTodos = component.filteredTodos();
        expect(filteredTodos.length).toBe(2);
    });

    it('should compute todoCounts correctly', () => {
        const mockState = TodoScreenSample.getInitialState();
        component.todoScreen.set(mockState);

        const counts = component.todoCounts();
        expect(counts.all).toBe(2);
        expect(counts.completed).toBe(1);
        expect(counts.active).toBe(1);
    });

    it('should load initial todo screen state on init', () => {
        const mockInitState = TodoScreenSample.getInitialState();

        mockService.initTodoScreen.and.returnValue(mockInitState);
        mockService.loadTodoScreen.and.returnValue(of(mockInitState));

        component.ngOnInit();

        expect(mockService.initTodoScreen).toHaveBeenCalled();
        expect(mockService.loadTodoScreen).toHaveBeenCalledWith(mockInitState);
    });

    it('should update filter on filterChange', () => {
        const patch = TodoScreenSample.getToolbarForCompleted();

        component.todoScreen.set(TodoScreenSample.getInitialState());

        component.filterChange(patch);

        expect(component.todoScreen().filter).toBe('completed');
    });

    it('should call addTodo and update signal', () => {
        const updatedState = TodoScreenSample.getInitialState();
        const todo = updatedState.todoItems[0];

        component.todoScreen.set(updatedState);
        mockService.addTodo.and.returnValue(of(updatedState));

        component.addTodo(todo);

        expect(mockService.addTodo).toHaveBeenCalledWith(component.todoScreen(), todo);
    });

    it('should call deleteTodo after confirmation', () => {
        const updatedState = TodoScreenSample.getInitialState();
        const todo = updatedState.todoItems[0];

        mockDialog.open.and.returnValue({
        afterClosed: () => of(true)
        } as any);

        mockService.deleteTodo.and.returnValue(of(updatedState));

        component.todoScreen.set(updatedState);
        component.deleteTodo(todo);

        expect(mockService.deleteTodo).toHaveBeenCalledWith(component.todoScreen(), todo);
    });

    it('should call editTodo after dialog result', () => {
        const updatedState = TodoScreenSample.getInitialState();
        const todo = updatedState.todoItems[0];

        mockDialog.open.and.returnValue({
        afterClosed: () => of(todo)
        } as any);

        mockService.editTodo.and.returnValue(of(updatedState));

        component.todoScreen.set(updatedState);
        component.editTodo(todo);

        expect(mockService.editTodo).toHaveBeenCalledWith(component.todoScreen(), todo);
    });
});
