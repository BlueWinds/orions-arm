<script>
  import { T, useLoader, useFrame } from '@threlte/core'
  import { Environment, interactivity, useCursor } from '@threlte/extras'
  import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Vector3, TextureLoader } from 'three'
  import { cubicInOut } from 'svelte/easing'
  import { fade } from 'svelte/transition'

  import { base } from '$app/paths'
  import Camera from './Camera.svelte'
  import CssObject from './CssObject.svelte'
  import PlanetarySystem from './PlanetarySystem.svelte'
  import randomGalaxy from '$lib/stars'
  import fragmentShader from './fragment.glsl?raw'
  import vertexShader from './vertex.glsl?raw'

  interactivity()

  const { onPointerEnter, onPointerLeave } = useCursor('pointer', 'auto')

  const starCount = parseInt((location.search.match(/stars=(\d+)/) || [, 10000])[1], 10)

  const stellarDensity = 0.004 // stars per cubic LY
  const boxSize = Math.pow(starCount * stellarDensity, 1/3)

  const stars = randomGalaxy(boxSize, starCount)

  const positions = new Float32Array( starCount * 3 )
  const colors = new Float32Array( starCount * 3 )
  const sizes = new Float32Array( starCount )

  stars.forEach((star, i) => {
    star.position.toArray(positions, i * 3)
    star.color.toArray(colors, i * 3)
    sizes[i] = star.luminosity
  })

  const focusShrink = 10

  sizes[0] /= focusShrink

  const pointsBufferGeometry = new BufferGeometry()

  pointsBufferGeometry.setAttribute('position', new BufferAttribute( positions, 3 ));
  pointsBufferGeometry.setAttribute('customColor', new BufferAttribute( colors, 3 ));
  pointsBufferGeometry.setAttribute('size', new BufferAttribute( sizes, 1 ));

  let focusIndex = 0
  $: cameraTarget = stars[focusIndex].position
  let hoverIndex, sizeTransitions = {}, focusTransitions = {0: 1 / focusShrink}, labels = {}

  const hoverAnimationSpan = 0.5
  const focusAnimationSpan = 0.2
  useFrame(
    ({ invalidate }, delta) => {
      if (Object.keys(sizeTransitions).length) {
        const sizeAttr = pointsBufferGeometry.attributes.size

        for (let index in focusTransitions) {
          if (focusIndex == index) {
            // Easing smaller, because focused
            if (focusTransitions[index] > 1 / focusShrink) {
              focusTransitions[index] = Math.max(1 / focusShrink, focusTransitions[index] - delta / focusAnimationSpan)
            }
          } else {
            // Easing bigger, because no longer focused
            focusTransitions[index] = delta / focusAnimationSpan
            if (focusTransitions[index] >= 1) {
              delete focusTransitions[index]
            }
          }

          if (!sizeTransitions[index]) {
            sizeAttr.array[index] = stars[index].luminosity * (focusTransitions[index] ?? 1)
          }
        }

        for (let index in sizeTransitions) {
          const baseSize = focusTransitions[index] ?? 1
          sizeAttr.array[index] = stars[index].luminosity * (1 + cubicInOut(sizeTransitions[index])) * baseSize
          if (hoverIndex == index) {
            // Easing bigger, because hovered
            if (sizeTransitions[index] < 1) {
              sizeTransitions[index] += delta / hoverAnimationSpan

              if (sizeTransitions[index] > 0.4 ) {
                labels[hoverIndex] = true
              }
            }
          } else {
            // Easing smaller, because no longer hovered
            sizeTransitions[index] -= delta / hoverAnimationSpan
            if (sizeTransitions[index] <= 0) {
              delete labels[index]
              labels = {...labels}
              delete sizeTransitions[index]
            }
          }
        }
        sizeAttr.needsUpdate = true
        invalidate()
      }
    },
    { invalidate: false }
  )

  const distance = star => cameraTarget.distanceTo(star.position)
</script>

<Camera target={cameraTarget} />

<Environment
  path="{base}/assets/"
  files="starmap_2020_8k_gal.jpg"
  isBackground={true}
/>

<T.Points
  on:pointermove={(event) => {
    event.stopPropagation()
    const intersection = event.intersections.find(i => {
      const fov = 0.01 / (focusIndex === i.index ? 7 : 1)
      return i.distanceToRay / i.distance ** 0.5 < fov
    })

    if (intersection) {
      onPointerEnter()
      if (hoverIndex !== intersection.index) {
        hoverIndex = intersection.index
        sizeTransitions[hoverIndex] = 0
      }
    } else {
      onPointerLeave()
      hoverIndex = undefined
    }
  }}
  on:dblclick={() => {
    if (hoverIndex !== undefined) {
      focusIndex = hoverIndex
      focusTransitions[focusIndex] = focusTransitions[focusIndex] || 1
      hoverIndex = undefined
    }
  }}
>
  <T is={pointsBufferGeometry} />
  <T.ShaderMaterial
    {fragmentShader}
    {vertexShader}
    uniforms={{
      color: { value: new Color( 0xffffff ) },
      pointTexture: { value: new TextureLoader().load(base + '/assets/disc.png') },
      alphaTest: { value: 0.5 },
    }}

    blending={AdditiveBlending}
    depthTest={false}
    transparent={false}
  />
</T.Points>

{#each stars as star, index}
  {#if labels[index]}
  <CssObject key={star.position}
    position.x={star.position.x}
    position.y={star.position.y}
    position.z={star.position.z}
    center={[0, 0.5]}
  >
    <div class="star-label" transition:fade>
      <div>
        {star.name} ({star.mass.toPrecision(3)}<sub>M☉</sub>){#if focusIndex !== index}<span> - {distance(star).toPrecision(3)} LY}</span>{/if}
      </div>
    </div>
  </CssObject>
  {/if}
{/each}

{#key focusIndex}
  <PlanetarySystem star={stars[focusIndex]} />
{/key}

<style>
  .star-label div {
    pointer-events: none;
    color: white;
    background: #000b;
    border-radius: 0.25rem;
    padding: 0.5rem 1.5rem;
    margin-left: 1rem;
  }
</style>
