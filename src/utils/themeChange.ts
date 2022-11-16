/**
 * 全局更改element的方法
 */
import { toolsFunc } from '@/utils/tools'
import { SettingsModule } from '@/store/modules/settings'
const ORIGINAL_THEME = '#1491ED' // default color
const { openLoading, closeLoading } = toolsFunc
const chalk = ''
const theme = SettingsModule.primaryColor

const updateStyle = (style: string, oldCluster: string[], newCluster: string[]) => {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}

const getCSSString = (url: string, variable: string) => {
  const res = new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        variable = xhr.responseText.replace(/@font-face{[^}]+}/, '')
        resolve(variable)
      }
    }
    xhr.open('GET', url, true)
    xhr.send()
  })
  return res
}

const getThemeCluster = (theme: string) => {
  const tintColor = (color: string, tint: number) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)
    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))
      return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
    }
  }

  const shadeColor = (color: string, shade: number) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)
    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`
  }

  const clusters = [theme]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}

export const changeTheme = async (color: string) => {
  openLoading()
  const oldValue = chalk ? theme : ORIGINAL_THEME
  const themeCluster = getThemeCluster(color.replace('#', ''))
  // const originalCluster = getThemeCluster(oldValue.replace('#', ''))
  let variable = ''
  if (!chalk) {
    const url = `/static/element-theme/index.css`
    variable = (await getCSSString(url, 'chalk')) as string
  }
  const getHandler = (test: string, id: string) => {
    return () => {
      const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
      const newStyle = updateStyle(variable, originalCluster, themeCluster)
      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    }
  }
  const chalkHandler = getHandler('chalk', 'chalk-style')
  chalkHandler()

  let styles: HTMLElement[] = [].slice.call(document.querySelectorAll('style'))
  styles = styles.filter(style => {
    const text = style.innerText
    return new RegExp(oldValue, 'i').test(text) && !/Chalk Variables/.test(text)
  })
  styles.forEach(style => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    // style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
  closeLoading()
}
