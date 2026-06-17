import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  input,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { IRetroItem } from '../../../models/interfaces';
import { ITreeNode } from '@angular-dnd/tree';

@Component({
  selector: 'sneat-retro-item-card',
  templateUrl: './retro-item-card.component.html',
  styleUrls: ['./retro-item-card.component.scss'],
  imports: [
    IonCard,
    IonItem,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonText,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroItemCardComponent implements OnChanges {
  @Input() treeNode: ITreeNode<IRetroItem>;
  readonly isPreview = input<boolean>();

  public readonly item = signal<IRetroItem | undefined>(undefined);
  public readonly isHovered = signal<boolean | undefined>(undefined);
  public readonly num = signal<string | undefined>(undefined);
  public readonly isLiked = signal<boolean | undefined>(undefined);

  public get isExpandable(): boolean {
    return (
      this.treeNode.hasChildren ||
      !!this.treeNode.childrenCount ||
      (!!this.treeNode.children && this.treeNode.isExpanded === undefined)
    );
  }

  ngOnChanges({ treeNode }: SimpleChanges): void {
    if (treeNode) {
      this.item.set(this.treeNode?.data);
      this.num.set(this.getItemNumber());
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
    this.isLiked.set(!this.isLiked());
  }

  public toggle(event?: Event): void {
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
    let { parent } = this.treeNode;
    while (parent) {
      const n = this.treeNode.tree.state.node(parent);
      s.unshift(`${n.index + 1}`);
      parent = n.parent;
    }
    return s.join('.');
  }
}
