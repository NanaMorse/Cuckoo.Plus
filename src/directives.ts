import Vue from 'vue'
import * as Masonry from 'masonry-layout'
import ResizeObserver from 'resize-observer-polyfill'

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

  Vue.directive('masonry-container', {

    inserted (el: MasonryContainer) {
      el.$masonryEl = new Masonry(el, {
        itemSelector: '.status-card-container',
        transitionDuration: 0,
         gutter: 20,
        initLayout: false,
        fitWidth: true
      })
    },

    update (el: MasonryContainer) {
      // todo optimize
      el.$masonryEl.reloadItems()
    }

  } as any)

  const ro = new ResizeObserver((entries) => {
    const targetMasonryContainer = entries[0].target.parentNode as MasonryContainer

    if (!targetMasonryContainer || !targetMasonryContainer.$masonryEl) return

    // todo optimize
    return targetMasonryContainer.$masonryEl.layout()
  })

  Vue.directive('masonry-item', {

    inserted (el) {
      ro.observe(el);
    }

  } as any)
}
