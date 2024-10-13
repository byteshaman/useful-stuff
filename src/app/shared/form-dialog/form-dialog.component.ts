import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TagInfo, WebsiteInfo } from 'src/app/interfaces/interfaces';



@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  mandatoryFieldError: string = 'This field is mandatory';

  // Mutli select
  protected onDestroy = new Subject<void>();
  tagList: TagInfo[] = this.data.tags;
  form!: FormGroup;
  selectedTags: string[] = [];

  constructor(private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: {websiteInfo: WebsiteInfo | null, tags: TagInfo[]} ) {

      this.form = this.fb.group({
        id: [this.data.websiteInfo ? this.data.websiteInfo['id'] : -1, Validators.required],
        name: [this.data.websiteInfo ? this.data.websiteInfo['name'] : '', Validators.required],
        url: [this.data.websiteInfo ? this.data.websiteInfo.url : '', Validators.required],
        description: [this.data.websiteInfo ? this.data.websiteInfo.description : '', Validators.required]
      });
    }

  ngOnInit(): void {
    // Restore existing tags
    if (this.data.websiteInfo?.tags) {
      this.selectedTags = this.data.websiteInfo.tags;
    }
  }

  getFCValue(key: string): any { 
    return this.form.get(key)?.value;
  }

  onTagChange(tag: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedTags.push(tag);
    } else {
      const index = this.selectedTags.indexOf(tag);
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      }
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }
  
  handleConfirmClick() {

    let a = this.selectedTags.sort();
    debugger
    this.dialogRef.close({
      id: this.getFCValue('id') as number,
      name: this.getFCValue('name') as string,
      url: this.getFCValue('url') as string,
      description: this.getFCValue('description') as string,
      tags: this.selectedTags.sort() //sort tags alphabetically (value)
    });
  }
}
