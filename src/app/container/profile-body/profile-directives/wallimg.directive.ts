import { Directive, ElementRef, OnInit, Renderer2, HostListener, ViewChild } from '@angular/core';

@Directive({
  selector: '[appWallImageMover]'
})
export class WallImageMoverDirective implements OnInit {
  // whenever the instance of this class is created.
  mousedownOnWall = false;
  prevX;
  prevY;
  posX;
  posY;
  delX;
  delY;
  currentX = Number(
    this.elementRef.nativeElement.style.backgroundPositionX.substring(0, this.elementRef.nativeElement.style.backgroundPositionX.length - 2)
  );
  currentY = Number(
    this.elementRef.nativeElement.style.backgroundPositionY.substring(0, this.elementRef.nativeElement.style.backgroundPositionY.length - 2)
  );
  @HostListener('mousedown', ['$event']) mousedown ($event) {
    this.mousedownOnWall = true;
    this.prevX = this.currentX;
    this.prevY = this.currentY;
    this.posX = $event.screenX;
    this.posY = $event.screenY;
  }
  @HostListener('mousemove', ['$event']) mousemove ($event) {
    if (this.mousedownOnWall) {
      // things to do here...
      this.delX = $event.screenX;
      this.delY = $event.screenY;
      const ten = this.elementRef.nativeElement;
      const moveX = this.prevX + this.delX - this.posX;
      const moveY = this.prevY + this.delY - this.posY;
      this.renderer.setStyle(ten, 'background-position-x', moveX + 'px');
      this.renderer.setStyle(ten, 'background-position-y', moveY + 'px');
      this.currentX = moveX;
      this.currentY = moveY;
      this.elementRef.nativeElement.children[0].style.display = 'none';
    }
  }
  @HostListener('mouseup', ['$event']) mouseout ($event) {
    this.mousedownOnWall = false;
    this.elementRef.nativeElement.children[0].style.display = 'flex';
  }
  constructor (
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit () {
    const ten = this.elementRef.nativeElement;
    this.renderer.addClass(ten, 'ng-move-directive');
    // this.renderer.setStyle(ten, 'cursor', 'pointer');
  }

}
