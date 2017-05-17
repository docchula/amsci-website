import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkedPipe } from './marked.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MarkedPipe
  ],
  declarations: [MarkedPipe]
})
export class SharedModule { }
