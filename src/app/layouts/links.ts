import { SystemRoles } from '@core/modules/authorization/model/authorization.config';
import { MenuItemModel } from './model/layout.interface';
import { UserState } from '@core/modules/user/state/user.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import {
  ClientsModal,
  UserModel,
} from '@modules/user-management/model/user-management.models';

// class Clients {
//   public user: UserModel;

//   constructor() {
//     this.user$.subscribe((userData) => {
//       this.user = userData;
//       // console.log('user', this.user);
//     });
//   }
//   @Select(UserState.user) public user$: Observable<UserModel>;
// }

// function GetListOfClients(): MenuItemModel[] {
//   const clients = new Clients();
//   const listOfClientclients: MenuItemModel[] = [];
//   clients.user.involvedClients.map((client) => {
//     const clientItem: MenuItemModel = {
//       label: client.name,
//       link: client.id,
//       roles: [SystemRoles.Master],
//     };
//     listOfClientclients.push(clientItem);
//   });
//   return listOfClientclients;
// }

const userLinks: MenuItemModel[] = [
  {
    label: 'Home',
    link: '/dashboard',
    // icon: 'icon.svg',
    materialIcon: {
      isSvg: true,
      name: 'home'
    },
    roles: [
      SystemRoles.ExternalAdmin,
      SystemRoles.SuperAdmin,
      SystemRoles.InternalAdmin,
    ],
  },
  {
    label: 'My Accounts',
    roles: [SystemRoles.ExternalAdmin],
    children: [],
    materialIcon: {
      isSvg: true,
      name: 'profiles'
    },
  },
  {
    label: 'Requests',
    roles: [SystemRoles.ExternalAdmin],
    children: [],
    materialIcon: {
      isSvg: true,
      name: 'requests'
    },
    // link: '/tickets',
  },
  {
    label: 'Requests',
    roles: [SystemRoles.InternalAdmin, SystemRoles.SuperAdmin],
    link: '/my-tickets',
    materialIcon: {
      isSvg: true,
      name: 'requests'
    },
    // link: '/tickets',
  },
  {
    label: 'Organization',
    roles: [SystemRoles.SuperAdmin],
    link: '/organization',
    materialIcon: {
      isSvg: true,
      name: 'organization'
    },
  },

  {
    label: 'Profiles',
    roles: [SystemRoles.SuperAdmin, SystemRoles.InternalAdmin],
    link: '/profiles',
    materialIcon: {
      isSvg: true,
      name: 'profiles'
    },
  },
  {
    label: 'Purchase Orders',
    roles: [SystemRoles.InternalAdmin],
    link: '/po',
    materialIcon: {
      isSvg: true,
      name: 'po-icon'
    },
  },
  {
    label: 'Team Association',
    roles: [SystemRoles.SuperAdmin, SystemRoles.InternalAdmin],
    link: '/assigned-profiles',
    materialIcon: {
      isSvg: true,
      name: 'assign-profile'
    },
  },
  {
    label: 'Billing Cycles',
    roles: [SystemRoles.InternalAdmin],
    link:'/billing',
    materialIcon:{
      isSvg: true,
      name: 'billing'
    }
  },
  {
    label: 'Monthly Billing Cycle',
    roles: [SystemRoles.InternalAdmin],
    link: '/monthly-billing-cycle',
    materialIcon : {
      isSvg: true,
      name: 'monthly_billing_cycle'
    }
  },
  {
    label: 'My Team',
    roles: [SystemRoles.InternalAdmin],
    link: '/my-team',
    materialIcon : {
      isSvg: true,
      name: 'my_Team',
  }

  },
  {
    label: 'User Management',
    roles: [SystemRoles.SuperAdmin],
    children: [
      {
        label: 'External',
        link: '/clients-management/external/all',
        roles: [SystemRoles.SuperAdmin],
        materialIcon: {
          isSvg: true,
          name: 'external'
        },
      },
      {
        label: 'Internal',
        link: '/clients-management/internal/all',
        roles: [SystemRoles.SuperAdmin],
        materialIcon: {
          isSvg: true,
          name: 'internal'
        },
      },
    ],
    materialIcon: {
      isSvg: true,
      name: 'user-management'
    },
  },
  {
    label: 'Admins assignments for feedback',
    roles: [SystemRoles.SuperAdmin],
    link: '/admins-assignments',
    materialIcon: {
      isSvg: false,
      name: 'feedback'
    },
  },

  // {
  //   label: 'Requests',
  //   roles: [SystemRoles.Master],
  //   children: [],
  //   // [
  //   //   // {
  //   //   //   label: 'My Requests',
  //   //   //   link: 'requests/own-requests',
  //   //   //   roles: [SystemRoles.Master],
  //   //   // },
  //   //   // {
  //   //   //   label: 'All Requests',
  //   //   //   link: 'requests',
  //   //   //   roles: [SystemRoles.workflowManagement],
  //   //   // },
  //   // ],
  // },

  // {
  //   label: 'Users Management',
  //   link: '/users-management',
  //   roles: [SystemRoles.PermissionManagement],
  // },

  // {
  //   label: 'My Requests',
  //   link: 'requests/own-requests',
  //   roles: [
  //     SystemRoles.Master
  //   ]
  // } ,{
  //   label: 'All Requests',
  //   link: 'requests',
  //   roles: [
  //     SystemRoles.workflowManagement
  //   ]
  // },

  // {
  //   label: 'Payslip',
  //   roles: [
  //     SystemRoles.CEO,
  //     SystemRoles.ITSupport,
  //     SystemRoles.Employee,
  //     SystemRoles.Finance,
  //     SystemRoles.Manager,
  //     SystemRoles.PayrollManager,
  //     SystemRoles.HRManager,
  //   ],
  //   children: [
  //     {
  //       label: 'My Payslip',
  //       link: '/payslips/my-payslip',
  //       roles: [
  //         SystemRoles.CEO,
  //         SystemRoles.ITSupport,
  //         SystemRoles.Employee,
  //         SystemRoles.Finance,
  //         SystemRoles.Manager,
  //         SystemRoles.PayrollManager,
  //         SystemRoles.HRManager,

  //       ],
  //     }, {
  //       label: 'My Team Payslips',
  //       link: '/payslips/team-payslips',
  //       roles: [SystemRoles.PayrollManager]
  //     }
  //   ]
  // },
];

