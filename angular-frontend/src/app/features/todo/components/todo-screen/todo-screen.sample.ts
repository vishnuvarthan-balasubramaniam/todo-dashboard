import { TodoItem } from '../todo-item/todo-item.model';
import { TodoFilter, TodoScreen, TodoUser } from './todo-screen.model';

export class TodoScreenSample {
    static getUsers(): TodoUser[] {
        return [{ id: 1, name: 'Leanne Graham' }];
    }

    static getTodos(): TodoItem[] {
        return [
            {
                id: 1,
                title: 'delectus aut autem',
                completed: false,
                userId: 1,
                username: 'Leanne Graham',
            },
            {
                id: 2,
                title: 'quis ut nam facilis et officia qui',
                completed: true,
                userId: 1,
                username: 'Leanne Graham',
            },
        ];
    }

    static getMappedTodos(): TodoItem[] {
        return [
            {
                id: 1,
                title: 'delectus aut autem',
                userId: 1,
                completed: false,
                username: 'Leanne Graham'
            },
            {
                id: 2,
                title: 'quis ut nam facilis et officia qui',
                userId: 1,
                completed: true,
                username: 'Leanne Graham'
            }
        ];
  }

    static getInitialState(): TodoScreen {
        return {
            loading: false,
            users: this.getUsers(),
            todoItems: this.getTodos(),
            filter: 'all',
        };
    }

    static getToolbarForCompleted(): TodoFilter {
        return 'completed';
    }
}
