import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TodoItem } from '../../components/todo-item/todo-item.model';
import { TodoUser } from '../../components/todo-screen/todo-screen.model';

@Component({
    selector: 'todo-form-dialog',
    imports: [
        MatDialogModule, 
        MatFormFieldModule, 
        MatCheckboxModule, 
        FormsModule, 
        ReactiveFormsModule, 
        MatButtonModule, 
        MatSelectModule, 
        MatInputModule
    ],
    templateUrl: './todo-form-dialog.component.html',
    styleUrl: './todo-form-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormDialogComponent implements OnInit {

    private readonly fb = inject(FormBuilder);
    readonly dialogRef = inject(MatDialogRef<TodoFormDialogComponent>);
    readonly data = inject<{title: string, mode: 'add' | 'edit', todo?: TodoItem, users: TodoUser[]}>(MAT_DIALOG_DATA);
    todoForm!: FormGroup;
    isEditMode = false;


    ngOnInit(): void {
        this.isEditMode = this.data.mode === 'edit';
        this.initTodoForm();
    }

    private initTodoForm(): void {
        const userControlValue = this.isEditMode && this.data.todo ? this.data.users.find(user => user.id === this.data.todo?.userId) : null;
        this.todoForm = this.fb.nonNullable.group({
            title: [this.data.todo?.title || '', Validators.required],
            user: [userControlValue, Validators.required],
            completed: [this.data.todo?.completed ?? false]
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }
    
    save(): void {
        if (this.todoForm.valid) {
            const user: TodoUser = this.todoForm.get('user')?.value;

            const result: TodoItem = {
                ...this.data.todo,
                ...this.todoForm.getRawValue(),
                userId: user.id,
                username: user.name
            };

            this.dialogRef.close(result);
        }
    }
}
