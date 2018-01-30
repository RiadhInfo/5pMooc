import { Component, OnInit } from '@angular/core';
import { CourService } from '../../services/cour.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-listcours',
  templateUrl: './cour.component.html',
  styleUrls: ['./cour.component.css']
})
export class CourComponent implements OnInit {



 title = 'ngxPagination Demo';
  currentUrl;
  messageClass;
  message;
  cours;
  collection = [];
  p;

  constructor(private courService: CourService, public authService: AuthService,
    private route: ActivatedRoute, private location: Location) {
     /*for (let i = 1 ; i <= 100 ; i++) {
        this.collection.push('Angular ' + i + '.0 ' )
     }*/
   }

  ngOnInit() {
    this.getAllCours();
  }


  getAllCours() {
    // Function to GET all blogs from database
    this.courService.getAllCours().subscribe(data => {
      console.log(data);
      this.cours = data; // Assign array to use in HTML
    });
  }


}