/**
 *
 * @param roles
 * @returns {MenuItemModel[]} - Array of sidenav links
 */
export function getLinksBasedOnRole(roles: string[]): MenuItemModel[] {
  let assignedLinks = [];
  assignedLinks = userLinks.filter((link: MenuItemModel) => {
    if (link.roles && roles.length) {
      const canLoad: boolean = link.roles.some(
        (val) => roles.indexOf(val) !== -1
      );
      if (canLoad && link.children)
        link.children = link.children.filter((child: MenuItemModel) => {
          if (child.roles && roles.length) {
            const canLoadChild = child.roles.some(
              (val) => roles.indexOf(val) !== -1
            );
            if (canLoadChild) return child;
          }
        });
      if (canLoad) return link;
    }
  });
  return assignedLinks;
}

// Recursive but not now
// export function getLinksBasedOnRole(roles: string[], assignedLinks = [], children: boolean = false): MenuItemModel[] {
//   userLinks.forEach((link: MenuItemModel) => {
//     if (link.roles && roles.length) {
//       const canLoad: boolean = link.roles.some((val) => roles.indexOf(val) !== -1);
//       if (canLoad && !children) {
//         assignedLinks.push(link);
//         if (link.children) {
//           getLinksBasedOnRole(roles, assignedLinks.find(assignedLink => assignedLink.label = link.label), true)
//         }
//       }
//       else if (canLoad && children) assignedLinks.push(link)
//     }

//   })

//   return assignedLinks;
// }
