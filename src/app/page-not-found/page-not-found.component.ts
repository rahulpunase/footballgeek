import { WindowResizeService } from './../services/window.resize.service';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CompileTemplateMetadata } from '@angular/compiler';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  @ViewChild('complete') complete;
  constructor(
    private windowResizeServices: WindowResizeService,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    // there it is there
    // this.complete.nativeElement.height = this.windowResizeServices.data.HEIGHT;
    this.renderer.setStyle(this.complete.nativeElement, 'height', this.windowResizeServices.data.HEIGHT + 'px');
  }

}
