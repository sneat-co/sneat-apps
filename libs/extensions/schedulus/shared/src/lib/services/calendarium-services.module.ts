import { Component, NgModule } from '@angular/core';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { HappeningSlotModalService } from '../components/happening-slot-form/happening-slot-modal.service';
// import { CalendarNavService } from './calendar-nav.service';
// import { CalendariumSpaceService } from './calendarium-space.service';
// import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-calendarium',
	template: `CalendariumComponent`,
	standalone: false,
})
export class CalendariumComponent {}

@NgModule({
	// providers: [
	// 	// CalendariumSpaceService,
	// 	// HappeningSlotModalService,
	// 	// CalendarNavService,
	// ],
	declarations: [CalendariumComponent],
	exports: [CalendariumComponent],
	// imports: [
	// 	// IonicModule, // required by HappeningSlotModalService
	// 	// AngularFirestoreModule, // required by CalendariumSpaceService
	// ],
})
export class CalendariumServicesModule {}
