import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dmr',
  templateUrl: './dmr.component.html',
  styleUrls: ['./dmr.component.css']
})
export class DmrComponent implements OnInit {
  @Output() openP = new EventEmitter<any>();
  constructor(private route: Router) { }

  ngOnInit() {
  }
  openPage(page: string){
    this.openP.emit(page);
  }

  navigateTo(page: string){
    this.route.navigate(['dmrlist']);
  }
}
