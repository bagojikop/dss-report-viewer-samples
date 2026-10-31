import {Component,Input,signal} from '@angular/core';
@Component({
 selector:'app-doc-code',standalone:true,
 template:`<div class="code-box"><div class="code-label"><span>{{label}}</span><button type="button" (click)="copy()">{{status()}}</button></div><pre tabindex="0" [attr.aria-label]="label"><code>{{code}}</code></pre></div>`,
 styles:[`
 :host{display:block;min-width:0}.code-box{border:1px solid #283347;border-radius:12px;background:#111b2c;color:#dbe5f4;overflow:hidden}.code-label{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #283347;color:#9eafc7;font:12px Arial,sans-serif}.code-label button{background:#1e2b40;border:1px solid #3a4860;border-radius:5px;color:#dbe5f4;padding:5px 10px;cursor:pointer;font:inherit}pre{margin:0;padding:18px;overflow:auto;line-height:1.75;font:12px/1.8 Consolas,'Courier New',monospace;tab-size:2}button:focus-visible,pre:focus-visible{outline:2px solid #86b5ff;outline-offset:-2px}
 `]
})
export class DocCodeComponent {
 @Input() label='Terminal';@Input() code='';status=signal('Copy');
 async copy(){try{await navigator.clipboard.writeText(this.code);this.status.set('Copied');}catch{this.status.set('Select & copy');}setTimeout(()=>this.status.set('Copy'),2500);}
}
