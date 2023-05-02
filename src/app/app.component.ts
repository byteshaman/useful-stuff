import { Component, ViewEncapsulation } from '@angular/core';
import { PageInfo } from './interfaces/interfaces';
import { pages } from './data/pages.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  pages: PageInfo[] = pages;
}
