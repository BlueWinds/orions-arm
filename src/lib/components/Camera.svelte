<script>
  import { T, useFrame, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { Vector3, Vector4 } from 'three'

  export let x = 0
  export let y = 0
  export let z = 0

  export let lockDistance = false

  const cameraOffset = new Vector3(0, 0.205, -0.75)

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
    target.x={x + cameraOffset.x}
    target.y={y + cameraOffset.y}
    target.z={z + cameraOffset.z}
    maxDistance={lockDistance && lastDistance ? lastDistance : 4}
    minDistance={lockDistance && lastDistance ? lastDistance : 0.5}
    on:change={() => lastDistance = controls.getDistance()}
  />
</T.PerspectiveCamera>
