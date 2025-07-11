import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TodoFormDialogComponent } from './todo-form-dialog.component';

describe('TodoFormDialogComponent', () => {
    let component: TodoFormDialogComponent;
    let fixture: ComponentFixture<TodoFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoFormDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
