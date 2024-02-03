import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataGridComponent } from '@sneat/datagrid';
import { OrderContainersGridComponent } from './order-containers-grid.component';

@NgModule({
	imports: [CommonModule, IonicModule, RouterModule, DataGridComponent],
	declarations: [OrderContainersGridComponent],
	exports: [OrderContainersGridComponent],
})
export class OrderContainersGridModule {}
