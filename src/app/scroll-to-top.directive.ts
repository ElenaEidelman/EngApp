import { Directive, EventEmitter, Output, HostListener, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Directive({
  selector: '[scroll]'
})
export class ScrollToTopDirective {
  @Output() scrollPosition: EventEmitter<number> = new EventEmitter<number>
  ();


  private scrollEvent$;
  
  constructor(private el: ElementRef) {
  }

  @HostListener('scroll', ['$event']) 
  scrollHandler(event) {
    console.debug("Scroll Event");
  }

}
