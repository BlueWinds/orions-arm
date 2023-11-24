<script>
  import { T } from '@threlte/core'

  export let star
</script>

<T.Group
  position={star.position.toArray()}
  rotation={star.orbitalPlane.toArray()}
  {...$$restProps}
>
  {#each star.planets as planet}
    <T.Mesh>
      <T.TorusGeometry args={[planet.orbit / 1000, planet.orbit ** 0.5 * 0.000002, 8, 128]} />
      <T.MeshBasicMaterial color="white" />
    </T.Mesh>

  {/each}
</T.Group>

