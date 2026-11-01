import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SITE} from '../site-info';
@Component({selector:'app-contact-us',standalone:true,imports:[RouterLink],templateUrl:'./contact-us.component.html',styleUrl:'./company-pages.css'})
export class ContactUsComponent {readonly site=SITE;}
