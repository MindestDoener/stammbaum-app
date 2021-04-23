import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PersonDisplayComponent } from './editor/person-display/person-display.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ContextMenuContentComponent } from './editor/context-menu-content/context-menu-content.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PersonDisplayComponent,
    ContextMenuContentComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgbModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }