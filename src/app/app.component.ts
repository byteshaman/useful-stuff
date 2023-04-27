import { Component } from '@angular/core';
import { PageInfo } from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pages: PageInfo[] = [
    {
      code: 'l4d',
      description: 'Link 4 Devs'
    },
    {
      code: 'web',
      description: 'Websites'
    },
    {
      code: 'sw',
      description: 'Software'
    },
  ]
}
