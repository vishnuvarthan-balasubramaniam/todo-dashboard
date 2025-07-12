import { Todo } from "@domain/todo/todo.model";
import { TodoUser } from "../todo-screen/todo-screen.model";
import { TodoItem } from "./todo-item.model";

export class TodoItemSample {
    static getTodo(): Todo {
        return {
            id: 1,
            userId: 1,
            title: 'delectus aut autem',
            completed: false,
        }
    }

    static getTodoWithNoUser(): Todo {
        return {
            id: 1,
            userId: 10,
            title: 'delectus aut autem',
            completed: false,
        }
    }

    static getTodos(): Todo[] {
        return [
            {
                id: 1,
                userId: 1,
                title: 'delectus aut autem',
                completed: false
            },
            {
                id: 2,
                userId: 1,
                title: 'quis ut nam facilis et officia qui',
                completed: false
            }
        ]
    }

    static getTodoItem(): TodoItem {
        return {
            id: 1,
            userId: 1,
            title: 'delectus aut autem',
            completed: false,
            username: 'Leanne Graham'
        }
    }

    static getTodoItems(): TodoItem[] {
        return [
            {
                id: 1,
                userId: 1,
                title: 'delectus aut autem',
                completed: false,
                username: 'Leanne Graham'
            },
            {
                id: 2,
                userId: 1,
                title: 'quis ut nam facilis et officia qui',
                completed: false,
                username: 'Leanne Graham'
            }
        ]
    }

    static getUsers(): TodoUser[] {
        return [
            { id: 1, name: 'Leanne Graham' },
            { id: 2, name: 'Ervin Howell' }
        ]
    }
}