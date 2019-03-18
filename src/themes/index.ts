// @ts-ignore
import * as GooglePlusTheme from '!raw-loader!less-loader!../assets/themes/google-plus.less'
// @ts-ignore
import * as DarkTheme from '!raw-loader!less-loader!../assets/themes/dark.less'

import { ThemeNames } from '@/constant'

class ThemeManager {

  private themeMap = {
    [ThemeNames.GOOGLE_PLUS]: GooglePlusTheme,
    [ThemeNames.DARK]: DarkTheme
  }

  private themeToFavIconSourceMap = {
    [ThemeNames.GOOGLE_PLUS]: 'google_plus',
    [ThemeNames.DARK]: 'dark'
  }

  private themeToThemeColor = {
    [ThemeNames.GOOGLE_PLUS]: '#db4437',
    [ThemeNames.DARK]: '#1976d2'
  }

  private getThemeStyleElem (): HTMLStyleElement {
    const themeElemId = 'cuckoo-plus-theme'
    let styleElem = document.getElementById(themeElemId)

    if (styleElem) return styleElem as HTMLStyleElement

    styleElem = document.createElement('style')
    styleElem.id = themeElemId
    document.body.appendChild(styleElem)

    return styleElem as HTMLStyleElement
  }

  private setFavIconByThemeName (themeName: string) {
    Array.from(document.head.querySelectorAll('link')).forEach(el => {
      if (el.getAttribute('rel') === 'icon') {
        const size = el.getAttribute('sizes')
        if (size) {
          el.setAttribute('href', `favicon/${this.themeToFavIconSourceMap[themeName]}/favicon-${size}.png`)
        }
      }
    })
  }

  private setThemeColorByThemeName (themeName: string) {
    Array.from(document.head.querySelectorAll('meta')).find(el => {
      return el.getAttribute('name') === 'theme-color'
    }).setAttribute('content', this.themeToThemeColor[themeName])
  }

  public setTheme (themeName: string) {
    this.getThemeStyleElem().innerHTML = this.themeMap[themeName] || ''

    this.setFavIconByThemeName(themeName)
    this.setThemeColorByThemeName(themeName)
  }
}

export default new ThemeManager()
