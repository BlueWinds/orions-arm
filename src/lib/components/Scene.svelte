<script>
  import { T, useLoader, useFrame } from '@threlte/core'
  import { ContactShadows, createTransition, Environment, Float, Grid, interactivity, OrbitControls } from '@threlte/extras'
  import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Vector3, TextureLoader } from 'three'
  import { cubicInOut } from 'svelte/easing'

  import { luminosity, randomMass, massToType } from '$lib/stars'
  import fragmentShader from './fragment.glsl?raw'
  import vertexShader from './vertex.glsl?raw'

  interactivity()

  const amount = parseInt((location.search.match(/stars=(\d+)/) || [, 10000])[1], 10)

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
  console.log(sizes[0])

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
          if (hoverIndex == index) {
            // Easing bigger, because hovered
            if (hoverTransitions[index] < 1) {
              hoverTransitions[index] += delta / hoverAnimationSpan
            }
          } else {
            // Easing smaller, because no longer hovered
            hoverTransitions[index] -= delta / hoverAnimationSpan
          }
          sizeAttr.array[index] = baseSizes[index] * (1 + cubicInOut(hoverTransitions[index]))
          if (hoverTransitions[index] <= 0) {
            delete hoverTransitions[index]
          }
        }
        invalidate()
      }
    },
    { invalidate: false }
  )

  const cameraOffset = new Vector3(0, 0.205, -0.75)
</script>

<T.PerspectiveCamera
  makeDefault
  position={[2, 0, 0]}
  fov={60}
>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.01}
    enableZoom={true}
    enablePan={false}
    enableDamping={true}
    dampingFactor={0.03}
    target.x={cameraOffset.x}
    target.y={cameraOffset.y}
    target.z={cameraOffset.z}
  />
</T.PerspectiveCamera>

<Environment
  path="assets/"
  files="starmap_2020_8k_gal.jpg"
  isBackground={true}
/>

<T.Points
  position.y={0.2}
  position.z={-0.75}

  on:pointermove={(event) => {
    event.stopPropagation()
    const intersection = event.intersections.find(i => i.distanceToRay / i.distance ** 0.5 < 0.07)

    if (intersection && hoverIndex !== intersection.index) {
      hoverIndex = intersection.index
      hoverTransitions[hoverIndex] = 0
    }
  }}
>
  <T is={pointsBufferGeometry} />
  <T.ShaderMaterial
    {fragmentShader}
    {vertexShader}
    uniforms={{
      color: { value: color },
      pointTexture: { value: new TextureLoader().load('assets/disc.png') },
      alphaTest: { value: 0.5 },
    }}

    blending={AdditiveBlending}
    depthTest={false}
    transparent={false}
  />
</T.Points>
