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

  // flags
  devMode: boolean = false;

  // mat-table
  columns: string[] = this.devMode ? ['name', 'description', 'tags'] : ['name', 'description'];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<WebsiteInfo> = new MatTableDataSource();


  tagOccurrences: { [key: string]: number } = {};

  // export
  filename: string = ''; 

  constructor(public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.displayedColumns = [... this.columns];


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


    // Show buttons when in dev mode
    if (this.devMode) {
      this.displayedColumns.push('actions');
      console.log('Elements at start: ', this.tableData.length);
    }


    // Select every tag at first
    this.setSelectableTags();
    this.updateTagOccurrences();
  }

  /**
   * Initialise sort
   * @returns void
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  updateTagOccurrences(): void {
    this.tagOccurrences = {};
    this.dataSource.filteredData.forEach(item => {
      item.tags.forEach(tag => {
        if (this.selectableTags.has(tag)) {
          this.tagOccurrences[tag] = (this.tagOccurrences[tag] || 0) + 1;
        }
      });
    });
  }

  /**
   * @param  {string} tag
   * @returns number
   */
  getTagOccurrences(tag: string): number {
    return this.tagOccurrences[tag] || 0;
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
    this.updateTagOccurrences();
  }

  /**
   * Remove element and update the data
   * @param  {WebsiteInfo} website
   * @returns void
   */
  deleteElem(website: WebsiteInfo): void {
    const idx: number = this.tableData.findIndex(site => site.id === website.id); //it'll always find stuff
    this.tableData.splice(idx, 1);
    this.filterDataByTags(); //update data
  }

  /**
   * Sort the array and download it as JSON
   * @returns void
   */
  downloadJSON(): void {
    this.sortByKey(this.tableData, 'name');

    if (this.devMode) {
      console.log('Elements to download: ', this.tableData.length);
    }

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


    this.updateTagOccurrences();
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
      height: '90vh',
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
          const mainIdx = this.tableData.findIndex(site => site.id === res.id);
          this.tableData[mainIdx] = res;


        } else { // Operation can only be new
          res.id = (Math.max(... this.tableData.map(el => el.id)))+1; //find max id and increase it
          this.tableData.unshift(res);
        }

        this.filterDataByTags(); //needed for the detectChanges to work
        this.changeDetectorRefs.detectChanges();
      }
    })

  }

  /**
   * Set the tags that can be selected based on current selection
   * @returns void
   */
  setSelectableTags(): void {
    // console.log(this.selectedTags.length)

    if (this.selectedTags.length > 0) {
      this.selectableTags = new Set<string>(this.dataSource.filteredData.flatMap(el => el.tags));
    } else {
      this.selectableTags = new Set<string>(this.tags.flatMap(t => t.value));
    }

    this.updateTagOccurrences();
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
