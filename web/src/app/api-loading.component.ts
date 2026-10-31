import {Component, inject} from '@angular/core';
import {ApiLoadingService} from './api-loading.service';

@Component({
  selector: 'app-api-loading',
  standalone: true,
  template: `
    @if (api.loading()) {
      <div class="api-loading" role="status" aria-live="polite">
        <div class="loading-card">
          <span class="spinner" aria-hidden="true"></span>
          <span>Loading report...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .api-loading { position:fixed; inset:0; z-index:1000; display:flex; align-items:center; justify-content:center; background:#f3f5f9b3; cursor:progress; }
    .loading-card { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap:16px; padding:32px 48px; border:1px solid #dce2ec; border-radius:16px; background:#fff; color:#334155; box-shadow:0 8px 32px #172b4d26; font-size:15px; }
    .spinner { width:40px; height:40px; border:4px solid #e0e7ff; border-top-color:#4f46e5; border-radius:50%; animation:api-spin .8s linear infinite; }
    @keyframes api-spin { to { transform:rotate(360deg); } }
    @media (prefers-reduced-motion:reduce) { .spinner { animation:none; } }
    @media print { .api-loading { display:none; } }
  `],
})
export class ApiLoadingComponent {
  readonly api = inject(ApiLoadingService);
}
