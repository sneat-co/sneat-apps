import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IRetroItem} from '../../../models/interfaces';
import {ITreeNode} from '@angular-dnd/tree';

@Component({
	selector: 'app-retro-item-card',
	templateUrl: './retro-item-card.component.html',
	styleUrls: ['./retro-item-card.component.scss'],
})
export class RetroItemCardComponent implements OnChanges {

	@Input() treeNode: ITreeNode<IRetroItem>;
	@Input() isPreview: boolean;

	public item: IRetroItem;
	public isHovered: boolean;
	public num: string;
	public isLiked: boolean;

	public get isExpandable(): boolean {
		return this.treeNode.hasChildren
			|| !!this.treeNode.childrenCount
			|| (!!this.treeNode.children && this.treeNode.isExpanded === undefined);
	}

	ngOnChanges({treeNode}: SimpleChanges): void {
		if (treeNode) {
			this.item = this.treeNode?.data;
			this.num = this.getItemNumber();
			// this.treeNode.dropTarget?.listen(m => {
			// 	console.log('dropTarget', m);
			// 	this.isHovered = m.isOver();
			// });
		}
	}

	public like(event: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		console.log(`like(${this.item.ID})`);
		this.isLiked = !this.isLiked;
	}

	public toggle(event?: Event): void {
		console.log('toggle', this.treeNode);
		// if (this.treeNode.level !== 1) {
		// 	return;
		// }
		try {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			const n = this.treeNode;
			this.treeNode = n.isExpanded
				? n.tree.state.collapse(n.id)
				: n.tree.state.expand(n.id);
		} catch (e) {
			console.error('Failed to toggle tree node:', e);
		}
	}

	private getItemNumber(): string {
		const s = [`${this.treeNode.index + 1}`];
		let {parent} = this.treeNode;
		while (parent) {
			const n = this.treeNode.tree.state.node(parent)
			s.unshift(`${n.index + 1}`);
			parent = n.parent;
		}
		return s.join('.')
	}
}
