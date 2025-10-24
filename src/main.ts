import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
<<<<<<< HEAD
import { App } from './app/app';

bootstrapApplication(App, appConfig)
=======
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
>>>>>>> f364141439f5e0194a97af8b02c7e02d2daa1297
  .catch((err) => console.error(err));
