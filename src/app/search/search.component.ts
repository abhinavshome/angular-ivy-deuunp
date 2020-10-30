import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { User } from "../user";
import { UserService } from "../user.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  users: User[];
  results: any[] = [];
  highlighted = -1;
  isOpen = false;

  constructor(
    private userService: UserService,
    private elementRef: ElementRef
  ) {}

  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // clicked outside => close dropdown list
      this.isOpen = false;
    }
  }

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  searchText(searchTerm, event) {
    console.log(event.value);

    console.log(`Searching for ${searchTerm}`);
    this.results = [];
    if (searchTerm === "") {
      return;
    }
    this.users.forEach(user => {
      const highlightRecord = Object.assign({}, user);
      Object.keys(this.users[0]).forEach(key => {
        if (key !== "items") {
          const index = user[key].indexOf(searchTerm);
          if (index !== -1) {
            highlightRecord[key] =
              highlightRecord[key].slice(0, index) +
              "<span>" +
              searchTerm +
              "</span>" +
              highlightRecord[key].slice(
                index + searchTerm.length,
                highlightRecord[key].length
              );
            this.results.push({
              foundIn: key,
              record: highlightRecord
            });
          }
        } else {
          if (user[key].find(u => u === searchTerm)) {
            this.results.push({
              foundIn: key,
              record: highlightRecord
            });
          }
        }
      });
    });
  }

  highlight(i) {
    this.highlighted = i;
  }

  highlightNext() {
    if (this.highlighted < this.results.length - 1) {
      this.highlighted++;
    }
  }

  highlightPrev() {
    if (this.highlighted > 0) {
      this.highlighted--;
    }
  }

  unhighlight() {
    this.highlighted = -1;
  }
}
