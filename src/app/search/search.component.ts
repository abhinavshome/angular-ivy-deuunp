import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
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
  numOfVisibleResults = 2;
  @ViewChild("resultsDiv") resultsDiv: ElementRef;

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

  searchText(searchTerm) {
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
          if (user[key].find(item => item.indexOf(searchTerm) !== -1)) {
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
      if (!this.isInView()) {
        this.resultsDiv.nativeElement.scrollTop += 100;
      }
    }
  }

  highlightPrev() {
    if (this.highlighted > 0) {
      this.highlighted--;
      if (!this.isInView()) {
        this.resultsDiv.nativeElement.scrollTop -= 100;
      }
    }
  }

  isInView() {
    const offset = Math.floor(this.resultsDiv.nativeElement.scrollTop / 100);
    console.log(offset);
    if (this.highlighted === offset || this.highlighted === offset + 1) {
      return true;
    }
    return false;
  }

  unhighlight() {
    this.highlighted = -1;
  }
}
