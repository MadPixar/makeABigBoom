export default {
  op: {
    page_ext: [
      {
        systemCode: 'guihua',
        systemName: '规划',
        mode: 'op',
        route: '',
        area: [
          { top: { name: 'top', route: 'op/views/handle/components/top/default-top' } },
          {
            content: [
              {
                name: '图形',
                route: 'op/views/handle/components/content/map/OpMap'
              }
            ]
          }
        ]
      },
      {
        systemCode: 'tudi',
        systemName: '土地',
        mode: 'op',
        route: '',
        area: [
          { top: { name: 'top', route: 'op/views/handle/components/top/default-top' } },
          {
            content: [
              {
                name: '图形',
                route: 'op/views/handle/components/content/map/OpMap'
              }
            ]
          }
        ]
      },
      {
        systemCode: 'cediao',
        systemName: '测调',
        mode: 'standalone',
        route: '/op/handle/details',
        area: []
      },
      {
        systemCode: 'zichan',
        systemName: '资产',
        mode: '',
        route: '/op/handle/details',
        area: [
          { top: { name: 'top', route: 'zichan/components/detailTop' } },
          {
            content: [
              {
                name: '基础信息表',
                route: 'zichan/views/handle/components/content/registrationInfoForm'
              },
              {
                name: '登记审核',
                route: 'zichan/views/handle/components/content/registerAudit'
              }
            ]
          }
        ]
      },
      {
        systemCode: 'dikuang',
        systemName: '地矿',
        mode: '',
        route: '',
        area: [
          { top: { name: 'top', route: 'op/views/handle/components/top/default-top' } },
          {
            content: [
              {
                name: '图形',
                route: 'op/views/handle/components/content/map/OpMap'
              }
            ]
          }
        ]
      },
      {
        systemCode: 'zhifa',
        systemName: '执法',
        mode: '',
        route: '/op/handle/details',
        // area: []
        area: [
          { top: { name: 'top', route: 'op/views/handle/components/top/default-top' } },
          {
            content: [
              {
                name: '图形浏览',
                route: 'zhifa-new/onemap/components/PositionMap/index'
              }
            ]
          }
        ]
      },
      {
        systemCode: 'xiangmu',
        systemName: 'xiangmu',
        mode: '',
        route: '/op/handle/details',
        area: [
          { top: { name: 'top', route: 'op/views/handle/components/top/default-top' } },
          {
            content: [
              {
                name: '图形',
                route: 'op/views/handle/components/content/map/OpMap'
              }
            ]
          }
        ]
      }
    ]
  }
}
