import { Color, Vector3 } from 'three'

import randomName from '$lib/starNames'
import randomPlanetarySystem from '$lib/planets'

const types = {
  B: 0.0013,
  A: 0.006,
  F: 0.03,
  G: 0.1,
  K: 0.227,
  M: 0.6357,
}

const masses = {
  B: [2.1, 16],
  A: [1.4, 2.1],
  F: [1.04, 1.4],
  G: [0.8, 1.04],
  K: [0.45, 0.8],
  M: [0.08, 0.45],
}

const colors = {
  B: new Color('rgb(162, 192, 255)'),
  A: new Color('rgb(213, 224, 255)'),
  F: new Color('rgb(249, 245, 255)'),
  G: new Color('rgb(255, 237, 227)'),
  K: new Color('rgb(255, 218, 181)'),
  M: new Color('rgb(255, 181, 108)'),
}

const randomType = () => {
  let seed = Math.random()

  for (const type in types) {
    seed -= types[type]
    if (seed < 0) { return type }
  }
}

const randomMass = (type) => {
  const [min, max] = masses[type]
  return Math.random() ** 2.35 * (max - min) + min
}

const massToType = (mass) => {
  for (let [type, [min, max]] of Object.entries(masses)) {
    if (mass >= min && mass <= max) { return type }
  }

  throw new Error('Mass out of range?')
}

const sol = {
  mass: 1,
  type: 'G',
  luminosity: 1 / 40,
  color: colors.G,
  name: 'Sol',
  position: new Vector3(0, 0, 0),
  orbitalPlane: new Vector3(1, 0, 0),
}

sol.planets = randomPlanetarySystem(sol)

const randomStar = (boxSize) => {
  const type = randomType()
  const mass = randomMass(type)

  const north = new Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  )
  north.normalize()

  const star = {
    type,
    mass,
    luminosity: mass**0.5 / 40,
    color: colors[type],
    name: randomName(),
    position: new Vector3(
      (Math.random() - 0.5) * boxSize,
      (Math.random() - 0.5) * boxSize,
      (Math.random() - 0.5) * boxSize,
    ),
    orbitalPlane: new Vector3(1, 0, 0),
    // orbitalPlane: north,
  }

  star.planets = randomPlanetarySystem(star)
  return star
}

const randomGalaxy = (boxSize, starCount) => {
  const stars = [sol]

  for ( let i = 1; i < starCount; i ++ ) {
    const star = randomStar(boxSize)
    stars.push(star)
  }

  return stars
}

export default randomGalaxy
