<script>
  import { onMount } from 'svelte';
  import { T, useFrame, useThrelte } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { sineInOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  export let x = 0
  export let y = 0
  export let z = 0

  const targetX = tweened(x + 0.0001, { duration: 1000, easing: sineInOut })
  const targetY = tweened(y + 0.0001, { duration: 1000, easing: sineInOut })
  const targetZ = tweened(z + 0.0001, { duration: 1000, easing: sineInOut })
  let animating = false
  let lastDistance = 1000
  let controls

  $: {
    if (controls) {
      animating = true
      lastDistance = controls.getDistance()
    }

    targetX.set(x)
    targetY.set(y)
    targetZ.set(z).then(() => animating = false)
  }

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
    target.x={$targetX}
    target.y={$targetY}
    target.z={$targetZ}
    maxDistance={animating ? lastDistance : 5}
    minDistance={0.5}
  />
</T.PerspectiveCamera>
