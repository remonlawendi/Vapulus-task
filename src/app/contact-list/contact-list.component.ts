import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Contact } from '../models/Contact.model';
import { ContactService } from '../core/services/contact.service';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { genCharArray } from '../utils/functions/generate-alphabet.function';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  @ViewChild('scrollableContainer', { static: true })
  scrollableContainer: ElementRef<HTMLDivElement>;

  @ViewChild('seachInputElement', { static: true })
  searchInputElement: ElementRef<HTMLInputElement>;

  contacts: Contact[];
  private _clonedContacts: Contact[];
  sortedContactsDictionary: { [key: string]: Contact[] } = {};
  recentContacts: Observable<Contact[]> = this._contactService.getRecentContacts();
  constructor(private readonly _contactService: ContactService) {}

  ngOnInit() {
    this._contactService.getContacts().subscribe(contacts => {
      this.contacts = contacts;
      this._clonedContacts = contacts;
      // after contacts arrives build our sorted dictionary.
      this._buildSortedContactsDictionary();
    });

    this.registerOnUserSearchEvent();
  }

  scrollToLabel(char: string) {
    char = char.toLowerCase();
    const labelInList = document.querySelector(`[data-label="${char}"]`) as HTMLLabelElement;
    if (labelInList) {
      const scrollTo = labelInList.offsetTop;
      this.scrollableContainer.nativeElement.scrollTo({ behavior: 'smooth', top: scrollTo });
    }
  }

  registerOnUserSearchEvent() {
    fromEvent(this.searchInputElement.nativeElement, 'input')
      .pipe(
        map((e: Event) => <HTMLInputElement>e.target),
        map(input =>
          input.value
            .toLowerCase()
            .trim()
            .replace(' ', '')
        ),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => this._filterContacts(searchTerm));
  }

  private _filterContacts(searchTerm: string): void {
    if (!searchTerm.length) {
      this.contacts = this._clonedContacts;
      this._updateSortedDictionary();
      return;
    }
    this.contacts = this._clonedContacts.filter(contact =>
      (contact.lastName ? contact.firstName.toLowerCase() + contact.lastName.toLowerCase() : contact.firstName.toLowerCase())

        .replace(' ', '')
        .includes(searchTerm)
    );
    this._updateSortedDictionary();
  }

  private _updateSortedDictionary() {
    this.sortedContactsDictionary = {};
    this._buildSortedContactsDictionary();
  }

  private _getAllAplhabet(): Array<string> {
    return genCharArray('a', 'z');
  }
  private _buildSortedContactsDictionary() {
    const alphabets = this._getAllAplhabet();
    alphabets.reduce(
      (currentState, alphabet, i, self) => {
        for (const contact of this.contacts) {
          // get first character form contact firstname
          let firstChar: string;
          if (contact.firstName) {
            [firstChar] = contact.firstName.split('');
          }
          // build our array per current alphabet
          // dictionary = { 'a' : [], 'b': [], 'c': [] }
          if (!this.sortedContactsDictionary[alphabet]) {
            this.sortedContactsDictionary[alphabet] = [];
          }
          // push contact in correct array.
          // dictionary['a'] = [Contact, Contact, ...etc].
          if (alphabet === firstChar.toLowerCase()) {
            this.sortedContactsDictionary[alphabet].push(contact);
          }
        }
        return currentState;
      },
      // start our reduce loop with our dictionary.
      this.sortedContactsDictionary
    );
  }

  get ObjectKeys(): (object: Object) => string[] {
    return Object.keys;
  }
}
