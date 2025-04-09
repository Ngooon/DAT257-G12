// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// // import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// // import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes), // Lägg till routing här
//     ...appConfig.providers,
//   ],
// }).catch((err) => console.error(err));

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

