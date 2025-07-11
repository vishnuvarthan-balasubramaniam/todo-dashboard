import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoScreenComponent } from "./features/todo/components/todo-screen/todo-screen.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TodoScreenComponent],
})
export class AppComponent {
}
