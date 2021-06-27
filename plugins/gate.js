const pupilPermissions = ['viewClass', 'justPupil']
const teacherPermissions = [
  'viewClass',
  'addPupil',
  'createSubject',
  'modifyTests',
  'createClass',
  'justTeacher',
]
const adminPermissions = [
  'createClass',
  'justAdmin',
  'CreateUser',
  ...teacherPermissions,
]

const superAdminPermission = ['createAdmin', ...adminPermissions]
const permissions = {
  super_admin: superAdminPermission,
  admin: adminPermissions,
  teacher: teacherPermissions,
  pupil: pupilPermissions,
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
