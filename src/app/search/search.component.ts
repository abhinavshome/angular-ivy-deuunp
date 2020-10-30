import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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

  constructor(private userService: UserService) {}

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
      Object.keys(this.users[0]).forEach(key => {
        if (key !== "items") {
          if (user[key].indexOf(searchTerm) !== -1) {
            this.results.push({
              foundIn: key,
              record: user
            });
          }
        } else {
          if (user[key].find(u => u === searchTerm)) {
            this.results.push({
              foundIn: key,
              record: user
            });
          }
        }
      });
    });
  }

  highlight(res) {
    res.highlighted = true;
  }

  highlightNext() {
    console.log("kk");
  }

  highlightPrev() {
    console.log("kks");
  }

  unhighlight(res) {
    res.highlighted = false;
  }
}
