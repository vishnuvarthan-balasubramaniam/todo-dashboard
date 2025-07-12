import { TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TodoService } from "./todo.service";

describe("TodoService", () => {
	let service: TodoService;

	beforeEach(() => {
		TestBed.configureTestingModule({
            providers: [ provideHttpClient(), provideHttpClientTesting() ]
        });
		service = TestBed.inject(TodoService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
