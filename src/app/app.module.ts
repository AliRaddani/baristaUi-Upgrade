import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SearchComponent } from './shared/search/search.component';
import { UserComponent } from './shared/user/user.component';
import { ClusterComponent } from './side-menu/cluster/cluster.component';
import { RemoveClusterComponent } from './side-menu/remove-cluster/remove-cluster.component';
import { HttpClientModule } from '@angular/common/Http';
import { BaristaService } from './services/barista.service';
import { DisplayComponent } from './display/display.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    SearchComponent,
    UserComponent,
    ClusterComponent,
    RemoveClusterComponent,
    DisplayComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule 

  ],
  providers: [BaristaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
