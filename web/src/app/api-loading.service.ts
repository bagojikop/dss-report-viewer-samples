import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ApiLoadingService {
  private pending = 0;
  private shownAt = 0;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private readonly visible = signal(false);
  readonly loading = this.visible.asReadonly();

  start() {
    clearTimeout(this.hideTimer);
    this.pending++;
    if (!this.visible()) {
      this.shownAt = Date.now();
      this.visible.set(true);
    }
  }
  finish() {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending > 0) return;
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      if (this.pending === 0) this.visible.set(false);
    }, Math.max(0, 400 - (Date.now() - this.shownAt)));
  }
}
