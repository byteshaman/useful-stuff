import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { l4dTags, softwareTags, websitesTags } from 'src/app/data/tags.data.';
import { TagInfo, PageInfo, WebsiteInfo, operation } from 'src/app/interfaces/interfaces';
import l4d from 'src/app/data/link4devs.json';
import software from 'src/app/data/software.json';
import websites from 'src/app/data/websites.json';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {
  @Input() pageInfo!: PageInfo; 
  @ViewChild(MatSort, {static:true}) sort!: MatSort;
  
  tags: TagInfo[] = [];
  categories: string[] = [];

  columns: string[] = ['name', 'description', 'tags'];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<WebsiteInfo> = new MatTableDataSource();

  // this will always contain every possible entry for the table
  tableData: WebsiteInfo[] = [];

  currentTags: string[] = [];
  selectableTags: Set<string> = new Set<string>();

  devMode: boolean = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayedColumns = [... this.columns];
    if (this.devMode) {
      this.displayedColumns.push('actions');
    }


    // console.log('this.pageInfo', this.pageInfo)
    this.categories = this.pageInfo.categories || [];

    if (this.pageInfo.code === 'l4d') {
      this.tags = l4dTags;
      this.tableData = l4d;
    } else if (this.pageInfo.code === 'sw') {
      this.tags = softwareTags;
      this.tableData = software;
    } else {
      this.tags = websitesTags;
      this.tableData = websites;
    }

    // deep copy array
    this.dataSource.data = JSON.parse(JSON.stringify(this.tableData));

    // this will select every tag at first
    this.getSelectableTags();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(this.sort)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    console.log(this.dataSource.filteredData)

    this.getSelectableTags();
  }

  
  /**
   * Determine if the button must be disabled (when it's not in the list of selectable tags)
   * @param  {string} tag
   * @returns boolean
   */
  buttonDisabled(tag: string): boolean {
    return !this.selectableTags.has(tag);
  }

  deleteElem(website: WebsiteInfo) {
    console.log(website)
  }

  downloadJSON(): void {
    
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
    this.selectableTags = new Set<string>(); 
    this.dataSource.filteredData.filter(el => el.tags.forEach(tag => this.selectableTags.add(tag)));
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
      const itemTags = item.tags;
      return this.currentTags.every(tag => itemTags.includes(tag));
    })  


    this.getSelectableTags();
  }

  getSelectedClass (tag: string): string {
    return this.currentTags.includes(tag) ? 'selected' : '';
  }  

  openDialog(operation: operation = 'new', data?: WebsiteInfo): void {
  
    let dialogData: WebsiteInfo | null = null;

    if (operation === 'edit' && data) {
      dialogData = data;
    }

    const dialogConfig: MatDialogConfig = {
      height: '400px',
      width: '600px',
      disableClose: true,
      data: {websiteInfo: dialogData, tags: this.tags}
    }

    let dialogRef = this.dialog.open(FormDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        
      }
    })

  }

  sortByKey(arr: WebsiteInfo[], key: keyof WebsiteInfo): WebsiteInfo[] {
    return arr.sort((a, b) => ((a[key] as string).toLowerCase() > (b[key] as string).toLowerCase()) ? 1 : ((b[key] as string).toLowerCase() > (a[key] as string).toLowerCase()) ? -1 : 0)
  }

}
