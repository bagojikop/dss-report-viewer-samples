import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SITE} from '../site-info';
@Component({selector:'app-about-us',standalone:true,imports:[RouterLink],templateUrl:'./about-us.component.html',styleUrl:'./company-pages.css'})
export class AboutUsComponent {readonly site=SITE;}
