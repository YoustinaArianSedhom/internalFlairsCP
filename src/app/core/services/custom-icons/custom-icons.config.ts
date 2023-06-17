/**
 * @summary Here we define the custom icons base path along side the custom icons config
 *
 * @explain the name of the icon will be used alongside the base path, and with the svg extension at the end
 * to format the path automatically on the CustomIcons service
 *
 *
 * @note Incase there's another path for specific icon you should define its own path to override the default path formatter
 *
 *
 * @note Name of the icon that you defined here will be used as value for "svgIcon" on the mat-icon element
 *
 *
 * For reference
 * @see [https://alligator.io/angular/custom-svg-icons-angular-material/]
 */

interface CustomIcon {
  name: string;
  path?: string;
}

export const ICONS_BASE_PATH = "assets/images/";

export const customIcons: CustomIcon[] = [
  {
    name: 'home'
  },
  {
    name: 'voucher'
  },
  {
    name: 'referral-bonus'
  },
  {
    name: 'HR-letter'
  },
  {
    name: 'change-management'
  },
  {
    name: 'promotion'
  },
  {
    name: 'raise'
  },
  {
    name: 'requests'
  },
  {
    name: 'profiles'
  },
  {
    name: 'assign-profile'
  },
  {
    name: 'organization'
  },
  {
    name: 'user-management'
  },
  {
    name: 'account'
  },
  {
    name: 'external'
  },
  {
    name: 'request'
  },
  {
    name: 'internal'
  },
  {
    name: 'end-association'
  },
  {
    name: 'edit-end-association'
  },

  {
    name: 'check'
  },
  {
    name: 'po-icon'
  },
  {
    name: 'billing'
  },
  {
    name: 'monthly_billing_cycle'
  },
  {
    name: 'my_Team'
  },
  {
    name: 'associate-multiple'
  },
  {
    name: 'info-circle'
  },
  {
    name: 'lock'
  },
  {
    name: 'unlock'
  },
  {
    name: 'add_discount'
  },
  {
    name: 'delete-icon'
  },
  {
    name: 'shortage'
  },
  {
    name: 'toggle_contract_type'
  },
  {
    name: 'add-association'
  },
  {
    name: 'clone_association'
  },
];
