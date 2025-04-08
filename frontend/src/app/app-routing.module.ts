import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';

const routes: Routes = [
    { path: 'wardrobe', component: WardrobeListComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
