<script lang="ts">
  import * as THREE from 'three'
  import { forwardEventHandlers, T, useFrame, useParent, useThrelte } from '@threlte/core'
  import CameraControls from 'camera-controls'

  const parent = useParent()
  if (!$parent.isCamera) {
    throw new Error('Parent missing: <CameraControls> need to be a child of a <Camera>')
  }

  const { renderer, invalidate } = useThrelte()

  CameraControls.install( { THREE: THREE } )

  export const ref = new CameraControls($parent, renderer.domElement)

  const clock = new THREE.Clock()
  const { start, stop } = useFrame(() => {
    const delta = clock.getDelta()
    ref.update(delta)
  })

  $: {
    start()
  }

  const component = forwardEventHandlers()
</script>

<T
  is={ref}
  let:ref
  {...$$restProps}
  bind:this={$component}
  on:change={invalidate}
>
  <slot {ref} />
</T>
