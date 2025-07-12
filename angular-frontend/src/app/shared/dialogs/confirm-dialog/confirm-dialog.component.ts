import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'confirm-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
    readonly data = inject<{ title: string; message: string, cancelText: string, confirmText: string }>(MAT_DIALOG_DATA);

    confirmDialog(): void {
        this.dialogRef.close(true);
    }

    cancelDialog(): void {
        this.dialogRef.close(false);
    }
}
