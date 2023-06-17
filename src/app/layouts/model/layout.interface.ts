
export interface MenuItemModel {
  id?: number;
  label: string;
  icon?: string;
  link?: string;
  children?: MenuItemModel[];
  action?: string;
  roles?: string[];
  materialIcon?: {
    isSvg: boolean;
    name: string;
  };
  hidden?: boolean;
  queryParams?: object;
  clickHandler?: () => any;
}

