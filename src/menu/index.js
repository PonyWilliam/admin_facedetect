import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '管理类',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '员工管理' },
      { path: '/page2', title: '分类管理' },
      { path: '/page3', title: '库房管理' },
      { path: '/page4', title: '产品管理' },
    ]
  },
  {
    title: '数据类',
    icon: 'folder-o',
    children: [
      { path: '/data1', title:'租借数据监控'},
      { path: '/data2', title:'转借数据监控'}
    ]
  }
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '管理类',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '员工管理' },
      { path: '/page2', title: '分类管理' },
      { path: '/page3', title: '库房管理' },
      { path: '/page4', title: '产品管理' },
    ]
  },
  {
    title: '数据类',
    icon: 'folder-o',
    children: [
      { path: '/data1', title:'租借数据监控'},
      { path: '/data2', title:'转借数据监控'}
    ]
  }
])
