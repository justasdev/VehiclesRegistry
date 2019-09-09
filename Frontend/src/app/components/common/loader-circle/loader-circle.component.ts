import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loader-circle',
  templateUrl: './loader-circle.component.html',
  styleUrls: ['./loader-circle.component.scss']
})
export class LoaderCircleComponent implements OnInit {

  @Input() @HostBinding('style.font-size.px') size = 5;

  constructor() { }

  ngOnInit() {
  }

}
