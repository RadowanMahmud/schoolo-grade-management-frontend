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
      title: 'Class',
      // permission: 'createClass',
      permission: null,
      htmlBefore:
        '<i class="bx bxs-book-content" style="font-size: 1.2rem"></i>',
      to: {
        name: 'class',
      },
    },
    // {
    //   title: 'Subject',
    //   permission: 'createSubject',
    //   htmlBefore: '<i class="bx bx-user"></i>',
    //   to: {
    //     name: 'subject',
    //   },
    // },

    {
      title: 'Users',
      permission: 'CreateUser',
      htmlBefore:
        '<i class="bx bx-message-square-detail" style="font-size: 1.2rem"></i>',
      to: {
        name: 'users',
      },
      // items: [
      //   {
      //     title: 'Pupil',
      //     permission: 'CreateUser',
      //     htmlBefore: '<i class="bx bx-money" style="font-size: 1.1rem"></i>',
      //     to: {
      //       name: 'subject',
      //     },
      //   },
      //   {
      //     title: 'Teacher',
      //     permission: 'CreateUser',
      //     htmlBefore:
      //       '<i class="bx bx-dollar-circle" style="font-size: 1.1rem"></i>',
      //     to: {
      //       name: 'subject',
      //     },
      //   },
      //   {
      //     title: 'Admin',
      //     permission: 'CreateUser',
      //     htmlBefore:
      //       '<i class="bx bx-dollar-circle" style="font-size: 1.1rem"></i>',
      //     to: {
      //       name: 'subject',
      //     },
      //   },
      // ],
    },
    {
      title: 'Message',
      htmlBefore: '<i class="bx bx-bar-chart" style="font-size: 1.2rem"></i>',
      //  htmlBefore: '<i class="bx bxs-book-content" style="font-size: 1.2rem"></i>',
      to: {
        name: 'messages',
      },
    },
  ]
}
