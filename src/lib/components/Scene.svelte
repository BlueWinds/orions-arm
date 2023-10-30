<script>
  import { T, useLoader, useFrame } from '@threlte/core'
  import { Environment, interactivity } from '@threlte/extras'
  import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Vector3, TextureLoader } from 'three'
  import { cubicInOut, quadInOut } from 'svelte/easing'
  import { tweened } from 'svelte/motion'

  import { base } from '$app/paths'
  import Camera from './Camera.svelte'
  import { luminosity, randomMass, massToType } from '$lib/stars'
  import fragmentShader from './fragment.glsl?raw'
  import vertexShader from './vertex.glsl?raw'

  interactivity()

  const amount = parseInt((location.search.match(/stars=(\d+)/) || [, 10000])[1], 10)

  const cameraX = tweened(0, { duration: 1000, easing: quadInOut })
  const cameraY = tweened(0, { duration: 1000, easing: quadInOut })
  const cameraZ = tweened(0, { duration: 1000, easing: quadInOut })

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
  }

  addStar(1, 0)

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

  let hoverIndex, hoverTransitions = {}

  const hoverAnimationSpan = 0.3
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
            if (hoverTransitions[index] >= 1) {
              delete hoverTransitions[index]
            }
          } else {
            // Easing smaller, because no longer hovered
            hoverTransitions[index] -= delta / hoverAnimationSpan
            if (hoverTransitions[index] <= 0) {
              delete hoverTransitions[index]
            }
          }
        }
        invalidate()
      }
      // stats.update()
    },
    { invalidate: false }
  )

  const bestIntersection = (event) => event.intersections.find(i => i.distanceToRay / i.distance ** 0.5 < 0.07)

  let tweening = false
  const onDblClick = async (event) => {
    event.stopPropagation()

    const intersection = bestIntersection(event)

    if (intersection) {
      tweening = true
      cameraX.set(positions[intersection.index * 3])
      cameraY.set(positions[intersection.index * 3 + 1])

      await cameraZ.set(positions[intersection.index * 3 + 2])
      tweening = false
    }
  }
</script>

<Camera
  x={$cameraX}
  y={$cameraY}
  z={$cameraZ}
  lockDistance={tweening}
/>

<Environment
  path="{base}/assets/"
  files="starmap_2020_8k_gal.jpg"
  isBackground={true}
/>

<T.Points
  position.y={0.2}
  position.z={-0.75}

  on:pointermove={(event) => {
    event.stopPropagation()
    const intersection = bestIntersection(event)

    if (intersection && hoverIndex !== intersection.index) {
      hoverTransitions[hoverIndex] = 1
      hoverIndex = intersection.index
      hoverTransitions[hoverIndex] = 0
    }
  }}

  on:dblclick={onDblClick}
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
