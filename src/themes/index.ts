// @ts-ignore
import cuckooHubTheme from './presets/cuckoohub'
import greenLightTheme from './presets/greenlight'
import darkTheme from './presets/dark'
import googlePlusTheme from './presets/googleplus'
import * as less from 'less'
import stylePattern from './stylepattern'
import { ThemeNames } from '@/constant'
import * as fileSaver from 'file-saver'

const presetThemeInfo = {
  [ThemeNames.GOOGLE_PLUS]: {
    theme: googlePlusTheme,
    less: stylePattern(googlePlusTheme.colorSet),
    css: null,
  },
  [ThemeNames.DARK]: {
    theme: darkTheme,
    less: stylePattern(darkTheme.colorSet),
    css: null,
  },
  [ThemeNames.GREEN_LIGHT]: {
    theme: greenLightTheme,
    less: stylePattern(greenLightTheme.colorSet),
    css: null
  },
  [ThemeNames.CUCKOO_HUB]: {
    theme: cuckooHubTheme,
    less: stylePattern(cuckooHubTheme.colorSet),
    css: null
  }
}

class ThemeManager {

  private get themeInfo () {
    return Object.assign({}, presetThemeInfo, this.customThemeInfo)
  }

  private customThemeInfo = localStorage.getItem('customThemeInfo') ? JSON.parse(localStorage.getItem('customThemeInfo')) : {}

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

  private setThemeCssByThemeName (themeName: string) {
    if (!this.themeInfo[themeName].less) {
      this.themeInfo[themeName].less = stylePattern(this.themeInfo[themeName].theme.colorSet)
    }

    if (this.themeInfo[themeName].css) {
      this.getThemeStyleElem().innerHTML = this.themeInfo[themeName].css
    } else {
      less.render(this.themeInfo[themeName].less).then(output => {
        this.getThemeStyleElem().innerHTML = output.css
        this.themeInfo[themeName].css = output.css
      })
    }
  }

  private updateCustomThemeInfo (themeColorSet, themeName) {
    this.customThemeInfo[themeName] = {
      theme: { colorSet: themeColorSet, toFavIconPath: 'google_plus' },
      less: stylePattern(themeColorSet),
      css: null
    }
    localStorage.setItem('customThemeInfo', JSON.stringify(this.customThemeInfo))
  }

  public getThemeOptionsList () {
    return Object.keys(this.themeInfo)
      .filter(themeName => typeof this.themeInfo[themeName] === 'object')
      .map(themeName => { return { 'value': themeName } })
  }

  public setTheme (themeName: string) {
    if (!this.themeInfo[themeName]) {
      themeName = ThemeNames.GOOGLE_PLUS
    }
    this.setThemeCssByThemeName(themeName)
    this.setFavIconByThemeName(themeName)
    this.setThemeColorByThemeName(themeName)
  }

  public exportTheme (themeName: string) {
    const blob = new Blob([JSON.stringify(this.themeInfo[themeName].theme.colorSet)], {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(blob, `${themeName}.json`);
  }

  public importTheme (themeColorSet, themeName: string) {
    this.updateCustomThemeInfo(themeColorSet, themeName)
  }
}

export default new ThemeManager()
