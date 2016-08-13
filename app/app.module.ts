import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';


import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { MdToolbarModule } from '@angular2-material/toolbar';

import { AppComponent }  from './component/app.component';

import {ProjectService} from './service/project.service';
import {GlobalEventService} from './service/globalEvent.service';
import {AssetService} from './service/asset.service';

import { AssetComponent } from './component/asset.component';
import { AssetFieldComponent } from './component/assetField.component';
import { AssetGroupComponent } from './component/assetGroup.component';
import { AssetHeaderComponent } from './component/assetHeader.component';
import { ObjectRendererComponent } from './component/objectRenderer.component';

@NgModule({
  imports:      [ BrowserModule, MdButtonModule, FormsModule, MdCardModule, MdToolbarModule ],
  providers:	[ AssetService, ProjectService, GlobalEventService ],
  declarations: [ AppComponent, AssetComponent, AssetFieldComponent, AssetGroupComponent, AssetHeaderComponent, ObjectRendererComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }