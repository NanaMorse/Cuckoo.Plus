import Vue from 'vue'

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
