const getDevelopStatusFlag = 'DevelopStatus'
export const getDevelopStatus = () => (localStorage.getItem(getDevelopStatusFlag) || '') === 'true'
export const setDevelopStatus = (val: string) => localStorage.setItem(getDevelopStatusFlag, val)
export const removeDevelopStatus = () => localStorage.removeItem(getDevelopStatusFlag)
