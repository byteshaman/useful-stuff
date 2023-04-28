import { Component, Input } from '@angular/core';
import { l4d, software, websites } from 'src/app/data/buttons';
import { ButtonInfo, PageInfo } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  @Input() pageInfo!: PageInfo; 
  buttons: ButtonInfo[] = [];
  categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('this.pageInfo', this.pageInfo)
    this.categories = this.pageInfo.categories || [];


    if (this.pageInfo.code === 'l4d') {
      this.buttons = l4d;
    } else if (this.pageInfo.code === 'sw') {
      this.buttons = software;
    } else {
      this.buttons = websites;
    }
  }

  getColorClass(categoryName: string): string {
    switch (categoryName) {
      case 'main category':
      case 'topic':
        return 'yellowgreen';
      case 'subcategory':
      case 'resource type':
        return 'orange';
      case 'license':
        return 'yellow';
      case 'ext/plugin':
        return 'brown';
      default:
        return '';
    }
  }

}
