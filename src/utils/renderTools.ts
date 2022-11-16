export const brightenKeyword = (val: any, keyword: any) => {
  const Reg = new RegExp(keyword, 'i')
  if (val && keyword) {
    return val.replace(Reg, `<span style="color: red;">${keyword}</span>`)
  } else if (!val) {
    return ''
  } else if (!keyword) {
    return val
  }
}
