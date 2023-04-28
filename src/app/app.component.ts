import { Component, ViewEncapsulation } from '@angular/core';
import { PageInfo } from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  pages: PageInfo[] = [
    {
      code: 'l4d',
      description: 'Link 4 Devs',
      categories: ['topic', 'resource type']
    },
    {
      code: 'web',
      description: 'Websites'
    },
    {
      code: 'sw',
      description: 'Software',
      categories: ['main category', 'subcategory', 'ext/plugin', 'license']
    },
  ]
}
