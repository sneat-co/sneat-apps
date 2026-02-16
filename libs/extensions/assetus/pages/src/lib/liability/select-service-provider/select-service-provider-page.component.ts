import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LiabilityServiceType } from '@sneat/mod-assetus-core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { AssetBasePage } from '../../asset-base.page';

@Component({
  selector: 'sneat-select-service-provider',
  templateUrl: './select-service-provider-page.component.html',
  providers: [SpaceComponentBaseParams],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonItemGroup,
    IonLabel,
    IonItem,
    IonIcon,
    IonItemDivider,
    IonInput,
    IonBackButton,
  ],
})
export class SelectServiceProviderPageComponent extends AssetBasePage {
  serviceProviders?: DtoServiceProvider[];
  isOtherSelected = false;
  serviceType?: LiabilityServiceType;
  serviceTypeTitle?: string;

  constructor() {
    const params = inject(SpaceComponentBaseParams);

    super(CommuneTopPage.asset, params, assetService);
  }

  protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
    super.onCommuneIdsChanged(communeIds);
    this.route.queryParamMap.subscribe((params) => {
      this.serviceType = params.get('type') as LiabilityServiceType;
      this.serviceTypeTitle = this.serviceType;
    });
  }

  protected defaultBackParams(url: string): string {
    if (this.asset) {
      return `${url}?asset=${this.asset.dto.id}`;
    }
    return super.defaultBackParams(url);
  }

  protected setAssetDto(assetDto: IAssetDto): void {
    super.setAssetDto(assetDto);
    if (this.asset) {
      this.setDefaultBackUrl();
      if (!this.asset.dto.categoryId) {
        throw new Error('!this.asset.dto.categoryId');
      }
      this.serviceProviderService
        .getServiceProvidersByAssetCategoryId(
          undefined,
          'ie',
          this.asset.dto.categoryId,
        )
        .subscribe((result) => {
          const serviceType = this.serviceType;
          this.serviceProviders = this.serviceType
            ? result.values.filter(
                (v) => v.serviceTypes && v.serviceTypes.includes(serviceType),
              )
            : result.values;
        }, this.errorLogger.logError);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectProvider(_serviceProvider: DtoServiceProvider): void {
    // TODO: Implement service provider selection
  }

  other(): void {
    this.isOtherSelected = true;
  }
}
