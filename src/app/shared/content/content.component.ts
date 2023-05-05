import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { l4dTags, softwareTags, websitesTags } from 'src/app/data/tags.data.';
import { TagInfo, PageInfo, WebsiteInfo, operation } from 'src/app/interfaces/interfaces';
import l4d from 'src/app/data/link4devs.json';
import software from 'src/app/data/software.json';
import websites from 'src/app/data/websites.json';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {
  @Input() pageInfo!: PageInfo; 
  @ViewChild(MatSort, {static:true}) sort!: MatSort;

  // arrays
  tableData: WebsiteInfo[] = []; // contains every possible entry for the table
  categories: string[] = [];
  tags: TagInfo[] = [];
  selectedTags: string[] = [];
  selectableTags!: Set<string>;
  
  // mat-table
  columns: string[] = ['name', 'description', 'tags'];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<WebsiteInfo> = new MatTableDataSource();

  // flags
  devMode: boolean = true;

  // export
  filename: string = ''; 

  constructor(public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('Elements at start: ', this.tableData.length);

    this.displayedColumns = [... this.columns];

    // Show buttons when in dev mode
    if (this.devMode) {
      this.displayedColumns.push('actions');
    }


    // console.log('this.pageInfo', this.pageInfo)
    this.categories = this.pageInfo.categories || [];

    if (this.pageInfo.code === 'l4d') {
      this.tags = l4dTags;
      this.tableData = l4d;
      this.filename = 'link4devs';
    } else if (this.pageInfo.code === 'sw') {
      this.tags = softwareTags;
      this.tableData = software;
      this.filename = 'software';
    } else {
      this.tags = websitesTags;
      this.tableData = websites;
      this.filename = 'websites';
    }

    // Deep copy
    this.dataSource.data = JSON.parse(JSON.stringify(this.tableData));

    // Select every tag at first
    this.setSelectableTags();
  }

  /**
   * Initialise sort
   * @returns void
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Filter data and tags based on search input
   * @param  {Event} event
   * @returns void
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.setSelectableTags();
  }

  /**
   * Remove element from the array
   * @param  {WebsiteInfo} website
   * @returns void
   */
  deleteElem(website: WebsiteInfo): void {
    console.log(website.name)
    const idx: number = this.tableData.findIndex(site => site.id === website.id);
    console.log('0', this.tableData[0].name)
    this.tableData.splice(idx, 1);
    console.log('0 after', this.tableData[0].name)
    this.filterDataByTags();
  }

  /**
   * Sort array and download it as JSON
   * @returns void
   */
  downloadJSON(): void {
    this.sortByKey(this.tableData, 'name');


    console.log('Elements to download: ', this.tableData.length);
    
    return saveAs(
      new Blob([JSON.stringify(this.tableData, null, 2)], { type: 'JSON' }), `${this.filename}.json`
    );
  }

  /**
   * Only select elements that have all the currently chosen tags
   * @returns void
   */
  filterDataByTags(): void {
    if (this.selectedTags.length > 0) {
      this.dataSource.data = this.tableData.filter(item => this.selectedTags.every(tag => item.tags.includes(tag)));
    } else {
      this.dataSource.data = this.tableData;
    }
  }

  /**
   * Get color class based on name
   * @param  {string} categoryName
   * @returns string
   */
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

  /**
   * Update class for buttons' CSS
   * @param  {string} tag
   * @returns string
   */
  getSelectedClass(tag: string): string {
    return this.selectedTags.includes(tag) ? 'selected' : '';
  }  

  /**
   * Update selected and selectable tags, filter data
   * @param  {string} tag
   * @returns void
   */
  handleButtonClick(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else {
      const idx = this.selectedTags.findIndex(t => t === tag);
      this.selectedTags.splice(idx,1);
    }

    this.filterDataByTags();
    this.setSelectableTags();
  }

  /**
   * Determine if the button must be disabled
   * @param  {string} tag
   * @returns boolean
   */
  isButtonDisabled(tag: string): boolean {
    return !this.selectableTags.has(tag);
  }

  /**
   * Open dialog to add or edit element
   * @param  {operation='new'} operation
   * @param  {WebsiteInfo} data?
   * @param  {number} idx?
   * @returns void
   */
  openDialog(operation: operation = 'new', data?: WebsiteInfo, idx?: number): void {
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

    dialogRef.afterClosed().subscribe((res: WebsiteInfo | undefined) => {
      if (res !== undefined) {
        // Replace existing element
        if (operation === 'edit') {
          // console.log('Edited element:', res)

          // Update main array (for export and filter operations)
          const mainIdx = this.tableData.find(site => site.id === res.id)!.id;
          this.tableData[mainIdx] = res;


        } else { // Operation can only be new: determine id and 
          const newId = ++this.tableData.slice(-1)[0].id;
          res.id = newId;
          this.tableData.unshift(res);
          this.dataSource.data.unshift(res);
        }

        this.dataSource.data = this.dataSource.data.slice(); //needed for the detectChanges to work
        this.changeDetectorRefs.detectChanges();
      }
    })

  }

  /**
   * Set the tags that can be selected based on current selection
   * @returns void
   */
  setSelectableTags(): void {
    console.log(this.selectedTags.length)
    if (this.selectedTags.length > 0) {
      this.selectableTags = new Set<string>(this.dataSource.filteredData.flatMap(el => el.tags));
    } else {
      this.selectableTags = new Set<string>(this.tags.flatMap(t => t.value));
    }
  }

  /**
   * Sort the array by the provived key
   * @param  {WebsiteInfo[]} arr
   * @param  {keyofWebsiteInfo} key
   * @returns WebsiteInfo
   */
  sortByKey(arr: WebsiteInfo[], key: keyof WebsiteInfo): WebsiteInfo[] {
    return arr.sort((a, b) => ((a[key] as string).toLowerCase() > (b[key] as string).toLowerCase()) ? 1 : ((b[key] as string).toLowerCase() > (a[key] as string).toLowerCase()) ? -1 : 0)
  }
}
