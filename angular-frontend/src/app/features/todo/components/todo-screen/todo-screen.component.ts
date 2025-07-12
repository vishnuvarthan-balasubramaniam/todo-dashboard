import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TodoFormDialogComponent } from '../../dialogs/todo-form-dialog/todo-form-dialog.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoItem } from '../todo-item/todo-item.model';
import { TodoToolbarComponent } from '../todo-toolbar/todo-toolbar.component';
import { TodoFilter, TodoScreen } from './todo-screen.model';
import { TodoScreenService } from './todo-screen.service';

@Component({
    selector: 'todo-screen',
    templateUrl: './todo-screen.component.html',
    styleUrl: './todo-screen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TodoToolbarComponent, TodoItemComponent, MatProgressSpinnerModule],
})
export class TodoScreenComponent implements OnInit {
    private readonly todoScreenService = inject(TodoScreenService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    todoScreen = signal<TodoScreen>({
        loading: false,
        todoItems: [],
        users: [],
        filter: 'all'
    });

    filteredTodos = computed(() => {
        const state = this.todoScreen();
        return this.filterTodoItems(state);
    });

    todoCounts = computed(() => {
        const { todoItems } = this.todoScreen();
        return {
            all: todoItems.length,
            completed: todoItems.filter(todo => todo.completed).length,
            active: todoItems.filter(todo => !todo.completed).length
        };
    });

    ngOnInit(): void {
        const initState = this.todoScreenService.initTodoScreen(this.todoScreen());
        this.todoScreen.set(initState);

        this.todoScreenService.loadTodoScreen(initState).subscribe((updated) => {
            this.todoScreen.set({ ...updated, loading: false });
        });
    }

    filterChange(filter: TodoFilter): void {
        this.todoScreen.update(state => ({
            ...state,
            filter: filter
        }))
    }

    addTodo(todo: TodoItem): void {
        this.todoScreenService.addTodo(this.todoScreen(), todo).subscribe(updated => {
            this.todoScreen.set({ ...updated, loading: false });
            this.showMessage('Todo added successfully!');
        });
    }

    deleteTodo(todo: TodoItem): void {
        this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Todo',
                message: 'Are you sure you want to delete? This action cannot be undone.',
                cancelText: 'Cancel',
                confirmText: 'Delete'
            }
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.todoScreenService.deleteTodo(this.todoScreen(), todo).subscribe(updated => {
                    this.todoScreen.set({ ...updated, loading: false });
                    this.showMessage('Todo deleted successfully!');
                });
            }
        })
        
    }

    editTodo(todo: TodoItem): void {
       this.dialog.open(TodoFormDialogComponent, {
            height: '350px',
            data: {
                title: 'Edit Todo',
                mode: 'edit',
                todo: todo,
                users: this.todoScreen().users
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.todoScreenService.editTodo(this.todoScreen(), result).subscribe(updated => {
                    this.todoScreen.set({ ...updated, loading: false });
                    this.showMessage('Todo updated successfully!');
                });
            }
        });
    }

    updateTodoStatus(todo: TodoItem): void {
        this.todoScreenService.editTodo(this.todoScreen(), todo).subscribe(updated => {
            this.todoScreen.set({ ...updated, loading: false });
            this.showMessage(`Todo marked as ${todo.completed ? 'completed' : 'active'}!`);
        });
    }

    private filterTodoItems(state: TodoScreen): TodoItem[] {
        const { todoItems, filter } = state;

        switch(filter) {
            case 'completed': return todoItems.filter(todo => todo.completed);
            case 'active': return todoItems.filter(todo => !todo.completed);
            default: return [...todoItems];
        }
    }

    private showMessage(message: string): void {
        this.snackBar.open(message, 'Close', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
    }
}
