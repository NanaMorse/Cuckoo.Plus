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

  private getThemeStyleElem (): HTMLStyleElement {
    const themeElemId = 'cuckoo-plus-theme'
    let styleElem = document.getElementById(themeElemId)

    if (styleElem) return styleElem as HTMLStyleElement

    styleElem = document.createElement('style')
    styleElem.id = themeElemId
    document.body.appendChild(styleElem)

    return styleElem as HTMLStyleElement
  }

  public setTheme (themeName: string) {
    this.getThemeStyleElem().innerHTML = this.themeMap[themeName] || ''
  }
}

export default new ThemeManager()
