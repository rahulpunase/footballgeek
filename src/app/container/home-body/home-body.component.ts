import { WindowScrollService } from './../../services/window.scroll.service';
import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { WindowResizeService } from '../../services/window.resize.service';
@Component({
  selector: 'app-home-body',
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.css']
})
export class HomeBodyComponent implements OnInit {
  resizeData;
  @ViewChild('scFix1') scFix1: ElementRef;
  @ViewChild('scFix2') scFix2: ElementRef;
  constructor(
    private windowResizeServices: WindowResizeService,
    private windowScrollService: WindowScrollService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.windowResizeServices.resizeSource.subscribe(
      data => {
        this.resizeData = data;
      }
    );
    this.windowScrollService.scrollSource.subscribe(data => {
      const pageYOffset = data.pageYOffset;
      this.figureOutMaths(this.scFix1, pageYOffset);
      this.figureOutMaths(this.scFix2, pageYOffset);
    });
  }

  figureOutMaths(box, pageYOffset) {
    const elemHeight = box.nativeElement.offsetHeight;
    const scAv = window.innerHeight;
    if (elemHeight > 300) {
      if (pageYOffset > elemHeight - scAv) {
        this.renderer.addClass(box.nativeElement, 'fixOnSc');
        this.renderer.setStyle(box.nativeElement, 'top', -(elemHeight - scAv) + 'px');
      } else {
        this.renderer.removeClass(box.nativeElement, 'fixOnSc');
      }
    }
  }

  getDepth(outlet) {
    return outlet.activatedRouteData['depth'];
  }
}
