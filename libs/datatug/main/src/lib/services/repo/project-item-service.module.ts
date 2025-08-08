import { NgModule } from '@angular/core';
import { ProjectItemServiceFactory } from './project-item-service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [HttpClientModule],
	providers: [ProjectItemServiceFactory],
})
export class ProjItemServiceModule {}
