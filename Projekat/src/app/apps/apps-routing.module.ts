import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';


import { FullComponent } from './layout/full/full.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { LoginComponent } from './login/login.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { EditProfileComponent } from './my-profile/edit-profile/edit-profile.component';
import { AddBlogComponent } from './blog/add-blog/add-blog.component';
import { RecentBlogsComponent } from './blog/recent-blogs/recent-blogs.component';
import { AuthGuard } from './_services/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', component: BlogComponent },
      { path: 'blogDetail/:id', component: BlogDetailComponent },
      { path: 'about', component: AboutComponent },
      { path: 'register', component: RegisterComponent},
      { path: 'verify-email-address', component: VerifyEmailAddressComponent},
      { path: 'login', component: LoginComponent},
      { path: 'my-profile', component: MyProfileComponent},
      { path: 'edit-profile', component: EditProfileComponent},
      { path: 'add-blog', component: AddBlogComponent, canActivate:[AuthGuard], data: {
        roles: '[ROLE_ADMIN]'
      }},
      { path: 'recent-blogs', component: RecentBlogsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ AuthGuard ]
})
export class AppsRoutingModule { }
