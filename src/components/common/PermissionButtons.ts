import { RoleButton } from '@/store/types'
import { NButton, NSpace } from 'naive-ui'
import { defineComponent, h, PropType } from 'vue'

export default defineComponent({
  name: 'PermissionButtons',
  props: {
    buttons: {
      type: Array as PropType<Array<RoleButton>>,
      default: () => [],
    },
  },
  emits: ['click'],
  render() {
    return h(NSpace, null, {
      default: () => {
        return this.buttons.map((it) => {
          return h(
            NButton,
            {
              secondary: true,
              size: 'small',
              round: true,
              type: it.type,
              onClick: () => {
                this.$emit('click', it.code)
              },
            },
            {
              default: () => it.name,
            }
          )
        })
      },
    })
  },
})
