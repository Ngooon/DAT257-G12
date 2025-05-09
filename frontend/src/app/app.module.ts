import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WardrobeListComponent } from './components/garment/wardrobe-list/wardrobe-list.component';


import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { GarmentDetailsComponent } from './components/garment/garment-details/garment-details.component';
import { GarmentFormComponent } from './components/garment/garment-form/garment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsageListComponent } from './components/usage/usage-list/usage-list.component';
import { UsageDetailsComponent } from './components/usage/usage-details/usage-details.component';
import { UsageFormComponent } from './components/usage/usage-form/usage-form.component';
import { AuthInterceptor } from './auth.interceptor';
import { ListingListComponent } from './components/listing/listing-list/listing-list.component';
import { ListingFormComponent } from './components/listing/listing-form/listing-form.component';
import { ListingDetailsComponent } from './components/listing/listing-details/listing-details.component';
import { UsageCalenderComponent } from './components/usage/usage-calender/usage-calender.component';
import { MarketListComponent } from './components/listing/market-list/market-list.component';
import { SoldPopUpComponent } from './components/listing/sold-pop-up/sold-pop-up.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UsageSummaryComponent } from './components/dashboard/usage-summary/usage-summary.component';
import { ListingSummaryComponent } from './components/dashboard/listing-summary/listing-summary.component';
import { UserComponent } from './components/user/user/user.component';
import { UsersListComponent } from './components/user/users-list/users-list.component';


import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/aura';
import Aura from '@primeng/themes/aura';
import { ChartModule } from 'primeng/chart';

registerLocaleData(localeSv);

@NgModule({
    declarations: [
        AppComponent,
        WardrobeListComponent,
        GarmentDetailsComponent,
        GarmentFormComponent,
        UsageListComponent,
        UsageDetailsComponent,
        UsageFormComponent,
        ListingListComponent,
        ListingFormComponent,
        ListingDetailsComponent,
        UsageCalenderComponent,
        MarketListComponent,
        SoldPopUpComponent,
        DashboardComponent,
        UsageSummaryComponent,
        ListingSummaryComponent,
        UserComponent,
        UsersListComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
        ChartModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'sv-SE' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            // preset: Material,
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: '(prefers-color-scheme: dark)',
                cssLayer: false
            }
        }
    })
    ],
    bootstrap: [AppComponent]
})


export class AppModule { }

