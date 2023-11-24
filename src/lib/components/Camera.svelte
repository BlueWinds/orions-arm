<script>
  import { Vector3 } from 'three'
  import { onMount } from 'svelte'
  import { T, useFrame, useThrelte } from '@threlte/core'
  import CameraControls from './CameraControls.svelte'

  export let target = new Vector3()
  $: controls = null

  $: {
    if (controls) {
      controls.moveTo(target.x, target.y, target.z, true)
      controls.rotate((Math.random() - 0.5) * Math.PI / 2, (Math.random() - 0.5) * Math.PI / 2, true)
    }
  }

  onMount(() => {
    controls.setOrbitPoint(0, 0, 0)
  })
</script>

<T.PerspectiveCamera
  makeDefault
  fov={30}
  near={0.00001}
>
  <CameraControls
    bind:ref={controls}
    enableZoom={true}
    enablePan={false}
    enableDamping={true}
    smoothTime={0.4}
    maxDistance={0.25}
    minDistance={0.005}
    restThreshold={0.00025}
  />
</T.PerspectiveCamera>
