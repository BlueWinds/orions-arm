<script>
  import { tick } from 'svelte'
  import { useRender, useThrelte } from '@threlte/core'
  import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'

  const element = document.querySelector('#css-renderer-target')

  const cssRenderer = new CSS2DRenderer({ element })

  const { size } = useThrelte()
  $: cssRenderer.setSize($size.width, $size.height)

  useRender(async (ctx) => {
    await tick()
    ctx.renderer?.render(ctx.scene, ctx.camera.current)
    cssRenderer.render(ctx.scene, ctx.camera.current)
  })
</script>

<div />
