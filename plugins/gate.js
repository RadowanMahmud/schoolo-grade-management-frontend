const storeManagerPermissions = [
  'viewBooking',
  'viewClient',
  'createPotatoStoreReceipt',
  'createGatepass',
  'createLoading',
  'createMachinepart',
  'createMachinepartEntry',
  'createChangingInformationEntry',
  'createInventory',
]
const accountManagerPermissions = [
  'createBooking',
  'createDelivery',
  'createReceive',
  'createLoandisbursement',
  'createLoancollection',
  'createSalary',
  'createEmployeeLoan',
  'createExpense',
  'createDailyexpense',
  'createBank',
  'createBankdeposit',
  'generateReport',
  ...storeManagerPermissions,
]
const adminManagerPermissions = [
  'createAccountmanager',
  'createStoremanager',
  'createClient',
  'createWorker',
  'settings',
  ...accountManagerPermissions,
]
const adminPermissions = [
  'createAdminmanager',
  'updateBagNo',
  ...adminManagerPermissions,
]
const superAdminPermission = ['createAdmin', ...adminPermissions]
const permissions = {
  super_admin: superAdminPermission,
  admin: adminPermissions,
  manager_admin: adminManagerPermissions,
  manager_account: accountManagerPermissions,
  manager_store: storeManagerPermissions,
  worker: [],
}
export default (context, inject) => {
  const checkIfUserHasPermission = function (permission) {
    return context.store.state.user
      ? permissions[context.store.state.user.roles[0].name].includes(permission)
      : false
  }

  inject('hasPermission', checkIfUserHasPermission)
  context.$hasPermission = checkIfUserHasPermission
}
