import { Component, ViewChild, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  ModalController,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

@Component({
  selector: 'sneat-datatug-new-card-dialog',
  templateUrl: './new-card-dialog.component.html',
  styleUrls: ['./new-card-dialog.component.scss'],
  imports: [
    IonItemDivider,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonList,
    IonCard,
    IonContent,
  ],
})
export class NewCardDialogComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly modalCtrl = inject(ModalController);

  public cardTitle?: string;

  @ViewChild(IonInput) inputTitle?: IonInput;

  ionViewDidEnter() {
    setTimeout(() => {
      this.inputTitle
        ?.setFocus()
        .catch((err) =>
          this.errorLogger.logError(err, 'Failed to set focus to title input'),
        );
    }, 100);
  }

  selectCardType(cardType: 'sql' | 'http'): void {
    this.modalCtrl
      .dismiss({ cardType, title: this.cardTitle })
      .catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
  }

  cancel(): void {
    this.modalCtrl
      .dismiss()
      .catch(
        this.errorLogger.logErrorHandler('Failed to dismiss modal on cancel'),
      );
  }
}
