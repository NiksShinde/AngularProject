import {Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {NgForm, Validators} from '@angular/forms';
import {ValidationManager} from './validation-manager';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = [];
  public userValidation: any;
  public cityList: any = [];
  public showTable: boolean;
  public userList: any = [];
  public obj: any = {};

 constructor() {
        
    this.dtOptions = {
      paginationType: 'full_numbers',
      pageLength: 10,
      responsive: true
    };
    this.loadObj();
    this.cityList = ['Pune', 'Hyderabad', 'Mumbai', 'Chennai', 'Kolkata', 'Banglore'];
  }

  loadObj() {
    this.obj = {
      'fname': '',
      'lname': '',
      'address': '',
      'reading': '',
      'gender': '',
      'city': '',
      'file': ''
    };
  }

  ngOnInit(): void {
    this.userValidation = new ValidationManager({
      'First Name': 'required',
      'Last Name': 'required',
      'City': 'required',
      'Address': 'required',
      'Hobbies': 'required',
      'File': 'required',
      'Gender': 'required'
    });
  }

  fileHandler($event) {
    this.obj.file = $event.target.files[0].name;
    console.log(this.obj.file);
  }

  submit() {
    if (this.userValidation.isValid()) {
      if (this.obj.reading) {
        this.obj.reading = 'Reading';
      }
      this.userList.push(JSON.parse(JSON.stringify(this.obj)));
      this.showTable = true;
      this.rerender();
      this.userValidation.reset();
      this.loadObj();
    }
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
}
