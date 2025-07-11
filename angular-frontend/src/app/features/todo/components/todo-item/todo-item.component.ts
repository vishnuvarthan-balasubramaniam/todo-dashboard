import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TodoItem } from './todo-item.model';

@Component({
    selector: 'app-todo-item',
    imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatCheckboxModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
    @Input() item!: TodoItem;
    @Output() delete = new EventEmitter<TodoItem>();
    @Output() edit = new EventEmitter<TodoItem>();
    @Output() toggleTodoChange = new EventEmitter<TodoItem>();

    editTodo(todo: TodoItem): void {
        this.edit.emit(todo);
    }

    deleteTodo(todo: TodoItem): void {
        this.delete.emit(todo);
    }

    toggleStatus(todo: TodoItem): void {
        this.toggleTodoChange.emit(todo);
    }
}
