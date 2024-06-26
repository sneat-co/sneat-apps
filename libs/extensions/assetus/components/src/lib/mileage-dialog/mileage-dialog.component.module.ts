import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MileAgeDialogComponent } from '../mileage-dialog/mileage-dialog.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
	declarations: [MileAgeDialogComponent],
})
export class MileageDialogComponentModule {}
