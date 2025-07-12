import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { of } from "rxjs";
import { TodoItem } from "../todo-item/todo-item.model";
import { TodoToolbarComponent } from "./todo-toolbar.component";

describe("TodoToolbarComponent", () => {
	let component: TodoToolbarComponent;
	let fixture: ComponentFixture<TodoToolbarComponent>;
	let dialogSpy: jasmine.SpyObj<MatDialog>;

	beforeEach(async () => {
		dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
		
		await TestBed.configureTestingModule({
			imports: [TodoToolbarComponent],
			providers: [{ provide: MatDialog, useValue: dialogSpy }]
		}).compileComponents();

		fixture = TestBed.createComponent(TodoToolbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it('should emit filterChange when changeStatus() is called with a new value', () => {
		spyOn(component.filterChange, 'emit');
		component.filterSignal.set('all');
		component.changeStatus('completed');

		expect(component.filterChange.emit).toHaveBeenCalledWith('completed');
	});

	it('should NOT emit filterChange, if status is same', () => {
		spyOn(component.filterChange, 'emit');
		component.filterSignal.set('all');
		component.changeStatus('all');

		expect(component.filterChange.emit).not.toHaveBeenCalled();
	});

	it('should open dialog and emit addTodoChange after close', () => {
		const mockResult: TodoItem = {
			id: 1,
			title: 'delectus aut autem',
			completed: false,
			userId: 1,
			username: 'Leanne Graham'
		};

		const mockDialogRef = { afterClosed: () => of(mockResult) } as MatDialogRef<any>;
		dialogSpy.open.and.returnValue(mockDialogRef);

		spyOn(component.addTodoChange, 'emit');
		component.users = [{ id: 1, name: 'Leanne Graham' }];
		component.addTodo();

		expect(dialogSpy.open).toHaveBeenCalled();
		expect(component.addTodoChange.emit).toHaveBeenCalledWith(mockResult);
	});

	it('should not emit addTodoChange when dialog is cancelled', () => {
		const mockDialogRef = { afterClosed: () => of(undefined) } as MatDialogRef<any>;
		dialogSpy.open.and.returnValue(mockDialogRef);

		spyOn(component.addTodoChange, 'emit');
		component.users = [{ id: 1, name: 'Leanne Graham' }];
		component.addTodo();

		expect(dialogSpy.open).toHaveBeenCalled();
		expect(component.addTodoChange.emit).not.toHaveBeenCalled();
	});
});
