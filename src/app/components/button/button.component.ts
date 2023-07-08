import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';
import { ArrowButton, ArrowButtonTransform } from '@angular-tetris/interface/ui-model/arrow-button';
import { Observable } from 'rxjs';
@Component({
  selector: 't-button',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, AsyncPipe],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() className = '';
  @Input() isAbsolute = false;
  @Input() top: number;
  @Input() left: number;

  @Input() active$: Signal<boolean>;
  @Input() arrowButton: ArrowButton;

  get arrowTransforms() {
    return ArrowButtonTransform[this.arrowButton];
  }
}
