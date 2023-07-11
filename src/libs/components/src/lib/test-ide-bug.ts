import { Component, Input } from '@angular/core';

interface IItem {
	id: string;
}

@Component({
	selector: 'sneat-test',
	standalone: true,
	template: `Today's item: {{item}}`,
})
export class TestComponent {
	@Input() item?: IItem | null;
}

@Component({
	standalone: true,
	selector: 'sneat-consumer',
	imports: [TestComponent],
	template: `
		<sneat-test [item]="myItem('test')"></sneat-test>`,
})
export class ConsumerComponent {
	protected myItem(id: string): IItem | undefined {
		return id ? {id} : undefined;
	}
}

