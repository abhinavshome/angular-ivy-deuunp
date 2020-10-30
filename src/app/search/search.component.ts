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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  searchText(searchTerm) {
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

  unhighlight(res) {
    res.highlighted = false;
  }
}
