import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { l4d, software, websites } from 'src/app/data/buttons';
import { ButtonInfo, PageInfo, WebsiteInfo } from 'src/app/interfaces/interfaces';
import l4dJSON from 'src/app/data/link4devs.json';
import softwareJSON from 'src/app/data/software.json';
import websitesJSON from 'src/app/data/websites.json';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  @Input() pageInfo!: PageInfo; 
  buttons: ButtonInfo[] = [];
  categories: string[] = [];

  displayedColumns: string[] = ['name', 'description', 'tags'];
  dataSource: MatTableDataSource<WebsiteInfo> = new MatTableDataSource();

  // this will always contain every possible entry for the table
  tableData: WebsiteInfo[] = [];

  currentTags: string[] = [];
  selectableTags: Set<string> = new Set<string>();

  constructor() { }

  ngOnInit(): void {
    // console.log('this.pageInfo', this.pageInfo)
    this.categories = this.pageInfo.categories || [];

    if (this.pageInfo.code === 'l4d') {
      this.buttons = l4d;
      this.tableData = l4dJSON;
    } else if (this.pageInfo.code === 'sw') {
      this.buttons = software;
      this.tableData = softwareJSON;
    } else {
      this.buttons = websites;
      this.tableData = websitesJSON;
    }

    // this.dataSource.data will be used for filtering
    this.dataSource.data = JSON.parse(JSON.stringify(this.tableData));

    // this will select every tag at first
    this.getSelectableTags();
  }

  buttonDisabled(tag: string): boolean {
    return !this.selectableTags.has(tag);
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

  getSelectableTags(): void {
    this.dataSource.data.filter(el => this.getTagsAsArray(el.tags).forEach(tag => this.selectableTags.add(tag)));
  }

  getTagsAsArray(tags: string): string[] {
    return tags.split(',').map(tag => tag.trim());
  }

  handleButtonClick(tag: string): void {
    // Add or remove tag from array based on user pressure
    if (!this.currentTags.includes(tag)) {
      this.currentTags.push(tag);
    } else {
      const idx = this.currentTags.findIndex(t => t === tag);
      this.currentTags.splice(idx,1);
    }

    // Filter out elements that don't contain every tag in currentTags
    this.dataSource.data = this.tableData.filter(item => {
      const itemTags = item.tags.split(',').map(tag => tag.trim());
      return this.currentTags.every(tag => itemTags.includes(tag));
    })  


    this.selectableTags = new Set<string>(); 
    this.getSelectableTags();
  }

  getSelectedClass (tag: string): string {
    return this.currentTags.includes(tag) ? 'selected' : '';
  }  

}
