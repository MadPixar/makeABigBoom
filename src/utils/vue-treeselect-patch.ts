export class VueTreeselectPatch {
  originFn: any
  constructor(content: any, refName: string) {
    this.originFn = content.$refs[refName].handleLocalSearch
    content.$refs[refName].handleLocalSearch = function() {}
    content.$refs[refName].$watch('trigger.searchQuery', (newValue: any) => {
      if (!newValue) this.originFn()
    })
  }
  search() {
    this.originFn()
  }
}
