import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'sneat-datatug-error-card',
  templateUrl: './sneat-error-card.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SneatErrorCardComponent {
  @Input()
  error?: { message?: string };
}
