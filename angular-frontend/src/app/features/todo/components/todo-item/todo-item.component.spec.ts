import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TodoItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
