import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pictureOrPlaceholder'
})
export class PictureOrPlaceholderPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value && value !== '') {
      return value;
    } else {
      return location.protocol + '//placehold.it/150x200?text=No+Picture';
    }
  }

}
