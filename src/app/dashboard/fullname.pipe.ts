import { Pipe, PipeTransform } from '@angular/core';
import { People } from 'app/dashboard/people';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(value: People, args?: any): string {
    if (value) {
      return `${value.title}${value.fname} ${value.lname}`;
    } else {
      return '';
    }
  }

}
