import Vue from 'vue'
import * as Masonry from 'masonry-layout'
import ResizeObserver from 'resize-observer-polyfill'
import * as _ from 'underscore'
import { UiWidthCheckConstants } from '@/constant'

{

  const createDragOverLayer = (vNode) => {
    const layer = document.createElement('div')
    layer.className = 'mu-loading-wrap drag-over-layer'

    const component = vNode.componentInstance
    layer.innerText = component.$t(component.$i18nTags.common.drag_and_drop_to_upload)

    return layer
  }

  Vue.directive('drag-over', {
    update (el: HTMLDivElement, binding, vNode) {
      if (binding.value === binding.oldValue) return

      if (binding.value === false) {
        return el.removeChild(el.querySelector('.drag-over-layer'))
      }

      // todo use singleton, but there is some little bug
      el.appendChild(createDragOverLayer(vNode))
    }
  } as any)

}

{
  interface MasonryItem {
    element: HTMLDivElement
    position: { x: number, y: number }
  }

  interface MasonryContainer extends HTMLDivElement {
    $masonryEl: {
      size: { width: number, height: number }
      layout()
      addItems(el)
      reloadItems()
      layoutItems(masonryItemList: Array<MasonryItem>)
      items: Array<MasonryItem>
    }
  }

  const reLayoutMasonry = _.throttle(($masonryEl) => {
    $masonryEl.layout()

    $masonryEl.items.forEach((item: MasonryItem) => {
      item.element.style.animation = 'fadein 1s';
      item.element.style.opacity = '1'
    })}, 200)

  Vue.directive('masonry-container', {

    inserted (el: MasonryContainer) {

      el.$masonryEl = new Masonry(el, {
        itemSelector: '.status-card-container',
        transitionDuration: 0,
        gutter: UiWidthCheckConstants.TIMELINE_WATER_FALL_GUTTER,
        initLayout: false
      })

    },

    update: (el: MasonryContainer) => {
      if (!el.parentElement || (el.parentElement.style.display === 'none')) return

      const $masonryEl = el.$masonryEl

      setTimeout(() => {
        const oldItemLength = $masonryEl.items.length
        $masonryEl.reloadItems()

        const hasItemsLengthChanged = oldItemLength !== $masonryEl.items.length
        const IsSomeItemHided = $masonryEl.items.some(item => item.element.style.opacity === '0')

        if (!hasItemsLengthChanged && !IsSomeItemHided) return

        reLayoutMasonry($masonryEl)
      })
    }

  } as any)

  const onMasonryItemSizeChanged = _.throttle(($masonryEl) => {
    $masonryEl.layout()
  }, 200)

  const ro = new ResizeObserver((entries) => {
    const targetMasonryContainer = entries[0].target.parentNode as MasonryContainer

    if (!targetMasonryContainer || !targetMasonryContainer.$masonryEl) return

    // todo optimize
    return onMasonryItemSizeChanged(targetMasonryContainer.$masonryEl)
  })

  Vue.directive('masonry-item', {

    inserted (el: HTMLDivElement) {
      el.style.opacity = '0'

      ro.observe(el)
    }

  } as any)
}
