import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureOrPlaceholderPipe } from 'app/shared/picture-or-placeholder.pipe';
import { FullnamePipe } from 'app/shared/fullname.pipe';
import { KeysPipe } from './keys.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PictureOrPlaceholderPipe,
    FullnamePipe,
    KeysPipe
  ],
  exports: [
    PictureOrPlaceholderPipe,
    FullnamePipe,
    KeysPipe
  ]
})
export class SharedModule { }
