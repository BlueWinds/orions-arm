<script>
  import { T, useLoader, useFrame } from '@threlte/core'
  import { Environment, interactivity, useCursor } from '@threlte/extras'
  import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Vector3, TextureLoader } from 'three'
  import { cubicInOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'
  import { fade } from 'svelte/transition'

  import { base } from '$app/paths'
  import Camera from './Camera.svelte'
  import CssObject from './CssObject.svelte'
  import { luminosity, randomMass, massToType } from '$lib/stars'
  import randomName from '$lib/starNames'
  import fragmentShader from './fragment.glsl?raw'
  import vertexShader from './vertex.glsl?raw'

  interactivity()

  const { onPointerEnter, onPointerLeave } = useCursor('pointer', 'auto')

  const amount = parseInt((location.search.match(/stars=(\d+)/) || [, 10000])[1], 10)

  const names = []
  const positions = new Float32Array( amount * 3 )
  const colors = new Float32Array( amount * 3 )
  const sizes = new Float32Array( amount )
  const baseSizes = new Float32Array( amount )

  const vertex = new Vector3(0, 0, 0)
  const color = new Color( 0xffffff )
  const masses = new Array( amount )

  const addStar = (mass, i) => {
    const [brightness, c] = luminosity(mass)

    color.set(c)

    vertex.toArray(positions, i * 3)
    color.toArray(colors, i * 3)

    masses[i] = mass
    baseSizes[i] = brightness / 3
    sizes[i] = brightness / 3
    names[i] = randomName()
  }

  addStar(1, 0)
  names[0] = 'Sol'

  const boxSize = 40

  for ( let i = 1; i < amount; i ++ ) {
    vertex.x = (Math.random() - 0.5) * boxSize
    vertex.y = (Math.random() - 0.5) * boxSize
    vertex.z = (Math.random() - 0.5) * boxSize

    addStar(randomMass(), i)
  }

  const pointsBufferGeometry = new BufferGeometry()

  pointsBufferGeometry.setAttribute('position', new BufferAttribute( positions, 3 ));
  pointsBufferGeometry.setAttribute('customColor', new BufferAttribute( colors, 3 ));
  pointsBufferGeometry.setAttribute('size', new BufferAttribute( sizes, 1 ));

  let hoverIndex, hoverTransitions = {}, labels = {}

  const hoverAnimationSpan = 0.5
  useFrame(
    ({ invalidate }, delta) => {
      if (Object.keys(hoverTransitions).length) {
        const sizeAttr = pointsBufferGeometry.attributes.size
        sizeAttr.needsUpdate = true

        for (let index in hoverTransitions) {
          sizeAttr.array[index] = baseSizes[index] * (1 + cubicInOut(hoverTransitions[index]))
          if (hoverIndex == index) {
            // Easing bigger, because hovered
            hoverTransitions[index] += delta / hoverAnimationSpan

            if (hoverTransitions[index] > 0.4 ) {
              labels[hoverIndex] = true
            }
            if (hoverTransitions[index] >= 1) {
              delete hoverTransitions[index]
            }
          } else {
            // Easing smaller, because no longer hovered
            hoverTransitions[index] -= delta / hoverAnimationSpan
            if (hoverTransitions[index] <= 0) {
              delete labels[index]
              delete hoverTransitions[index]
            }
          }
        }
        invalidate()
      }
    },
    { invalidate: false }
  )

  const bestIntersection = (event) => event.intersections.find(i => i.distanceToRay / i.distance ** 0.5 < 0.07)

  let cameraX = 0
  let cameraY = 0
  let cameraZ = 0
</script>

<Camera
  x={cameraX}
  y={cameraY}
  z={cameraZ}
/>

<Environment
  path="{base}/assets/"
  files="starmap_2020_8k_gal.jpg"
  isBackground={true}
/>

<T.Points
  on:pointermove={(event) => {
    event.stopPropagation()
    const intersection = bestIntersection(event)

    if (intersection) {
      onPointerEnter()
      if (hoverIndex !== intersection.index) {
        hoverTransitions[hoverIndex] = 1
        hoverIndex = intersection.index
        hoverTransitions[hoverIndex] = 0
      }
    } else {
      onPointerLeave()
      hoverTransitions[hoverIndex] = 1
      hoverIndex = undefined
    }
  }}
  on:dblclick={() => {
    if (hoverIndex !== undefined) {
      cameraX = positions[hoverIndex * 3]
      cameraY = positions[hoverIndex * 3 + 1]
      cameraZ = positions[hoverIndex * 3 + 2]
    }
  }}
>
  <T is={pointsBufferGeometry} />
  <T.ShaderMaterial
    {fragmentShader}
    {vertexShader}
    uniforms={{
      color: { value: color },
      pointTexture: { value: new TextureLoader().load(base + '/assets/disc.png') },
      alphaTest: { value: 0.5 },
    }}

    blending={AdditiveBlending}
    depthTest={false}
    transparent={false}
  />
</T.Points>

{#each Object.keys(masses) as index}
  {#if labels[index]}
  <CssObject key={index}
    position.x={positions[index * 3]}
    position.y={positions[index * 3 + 1]}
    position.z={positions[index * 3 + 2]}
    center={[0, 0.5]}
  >
    <div class="star-label" transition:fade>
      <div>{names[index]} ({masses[index].toPrecision(3)}<sub>M☉</sub>)</div>
    </div>
  </CssObject>
  {/if}
{/each}

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
