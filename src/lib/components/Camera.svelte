<script>
  import { Vector3 } from 'three'
  import { onMount } from 'svelte'
  import { T, useFrame, useThrelte } from '@threlte/core'
  import CameraControls from './CameraControls.svelte'

  export let target = new Vector3()
  $: controls = null

  const startPosition = new Vector3()
  const currentTarget = new Vector3()

  $: {
    if (controls) {
      controls.setOrbitPoint(0, 0, 0)
    }
  }

  $: {
    if (controls) {
      controls.moveTo(target.x, target.y, target.z, true)
      controls.rotate((Math.random() - 0.5) * Math.PI / 2, (Math.random() - 0.5) * Math.PI / 2, true)
    }
  }

</script>

<T.PerspectiveCamera
  makeDefault
  fov={60}
>
  <CameraControls
    bind:ref={controls}
    enableZoom={true}
    enablePan={false}
    enableDamping={true}
    smoothTime={0.4}
    maxDistance={5}
    minDistance={0.5}
    restThreshold={0.00025}
  />
</T.PerspectiveCamera>
