// @ts-ignore
import * as GooglePlusTheme from '!raw-loader!less-loader!../assets/themes/google-plus.less'
// @ts-ignore
import * as DarkTheme from '!raw-loader!less-loader!../assets/themes/dark.less'
// @ts-ignore
import * as GreenLightTheme from '!raw-loader!less-loader!../assets/themes/green-light.less'
// @ts-ignore
import * as CuckooHubTheme from '!raw-loader!less-loader!../assets/themes/cuckoo-hub.less'

import { ThemeNames } from '@/constant'

class ThemeManager {

  private themeInfo = {
    [ThemeNames.GOOGLE_PLUS]: {
      source: GooglePlusTheme,
      toFavIconPath: 'google_plus',
      color: '#db4437'
    },
    [ThemeNames.DARK]: {
      source: DarkTheme,
      toFavIconPath: 'dark',
      color: '#1976d2'
    },
    [ThemeNames.GREEN_LIGHT]: {
      source: GreenLightTheme,
      toFavIconPath: 'green_light',
      color: '#0f9d58'
    },
    [ThemeNames.CUCKOO_HUB]: {
      source: CuckooHubTheme,
      toFavIconPath: 'cuckoo_hub',
      color: '#FF9900'
    }
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
          el.setAttribute('href', `favicon/${this.themeInfo[themeName].toFavIconPath}/${size}.png`)
        }
      }
    })
  }

  private setThemeColorByThemeName (themeName: string) {
    Array.from(document.head.querySelectorAll('meta')).find(el => {
      return el.getAttribute('name') === 'theme-color'
    }).setAttribute('content', this.themeInfo[themeName].color)
  }

  public setTheme (themeName: string) {
    this.getThemeStyleElem().innerHTML = this.themeInfo[themeName].source || ''

    this.setFavIconByThemeName(themeName)
    this.setThemeColorByThemeName(themeName)
  }
}

export default new ThemeManager()
