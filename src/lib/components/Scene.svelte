<script>
  import { T } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { BufferAttribute, BufferGeometry, Vector3, TextureLoader } from 'three'

  import { base } from '$app/paths'
  import Camera from './Camera.svelte'
  import fragmentShader from './fragment.glsl?raw'
  import vertexShader from './vertex.glsl?raw'

  interactivity()

  const amount = 10000
  const boxSize = 40

  const vertex = new Vector3(0, 0, 0)
  const positions = new Float32Array( amount * 3 )

  for ( let i = 0; i < amount; i ++ ) {
    vertex.x = (Math.random() - 0.5) * boxSize
    vertex.y = (Math.random() - 0.5) * boxSize
    vertex.z = (Math.random() - 0.5) * boxSize
    vertex.toArray(positions, i * 3)
  }

  const pointsBufferGeometry = new BufferGeometry()
  pointsBufferGeometry.setAttribute('position', new BufferAttribute( positions, 3 ));

  let cameraX = 0
  let cameraY = 0
  let cameraZ = 0
</script>

<Camera
  x={cameraX}
  y={cameraY}
  z={cameraZ}
/>

<T.Points
  on:dblclick={(event) => {
    const intersection = event.intersections.find(i => i.distanceToRay / i.distance ** 0.5 < 0.07)

    if (intersection) {
      cameraX = positions[intersection.index * 3]
      cameraY = positions[intersection.index * 3 + 1]
      cameraZ = positions[intersection.index * 3 + 2]
    }
  }}
>
  <T is={pointsBufferGeometry} />
  <T.ShaderMaterial
    {fragmentShader}
    {vertexShader}
    uniforms={{
      pointTexture: { value: new TextureLoader().load(base + '/assets/disc.png') },
      alphaTest: { value: 0.5 },
    }}
    depthTest={false}
    transparent={false}
  />
</T.Points>
