import {Component,Input,OnChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector:'app-invoice-action-form',
  standalone:true,
  imports:[FormsModule],
  template:`
    <form (ngSubmit)="saved=true">
      <div class="fields">
        <label>Invoice ID<input name="invoiceId" [value]="invoiceId" readonly /></label>
        <label>Firm ID<input name="firmId" [value]="firmId" readonly /></label>
        <label class="wide">Customer<input name="customer" [(ngModel)]="customer" /></label>
        <label>Amount<input name="amount" [value]="amount" readonly /></label>
        <label class="wide">Notes<textarea name="notes" [(ngModel)]="notes" rows="3"></textarea></label>
      </div>
      <button type="submit">Save demo form</button>
      @if(saved){<p role="status">Demo form saved locally.</p>}
    </form>
  `,
  styles:[`.fields { display:grid; grid-template-columns:1fr 1fr; gap:16px; } label { display:flex; flex-direction:column; gap:6px; font-weight:600; } .wide { grid-column:1/-1; } input,textarea { box-sizing:border-box; width:100%; padding:9px 11px; border:1px solid #cbd5e1; border-radius:5px; color:#1e293b; background:white; font:14px Arial,sans-serif; } input[readonly] { background:#f8fafc; } button { margin-top:18px; padding:10px 16px; border:0; border-radius:5px; color:white; background:#4338ca; cursor:pointer; } p { color:#047857; } @media(max-width:480px){.fields { grid-template-columns:1fr; }}`],
})
export class InvoiceActionFormComponent implements OnChanges {
  @Input() invoiceId='';
  @Input() firmId='';
  @Input() customer='';
  @Input() amount='';
  notes='';
  saved=false;
  ngOnChanges(){this.notes='';this.saved=false;}
}
