import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from 'src/app/models/Contact.model';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private readonly _http: HttpClient) {}

  public contacts: Contact[];
  recentContacts: Contact[];

  getContacts(): Observable<Contact[]> {
    if (!this.contacts) {
      return this._http
        .get<Contact[]>('assets/contacts.json', { observe: 'response' })
        .pipe(
          map(resp => resp.body.filter(x => !!x.firstName)),
          tap(contacts => (this.contacts = contacts))
        );
    }

    return of(this.contacts);
  }

  getRecentContacts() {
    if (!this.recentContacts) {
      return this._http

        .get<Contact[]>('assets/recent-contact.json', { observe: 'response' })
        .pipe(
          map(resp => resp.body),
          tap(contacts => (this.contacts = contacts))
        );
    }

    return of(this.recentContacts);
  }

  addContact(contact: Contact): void {
    this.contacts.unshift(contact);
  }
}
