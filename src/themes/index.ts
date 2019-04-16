// @ts-ignore
import cuckooHubTheme from '@/assets/themes/cuckoohub'
import greenLightTheme from '@/assets/themes/greenlight'
import darkTheme from '@/assets/themes/dark'
import googlePlusTheme from '@/assets/themes/googleplus'
import * as less from 'less'

import { ThemeNames } from '@/constant'

class ThemeManager {

  private themeInfo = {
    [ThemeNames.GOOGLE_PLUS]: {
      theme: googlePlusTheme,
      css: null,
    },
    [ThemeNames.DARK]: {
      theme: darkTheme,
      css: null,
    },
    [ThemeNames.GREEN_LIGHT]: {
      theme: greenLightTheme,
      css: null
    },
    [ThemeNames.CUCKOO_HUB]: {
      theme: cuckooHubTheme,
      css: null
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
          el.setAttribute('href', `favicon/${this.themeInfo[themeName].theme.toFavIconPath}/${size}.png`)
        }
      }
    })
  }

  private setThemeColorByThemeName (themeName: string) {
    Array.from(document.head.querySelectorAll('meta')).find(el => {
      return el.getAttribute('name') === 'theme-color'
    }).setAttribute('content', this.themeInfo[themeName].theme.colorSet['@primaryColor'])
  }

  public setTheme (themeName: string) {
    if (this.themeInfo[themeName].css) {
      this.getThemeStyleElem().innerHTML = this.themeInfo[themeName].css
    } else {
      less.render(this.themeInfo[themeName].theme.source || '').then(output => {
        this.getThemeStyleElem().innerHTML = output.css
        this.themeInfo[themeName].css = output.css
      })
    }

    this.setFavIconByThemeName(themeName)
    this.setThemeColorByThemeName(themeName)
  }
}

export default new ThemeManager()
