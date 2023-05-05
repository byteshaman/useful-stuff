import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TagInfo, WebsiteInfo } from 'src/app/interfaces/interfaces';


@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit, OnDestroy {

  mandatoryFieldError: string = 'This field is mandatory';

  // Mutli select
  protected onDestroy = new Subject<void>();
  tagList: TagInfo[] = this.data.tags;
  tagSearch: FormControl = new FormControl('');
  filteredTags: ReplaySubject<TagInfo[]> = new ReplaySubject<
    TagInfo[]
  >(1);


  form = this.fb.group({
    id: [this.data.websiteInfo ? this.data.websiteInfo['id'] : -1, Validators.required],
    name: [this.data.websiteInfo ? this.data.websiteInfo['name'] : '', Validators.required],
    url: [this.data.websiteInfo ? this.data.websiteInfo.url : '', Validators.required],
    description: [this.data.websiteInfo ? this.data.websiteInfo.description : '', Validators.required],
    tags: [this.data.websiteInfo ? this.data.websiteInfo.tags : [], Validators.required],
  });


  constructor(private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: {websiteInfo: WebsiteInfo | null, tags: TagInfo[]} ) {}

  ngOnInit(): void {
    this.filteredTags.next(this.tagList.slice());

    this.tagSearch.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterTags();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getFCValue(key: string): any { 
    return this.form.get(key)?.value;
  }

  filterTags() {
    if (!this.tagList) {
      return;
    }
    // get the search keyword
    let search = this.tagSearch.value;
    if (!search) {
      this.filteredTags.next(this.tagList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the genres
    this.filteredTags.next(
      this.tagList.filter(
        (tag: TagInfo) => tag.description.toLowerCase().indexOf(search) > -1
      )
    );
  }
  
  handleConfirmClick() {
    this.dialogRef.close({
      id: this.getFCValue('id') as number,
      name: this.getFCValue('name') as string,
      url: this.getFCValue('url') as string,
      description: this.getFCValue('description') as string,
      tags: this.getFCValue('tags').sort() as string[] //sort tags alphabetically (value)
    });
  }
}
