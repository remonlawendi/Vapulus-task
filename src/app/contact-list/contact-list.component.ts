import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Contact } from "../models/Contact.model";
import { ContactService } from "../core/services/contact.service";
import { tap, map, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { genCharArray } from "../utils/functions/generate-alphabet.function";
import { fromEvent } from "rxjs";

@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.css"]
})
export class ContactListComponent implements OnInit {
  @ViewChild("seachInputElement", { static: true })
  searchInputElement: ElementRef<HTMLInputElement>;

  contacts: Contact[];
  private _clonedContacts: Contact[];
  sortedContactsDictionary: { [key: string]: Contact[] } = {};

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

  registerOnUserSearchEvent() {
    fromEvent(this.searchInputElement.nativeElement, "input")
      .pipe(
        map((e: Event) => <HTMLInputElement>e.target),
        map(input =>
          input.value
            .toLowerCase()
            .trim()
            .replace(" ", "")
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
      (contact.firstName.toLowerCase() + contact.lastName.toLowerCase())

        .replace(" ", "")
        .includes(searchTerm)
    );
    this._updateSortedDictionary();
  }

  private _updateSortedDictionary() {
    this.sortedContactsDictionary = {};
    this._buildSortedContactsDictionary();
  }

  private _getAllAplhabet(): Array<string> {
    return genCharArray("a", "z");
  }
  private _buildSortedContactsDictionary() {
    const alphabets = this._getAllAplhabet();
    alphabets.reduce(
      (currentState, alphabet, i, self) => {
        for (let contact of this.contacts) {
          // get first character form contact firstname
          const [firstChar] = contact.firstName.split("");
          // build our array per current alphabet
          // dictionary = { 'a' : [], 'b': [], 'c': [] }
          if (!this.sortedContactsDictionary[alphabet]) {
            this.sortedContactsDictionary[alphabet] = [];
          }
          // push contact in correct array.
          // dictionary['a'] = [Contact, Contact, ...etc].
          if (alphabet == firstChar.toLowerCase()) {
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
