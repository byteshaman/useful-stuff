import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef, ViewChild, Inject, inject, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatNoDataRow, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { l4dTags, softwareTags, websitesTags } from 'src/app/data/tags.data.';
import { TagInfo, PageInfo, WebsiteInfo, operation } from 'src/app/interfaces/interfaces';
import l4d from 'src/app/data/link4devs.json';
import software from 'src/app/data/software.json';
import websites from 'src/app/data/websites.json';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { saveAs } from "file-saver";
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CommonModule, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { MobileClassDirective } from 'src/app/directives/responsive.directive';

import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [CommonModule, MatButton, MatIcon, MatFormField, MatInput, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIconButton, MatNoDataRow, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, UpperCasePipe, NgTemplateOutlet, MobileClassDirective],
  host: {
    '(window:keydown)': 'onKeyDown($event)'
  }
})
export class ContentComponent implements OnInit, AfterViewInit {
  @Input() pageInfo!: PageInfo; 
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild("mobileDialog") mobileDialog!: TemplateRef<MatBottomSheetRef>;
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  // data structures
  tableData: WebsiteInfo[] = []; // contains every possible entry for the table
  categories: string[] = [];
  tags: TagInfo[] = [];
  selectedTags: string[] = [];
  selectableTags!: Set<string>;

  // devmode
  devMode = false;
  sequence = '';
  devModeKeyword = 'devmode';

  // mat-table
  columns: string[] = this.devMode ? ['name', 'description', 'tags'] : ['name', 'description'];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<WebsiteInfo> = new MatTableDataSource();
  
  // export
  filename: string = ''; 

  // Services
  private readonly dialog = inject(MatDialog);
  private readonly bottomDialog = inject(MatBottomSheet); // needed to open the mobile dialog

  openMobileDialog(): void {
    const mobileDialogRef = this.bottomDialog.open(this.mobileDialog, {
      panelClass: 'mobile', // Add a class to the bottom sheet wrapper element
      restoreFocus: false, // Disable restoring focus to the previously focused element
    });

    mobileDialogRef.afterDismissed().subscribe(() => {
      this.focusSearch()
    });
  }

  focusSearch(): void {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 50);
  }

  constructor(private changeDetectorRefs: ChangeDetectorRef) { }

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

    // let urls = [websites, software, l4d].flatMap(array => array.map(item => item.url));
    // console.log(urls)

    // Select every tag at first
    this.setSelectableTags();
  }
  
  /**
   * Initialise sort
   * @returns void
  */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.focusSearch();
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
  }
  
  /**
   * Get color class based on name
   * @param  {string} categoryName
   * @returns string
   */
  getColorClass(categoryName: string): string {
    switch (categoryName) {
      case 'category':
      case 'topic':
        return 'yellowgreen';
      case 'extra':
      case 'resource type':
        return 'orange';
      case 'ext/plugin':
        return 'yellow';
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

  onKeyDown(event: KeyboardEvent) {
    debugger;
    if (!this.devMode) {
      // If s button is pressed, focus on search bar
      if (event.key === 's') {
        this.focusSearch();
      }

      this.sequence += event.key.toLowerCase();

      // Keep only last n characters
      if (this.sequence.length > this.devModeKeyword.length) {
        this.sequence = this.sequence.slice(-this.devModeKeyword.length);
      }

      // Toggle devmode
      if (this.sequence === this.devModeKeyword) {
        this.devMode = !this.devMode;
        this.sequence = '';

        // Show buttons when in dev mode
        if (this.devMode) {
          this.displayedColumns.push('tags');
          this.displayedColumns.push('actions');
        } else {
          this.displayedColumns.pop();
          this.displayedColumns.pop();  
        }
      }
    }
  }

  /**
   * Determine if the button must be disabled
   * @param  {string} tag
   * @returns boolean
   */
  isBtnDisabled(tag: string): boolean {
    return !this.selectableTags.has(tag);
  }

  /**
   * Update selected and selectable tags, filter data
   * @param  {string} tag
   * @returns void
   */
  onTagBtnClick(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else {
      const idx = this.selectedTags.findIndex(t => t === tag);
      this.selectedTags.splice(idx, 1);
    }

    this.filterDataByTags();
    this.setSelectableTags();
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
      maxHeight: '550px',
      width: '600px',
      disableClose: true,
      data: {websiteInfo: dialogData, tags: this.tags}
    }

    let formDialogRef = this.dialog.open(FormDialogComponent, dialogConfig);

    formDialogRef.afterClosed().subscribe((res: WebsiteInfo | undefined) => {
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
