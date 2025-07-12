import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TodoItem } from '../../components/todo-item/todo-item.model';
import { TodoUser } from '../../components/todo-screen/todo-screen.model';
import { TodoFormDialogComponent } from './todo-form-dialog.component';

describe('TodoFormDialogComponent', () => {
    let component: TodoFormDialogComponent;
    let fixture: ComponentFixture<TodoFormDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TodoFormDialogComponent>>;

    const mockUsers: TodoUser[] = [
        { id: 1, name: 'Leanne Graham' },
        { id: 2, name: 'Ervin Howell' }
    ];

    const mockTodo: TodoItem = {
        id: 1,
        userId: 1,
        title: 'delectus aut autem',
        completed: false,
        username: 'Leanne Graham'
    };

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [TodoFormDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { 
                    provide: MAT_DIALOG_DATA, 
                    useValue: {
                        title: 'Edit Todo',
                        mode: 'edit',
                        todo: mockTodo,
                        users: mockUsers
                    }
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize todoform in edit mode', () => {
        expect(component.todoForm).toBeDefined();
        expect(component.todoForm.get('title')?.value).toBe(mockTodo.title);
        expect(component.todoForm.get('completed')?.value).toBe(mockTodo.completed);
        expect(component.todoForm.get('user')?.value).toEqual(mockUsers[0]);
    });

    it('should close dialog with result when save() is called and form is valid', () => {
        component.todoForm.get('title')?.setValue('Updated Title');
        component.todoForm.get('user')?.setValue(mockUsers[1]);
        component.todoForm.get('completed')?.setValue(true);

        component.save();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
            title: 'Updated Title',
            userId: 2,
            username: 'Ervin Howell',
            completed: true
        }));
    });

    it('should close dialog without result on cancel() is called', () => {
        component.cancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
});
