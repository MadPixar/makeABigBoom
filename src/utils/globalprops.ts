import dayjs from 'dayjs'
const quarterOfYear = require('dayjs/plugin/quarterOfYear')
dayjs.extend(quarterOfYear)
// 以下定义一些逻辑全局变量
export interface IglobalProp {
  yyMMddhhmmss: string
  yyMMdd: string
  yyMMddhhmm: string
  pageSizes: number[]
  pageSize: number
  nameWidth: number
  dateWidth: number
  yearWidth: number
  sortWidth: number
  retryNum: number
  treePlaceholder: string
  maxDeviceWidth: number
  datePickerOptions: object
}
const pageSizes: number[] = [15, 20, 30, 50]
export const globalProps: IglobalProp = {
  // 以下定义日期格式
  yyMMddhhmmss: 'yy-MM-dd hh:mm:ss',
  yyMMdd: 'yy-MM-dd',
  yyMMddhhmm: 'yy-MM-dd hh:mm',
  pageSizes: pageSizes,
  pageSize: pageSizes[0],
  nameWidth: 100,
  dateWidth: 100,
  yearWidth: 100,
  sortWidth: 100,
  retryNum: 0,
  treePlaceholder: `请输入中文、'py'或'pinyin'`,
  maxDeviceWidth: 1025,
  datePickerOptions: {
    shortcuts: [
      {
        text: '本周',
        onClick(picker: any) {
          const end = dayjs()
            .endOf('week')
            .add(1, 'day')
          const start = dayjs()
            .startOf('week')
            .add(1, 'day')
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '本月',
        onClick(picker: any) {
          const end = dayjs().endOf('month')
          const start = dayjs().startOf('month')
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '本季度',
        onClick(picker: any) {
          const end = dayjs().endOf('quarter' as any)
          const start = dayjs().startOf('quarter' as any)
          picker.$emit('pick', [start, end])
        }
      },

      {
        text: '本年',
        onClick(picker: any) {
          const end = dayjs().endOf('year')
          const start = dayjs().startOf('year')
          picker.$emit('pick', [start, end])
        }
      }
    ]
  }
}
// 删除确认框文案全局配置
export const deleteTipText = (text?: string) => {
  return `确定要删除『${text}』吗？`
}
