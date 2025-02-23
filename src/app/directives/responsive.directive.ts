import { Directive } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const mobileBreakpoint = 900;
const CUSTOM_BREAKPOINTS = {
  small: `(max-width: ${mobileBreakpoint}px)`, // is matched when the screen width is 1299px or less
};

@Directive({
  selector: '[appResponsive]',
  standalone: true,
  host: {
    '[class.mobile]': 'isMobile', // Dynamically apply a class based on the breakpoint match
  },
  exportAs: 'responsive' // https://medium.com/netanelbasal/angular-2-take-advantage-of-the-exportas-property-81374ce24d26
})
export class MobileClassDirective {
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([CUSTOM_BREAKPOINTS.small])
      .pipe(takeUntilDestroyed()) // https://medium.com/@chandrashekharsingh25/exploring-the-takeuntildestroyed-operator-in-angular-d7244c24a43e
      .subscribe((result) => {
        console.log('Is Mobile:', result); // Verifica se il valore cambia
        this.isMobile = result.matches;
      });
  }
}
