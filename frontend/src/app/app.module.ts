import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';


import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { TestComponent } from './test/test.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';

registerLocaleData(localeSv);

@NgModule({
    declarations: [
        AppComponent,
        WardrobeListComponent,
        TestComponent,
        GarmentDetailsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'sv-SE' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
