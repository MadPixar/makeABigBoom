export enum opBoxEnum {
  CHAXUN = 1,
  ZAIBAN,
  YUBAN,
  YIBAN,
  BANJIE,
  DUBAN,
  KEDUBAN,//可督办箱
  ZFZAIBAN,//执法在办箱
  ZFYIBAN,//执法已办箱
  HUIQIAN,
  ZUOFEI
}
export enum opBoxTypeEnum {
  CHAXUN = 1,
  ZAIBAN,
  YUBAN,
  YIBAN,
  BANJIE,
  DUBAN,
  HUIQIAN,
  ZUOFEI
}
export enum opStatusEnum {
  ALL = 0,
  GREEN,
  YELLOW,
  RED
}
export enum processBoxEnum {
  CHAXUN = 1,
  ZAIBAN,
  YUBAN,
  YIBAN,
  BANJIE,
  DUBAN,
  HUIQIAN,
  ZUOFEI,
  SUOYOU
}
export enum fldDataTypeEnum {
  VARCHAR = 1,
  INT,
  NUMBERIC,
  BOOLEAN,
  DATE,
  DATETIME,
  TIME,
  TEXT,
  IMAGE
}
export enum logicEnum {
  OR,
  AND
}
export enum infoLinkTypeEnum {
  UNKNOWN = 0,
  MEETING,
  DOC,
  ARCHIVE,
  PROJECT,
  OP,
  PROCESS
}

export enum infoLinkStatusEnum {
  NORMAL = 0,
  DOUBTED,
  CHECKED
}

export const conditionMap = [
  {
    label: '大于',
    value: 1,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '小于',
    value: 2,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '大于等于',
    value: 3,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '小于等于',
    value: 4,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '等于',
    value: 5,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '不等于',
    value: 6,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '为空',
    value: 7,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '不为空',
    value: 8,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  },
  {
    label: '包含',
    value: 9,
    fldDataType: [
      fldDataTypeEnum.VARCHAR,
      fldDataTypeEnum.INT,
      fldDataTypeEnum.NUMBERIC,
      fldDataTypeEnum.BOOLEAN,
      fldDataTypeEnum.DATE,
      fldDataTypeEnum.DATETIME,
      fldDataTypeEnum.TIME,
      fldDataTypeEnum.TEXT,
      fldDataTypeEnum.IMAGE
    ]
  }
]

export interface IModel {
  value: { [props: string]: any }
  model: string
  [props: string]: any
}
