import { ContactRolesByType } from '@sneat/app';

export const contactRolesByType: ContactRolesByType = {
  company: [
    { id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
    {
      id: 'consignee',
      title: 'Consignee',
      canBeImpersonatedByRoles: ['buyer', 'freight_agent', 'receive_agent'],
    },
    {
      id: 'dispatcher',
      title: 'Dispatcher',
      canBeImpersonatedByRoles: ['dispatch_agent'],
    },
    { id: 'dispatch_agent', title: 'Dispatch Agent', iconName: 'body-outline' },
    { id: 'receive_agent', title: 'Receive Agent', iconName: 'body-outline' },
    { id: 'freight_agent', title: 'Freight Agent', iconName: 'train-outline' },
    {
      id: 'notify_party',
      title: 'Notify Party',
      canBeImpersonatedByRoles: ['buyer', 'freight_agent', 'receive_agent'],
    },
    { id: 'port', title: 'Port' },
    { id: 'shipper', title: 'Shipper' },
    { id: 'shipping_line', title: 'Shipping Line' },
    { id: 'trucker', title: 'Trucker' },
  ],
  person: [
    { id: 'driver', title: 'Driver', childForRoles: ['trucker'] },
    {
      id: 'employee',
      title: 'Driver',
      childForRoles: [
        'dispatch_agent',
        'receive_agent',
        'buyer',
        'freight_agent',
        'consignee',
        'dispatcher',
        'notify_party',
        'trucker',
        'shipper',
        'shipping_line',
      ],
    },
  ],
  location: [
    { id: 'port', title: 'Port' },
    {
      id: 'warehouse',
      title: 'Warehouse',
      childForRoles: ['buyer', 'shipper'],
    },
  ],
  vehicle: [
    { id: 'ship', title: 'Ship', childForRoles: ['shipping_line'] },
    { id: 'truck', title: 'Truck', childForRoles: ['trucker'] },
  ],
};
