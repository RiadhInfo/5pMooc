import { Component, OnInit } from '@angular/core';
import { CourService } from '../../services/cour.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  currentUrl;
  cours = [];

  constructor(private courService: CourService, private authService: AuthService,
    private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    //////
    this.getCoursByCategorie();
  }
///////
getCoursByCategorie() {
  this.currentUrl = this.route.snapshot.params;
  console.log('ena tawa component categorie');
  console.log(this.currentUrl.name);
   this.courService.getCoursByCategorie(this.currentUrl.name).subscribe(data => {
     this.cours = data; // Assign array to use in HTML
     console.log(this.cours);
   });
}
}
