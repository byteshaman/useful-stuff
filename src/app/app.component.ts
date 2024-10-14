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
  selectedTabIndex: number = 0;

  ngOnInit() {
    const savedTabIndex = localStorage.getItem('selectedTabIndex'); // Retrieve the index of the last visited tab 
    if (savedTabIndex !== null) {
      this.selectedTabIndex = parseInt(savedTabIndex, 10);
    }
  }

  /**
   * Save the index of the selected tab in local storage
   * @param  {number} index
   */
  onTabChange(index: number) {
    localStorage.setItem('selectedTabIndex', index.toString());
  }
}
