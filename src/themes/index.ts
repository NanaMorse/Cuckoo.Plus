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

const themeManager = new ThemeManager();

(window as any).themeManager = themeManager;

export default themeManager

// let themes = {
//   dark
//   },
//
//   getThemeStyle = () => {
//     const themeId = 'muse-theme'
//     let styleEl = document.getElementById(themeId)
//     if (styleEl) return styleEl
//     styleEl = document.createElement('style')
//     styleEl.id = themeId
//     document.body.appendChild(styleEl)
//     return styleEl
//   };
//
// export default (theme) => {
//   let $html = document.querySelector("html");
//   $html.classList.toggle("dark",theme == "dark");
//   $html.classList.toggle( "sidebar-light",theme != "dark");
//   const styleEl = getThemeStyle()
//   styleEl.innerHTML = themes[theme] || ''
// }
