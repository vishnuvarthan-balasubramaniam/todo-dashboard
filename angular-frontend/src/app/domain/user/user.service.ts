import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly userUrl = 'https://jsonplaceholder.typicode.com/users';

    constructor(private readonly httpClient: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.userUrl);
    }
}
