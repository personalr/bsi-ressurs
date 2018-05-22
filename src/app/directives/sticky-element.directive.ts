import {

  Directive,
  Renderer2,
  OnInit,
  ElementRef,
  HostListener,

} from '@angular/core';

@Directive({
  selector: '[appStickyElement]'
})
export class StickyElementDirective implements OnInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {  }


}

