
import { TodoItem } from '../todo-item/todo-item.model';

export interface TodoScreen {
    loading: boolean;
    todoItems: TodoItem[];
    users: TodoUser[];
    filter: TodoFilter;
}

export interface TodoUser {
    id: number;
    name: string;
}

export type TodoFilter = 'all' | 'completed' | 'active';
