import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-folder',
	templateUrl: './folder-page.component.html',
	styleUrls: ['./folder-page.component.scss'],
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonMenuButton,
		IonTitle,
		IonContent,
	],
})
export class FolderPageComponent implements OnInit {
	private readonly activatedRoute = inject(ActivatedRoute);

	public folder?: string | null;

	ngOnInit() {
		this.folder = this.activatedRoute.snapshot.paramMap.get('id');
	}
}
