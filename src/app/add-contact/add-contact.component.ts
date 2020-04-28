import { Contact } from 'src/app/models/Contact.model';
import { ContactService } from './../core/services/contact.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Sanitizer,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { getBase64FromFile } from '../utils/functions/get-base64-from-file.function';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onAddContact = new EventEmitter<Contact>();

  @ViewChild('imageInputElemnt', { static: true })
  contactImageInputElement: ElementRef<HTMLInputElement>;

  private _contact: Contact = new Contact();
  constructor(
    private _contactService: ContactService,
    private _router: Router,
    private _sanitaizer: DomSanitizer
  ) {}
  addContact: FormGroup;
  ngOnInit() {
    this._buildForm();
  }
  ngAfterViewInit() {}
  private _buildForm(): void {
    this.addContact = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      countryCode: new FormControl(''),
      Phone: new FormControl('')
    });
    this._buildContactImage();
  }

  private _buildContactImage(): void {
    this.contactImageInputElement.nativeElement.addEventListener(
      'change',
      async e => {
        const base64File = await getBase64FromFile(
          this.contactImageInputElement.nativeElement.files[0]
        );
        this._contact.image = <string>(
          this._sanitaizer.bypassSecurityTrustUrl(
            //    'data:image/png;base64,' +
            base64File
          )
        );
      }
    );
  }
  OnSubmit() {
    // console.log(this.addContact);

    if (this.addContact.invalid) {
      return;
    }
    const {
      countryName,
      email,
      Phone,
      lastName,
      firstName
    } = this.addContact.value;

    this._contact.countryCode = countryName;
    this._contact.email = email;
    this._contact.lastName = lastName;
    this._contact.mobileNumber = Phone;
    this._contact.firstName = firstName;
    this._contactService.addContact(this._contact);
    this.onAddContact.emit(this._contact);
    this._router.navigate(['/contacts/list']);
    // console.log(this._contactService.contacts);
    this._buildForm();
  }
  cancel() {
    this._router.navigate(['/contacts/list']);
  }
}
