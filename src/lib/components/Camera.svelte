<script>
  import { T, useFrame, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'

  export let x = 0
  export let y = 0
  export let z = 0

  export let lockDistance = false

  let controls
  let lastDistance
</script>

<T.PerspectiveCamera
  makeDefault
  fov={60}
>
  <OrbitControls
    bind:ref={controls}
    enableZoom={true}
    enablePan={false}
    enableDamping={true}
    dampingFactor={0.03}
    target.x={x}
    target.y={y}
    target.z={z}
    maxDistance={lockDistance && lastDistance ? lastDistance : 7}
    minDistance={lockDistance && lastDistance ? lastDistance : 0.5}
    on:change={() => lastDistance = controls.getDistance()}
  />
</T.PerspectiveCamera>
