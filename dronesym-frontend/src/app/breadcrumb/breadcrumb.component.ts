
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

/** rxjs Imports */
import { filter } from 'rxjs/operators';

/** Custom Model */
import { Breadcrumb } from './breadcrumb';


const routeDataBreadcrumb = 'breadcrumb';

const routeParamBreadcrumb = 'routeParamBreadcrumb';

const routeResolveBreadcrumb = 'routeResolveBreadcrumb';

const routeAddBreadcrumbLink = 'addBreadcrumbLink';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],

})
export class BreadcrumbComponent implements OnInit {

  /** Array of breadcrumbs. */
  breadcrumbs: Breadcrumb[];


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.generateBreadcrumbs();
  }

  ngOnInit() {
  }

  /**
   * Generates the array of breadcrumbs for the visited route.
   */
  generateBreadcrumbs() {
    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    onNavigationEnd.subscribe(() => {
      this.breadcrumbs = [];
      let currentRoute = this.activatedRoute.root;
      let currentUrl = '';

      while (currentRoute.children.length > 0) {
        const childrenRoutes = currentRoute.children;
        let breadcrumbLabel: any;
        let url: any;

        childrenRoutes.forEach(route => {
          currentRoute = route;
          breadcrumbLabel = false;

          if (route.outlet !== 'primary') {
            return;
          }

          const routeURL = route.snapshot.url.map(segment => segment.path).join('/');
          currentUrl += `/${routeURL}`;

          if (currentUrl === '/') {
            breadcrumbLabel = 'Home';
          }

          const hasData = (route.routeConfig && route.routeConfig.data);

          if (hasData) {
            if (route.snapshot.data.hasOwnProperty(routeResolveBreadcrumb) && route.snapshot.data[routeResolveBreadcrumb]) {
              breadcrumbLabel = route.snapshot.data;
              route.snapshot.data[routeResolveBreadcrumb].forEach((property: any) => {
                breadcrumbLabel = breadcrumbLabel[property];
              });
            } else if (route.snapshot.data.hasOwnProperty(routeParamBreadcrumb) &&
            route.snapshot.paramMap.get(route.snapshot.data[routeParamBreadcrumb])) {
              breadcrumbLabel = route.snapshot.paramMap.get(route.snapshot.data[routeParamBreadcrumb]);
            } else if (route.snapshot.data.hasOwnProperty(routeDataBreadcrumb)) {
              breadcrumbLabel = route.snapshot.data[routeDataBreadcrumb];
            }

            if (route.snapshot.data.hasOwnProperty(routeAddBreadcrumbLink)) {
              url = route.snapshot.data[routeAddBreadcrumbLink];
            } else {
              url = currentUrl;
            }
          }

          const breadcrumb: Breadcrumb = {
            label: breadcrumbLabel,
            url: url
          };
          if (breadcrumbLabel) {
            this.breadcrumbs.push(breadcrumb);
          }
        });
      }
    });
  }
}
