export default function () {
  return [
    {
      title: 'User Profile',
      permission: null,
      htmlBefore: '<i class="bx bx-user"></i>',
      to: {
        name: 'userprofile',
      },
    },
    {
      title: 'Bookings',
      permission: 'viewBooking',
      htmlBefore:
        '<i class="bx bxs-book-content" style="font-size: 1.2rem"></i>',
      to: {
        name: 'bookings',
      },
    },
    {
      title: 'Clients',
      permission: 'viewClient',
      htmlBefore: '<i class="bx bx-user"></i>',
      to: {
        name: 'client',
      },
    },
    {
      title: 'Receives',
      permission: 'createLoading',
      htmlBefore: '<i class="bx bx-layer-plus" style="font-size: 1.2rem"></i>',
      to: {
        name: 'receives',
      },
    },
    {
      title: 'Store Potato',
      permission: 'createPotatoStoreReceipt',
      htmlBefore:
        '<i class="bx bx-align-justify" style="font-size: 1.1rem"></i>',
      to: {
        name: 'storepotato',
      },
    },
    {
      title: 'Deliveries',
      permission: 'createGatepass',
      htmlBefore: '<i class="bx bx-layer-minus" style="font-size: 1.2rem"></i>',
      to: {
        name: 'deliveries',
      },
    },
    {
      title: 'Expenses',
      permission: 'createDailyexpense',
      htmlBefore:
        '<i class="bx bx-message-square-detail" style="font-size: 1.2rem"></i>',
      items: [
        {
          title: 'Type & Category',
          permission: 'createExpense',
          htmlBefore: '<i class="bx bx-money" style="font-size: 1.1rem"></i>',
          to: {
            name: 'expenses',
          },
        },
        {
          title: 'Daily Expenses',
          permission: 'createDailyexpense',
          htmlBefore:
            '<i class="bx bx-dollar-circle" style="font-size: 1.1rem"></i>',
          to: {
            name: 'expenses-dailyexpenses',
          },
        },
      ],
    },
    {
      title: 'Employees',
      permission: 'createWorker',
      htmlBefore: '<i class="material-icons">contacts</i>',
      items: [
        // {
        //   title: 'all employee list',
        //   htmlBefore:
        //     '<i class="bx bx-user-pin" style="font-size: 1.1rem"></i>',
        //   to: {
        //     name: 'employees',
        //   },
        // },
        {
          title: 'admin managers',
          permission: 'createAdminmanager',
          htmlBefore:
            '<i class="bx bx-user-check" style="font-size: 1.1rem"></i>',
          to: {
            name: 'employees-role',
            params: { role: 'manager_admin' },
          },
        },
        {
          title: 'account managers',
          permission: 'createAccountmanager',
          htmlBefore:
            '<i class="bx bxs-user-detail" style="font-size: 1.1rem"></i>',
          to: {
            name: 'employees-role',
            params: { role: 'manager_account' },
          },
        },
        {
          title: 'store managers',
          permission: 'createStoremanager',
          htmlBefore:
            '<i class="bx bxs-user-rectangle" style="font-size: 1.1rem"></i>',
          to: {
            name: 'employees-role',
            params: { role: 'manager_store' },
          },
        },
        {
          title: 'workers',
          permission: 'createWorker',
          htmlBefore: '<i class="bx bx-user" style="font-size: 1.1rem"></i>',
          to: {
            name: 'employees-role',
            params: { role: 'worker' },
          },
        },
      ],
    },
    {
      title: 'Loan Management',
      permission: 'createLoandisbursement',
      htmlBefore: '<i class="bx bx-abacus" style="font-size: 1.2rem"></i>',
      to: {
        name: 'loans',
      },
    },
    {
      title: 'Bank Management',
      permission: 'createBankdeposit',
      htmlBefore: '<i class="bx bxs-bank" style="font-size: 1.2rem"></i>',
      items: [
        {
          title: 'accounts',
          permission: 'createBankdeposit',
          htmlBefore: '<i class="bx bx-cabinet" style="font-size: 1.1rem"></i>',
          to: {
            name: 'banks',
          },
        },
        {
          title: 'transactions',
          permission: 'createBankdeposit',
          htmlBefore:
            '<i class="bx bx-transfer" style="font-size: 1.1rem"></i>',
          to: {
            name: 'banks-transactions',
          },
        },
      ],
    },
    // {
    //   title: 'Accounting',
    //   htmlBefore:
    //     '<i class="bx bx-dollar-circle" style="font-size: 1.2rem"></i>',
    //   to: {
    //     name: 'accounting',
    //   },
    // },
    {
      title: 'Machine',
      permission: 'createMachinepartEntry',
      htmlBefore: '<i class="bx bx-microchip" style="font-size: 1.2rem"></i>',
      items: [
        {
          title: 'machine parts',
          permission: 'createMachinepart',
          htmlBefore:
            '<i class="bx bx-network-chart" style="font-size: 1.1rem"></i>',
          to: {
            name: 'machinemaintainance',
          },
        },
        {
          title: 'machine part entries',
          permission: 'createMachinepartEntry',
          htmlBefore:
            '<i class="bx bx-git-pull-request" style="font-size: 1.1rem"></i>',
          to: {
            name: 'machinemaintainance-entries',
          },
        },
      ],
    },
    {
      title: 'Inventory',
      permission: 'createInventory',
      htmlBefore:
        '<i class="bx bx-add-to-queue" style="font-size: 1.1rem"></i>',
      items: [
        {
          title: 'Chamber',
          permission: 'createInventory',
          htmlBefore: '<i class="bx bx-adjust" style="font-size: 1.1rem"></i>',
          to: {
            name: 'inventory-chamber',
          },
        },
        {
          title: 'Floor',
          permission: 'createInventory',
          htmlBefore: '<i class="bx bx-area" style="font-size: 1.1rem"></i>',
          to: {
            name: 'inventory-floor',
          },
        },
        {
          title: 'Comparment',
          permission: 'createInventory',
          htmlBefore:
            '<i class="bx bx-align-justify" style="font-size: 1.1rem"></i>',
          to: {
            name: 'inventory-compartment',
          },
        },
      ],
    },
    // {
    //   title: 'Changing Information',
    //   permission: 'createChangingInformationEntry',
    //   htmlBefore: '<i class="bx bx-repeat" style="font-size: 1.2rem"></i>',
    //   to: {
    //     name: 'changinginformation',
    //   },
    // },
    {
      title: 'Reports',
      permission: 'generateReport',
      htmlBefore: '<i class="bx bx-bar-chart" style="font-size: 1.2rem"></i>',
      to: {
        name: 'reports',
      },
    },
    {
      title: 'settings',
      permission: 'settings',
      htmlBefore: '<i class="bx bx-edit" style="font-size: 1.2rem"></i>',
      to: {
        name: 'settings',
      },
    },

    // {
    //   title: 'Errors',
    //   htmlBefore: '<i class="material-icons">error</i>',
    //   to: {
    //     name: 'errors',
    //   },
    // }
  ]
}
