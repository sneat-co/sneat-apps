import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { IBoolMetricVal, ISpaceDbo, ISpaceMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

@Component({
  selector: 'sneat-metrics',
  templateUrl: './metrics.component.html',
  imports: [
    IonList,
    IonItemDivider,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonSpinner,
    IonCardContent,
    IonCard,
    IonText,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly spaceService = inject(SpaceService);
  private readonly navController = inject(NavController);
  readonly navService = inject(SpaceNavService);

  public readonly space = input<IRecord<ISpaceDbo>>();

  public readonly deletingMetrics = signal<string[]>([]);

  private readonly demoMetrics = ['cc', 'bb', 'wfh'];

  public readonly isDemoMetricsOnly = computed<boolean>(() => {
    const metrics = this.space()?.dbo?.metrics;
    if (!metrics || metrics.length !== this.demoMetrics.length) {
      return false;
    }
    return !metrics.find((m, i) => m.id !== this.demoMetrics[i]);
  });

  public deleteDemoMetrics(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const space = this.space();
    if (!space) {
      throw 'no team';
    }
    this.deletingMetrics.update((v) => [...v, ...this.demoMetrics]);
    const complete = () =>
      this.deletingMetrics.update((v) =>
        v.filter((m) => !this.demoMetrics.includes(m)),
      );
    this.spaceService.deleteMetrics(space.id, this.demoMetrics).subscribe({
      complete,
      error: (err) => {
        complete();
        this.errorLogger.logError(err, 'Failed to delete demo metrics');
      },
    });
  }

  public isDeletingMetric(metric: ISpaceMetric): boolean {
    return !!metric.id && this.deletingMetrics().includes(metric.id);
  }

  public deleteMetric(metric: ISpaceMetric): void {
    if (!metric.id) {
      throw 'metric has no id';
    }
    const space = this.space();
    if (!space) {
      throw 'no team';
    }
    const metricId = metric.id;
    this.deletingMetrics.update((v) => [...v, metricId]);
    const complete = () =>
      this.deletingMetrics.update((v) => v.filter((m) => m !== metricId));
    this.spaceService.deleteMetrics(space.id, [metricId]).subscribe({
      error: (err) => {
        complete();
        this.errorLogger.logError(err, 'Failed to delete metric');
      },
      complete,
    });
  }

  goAddMetric(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const space = this.space();
    if (!space) {
      throw 'no team';
    }
    this.navService.navigateToAddMetric(this.navController, space);
  }

  metricColor(v?: IBoolMetricVal): string {
    // Stupid workaround
    return v?.color || '';
  }

  metricLabel(v?: IBoolMetricVal): string {
    // Stupid workaround
    return v?.label || '';
  }
}
