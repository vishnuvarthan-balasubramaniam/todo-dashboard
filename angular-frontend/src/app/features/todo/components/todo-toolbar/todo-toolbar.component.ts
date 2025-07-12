import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, Signal, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TodoFormDialogComponent } from '../../dialogs/todo-form-dialog/todo-form-dialog.component';
import { TodoItem } from '../todo-item/todo-item.model';
import { TodoFilter, TodoUser } from '../todo-screen/todo-screen.model';

@Component({
    selector: 'todo-toolbar',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
    ],
    templateUrl: './todo-toolbar.component.html',
    styleUrl: './todo-toolbar.component.scss',
})
export class TodoToolbarComponent implements OnInit, OnChanges {
    @Input() users!: TodoUser[];
    @Input() filter!: TodoFilter;
    @Input() counts: { all: number; completed: number; active: number } = {
        all: 0,
        completed: 0,
        active: 0
    };

    @Output() filterChange = new EventEmitter<TodoFilter>();
    @Output() addTodoChange = new EventEmitter<TodoItem>();

    private readonly dialog = inject(MatDialog);

    usersSignal: Signal<TodoUser[]> = signal([]);
    countsSignal = signal(this.counts);
    filterSignal = signal<TodoFilter>('all');

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['counts']) {
            this.countsSignal.set(this.counts);
        }
        if (changes['filter']) {
            this.filterSignal.set(this.filter);
        }
    }

    ngOnInit(): void {
        this.filterSignal.set(this.filter);
    }

    changeStatus(status: TodoFilter) {
        if (status !== this.filterSignal()) {
            this.filterChange.emit(status);
        }
    }

    addTodo(): void {
        this.dialog.open(TodoFormDialogComponent, {
            height: '350px',
            data: {
                title: 'Add Todo',
                mode: 'add',
                users: this.users
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this.addTodoChange.emit(result);
            }
        });
    }
}
