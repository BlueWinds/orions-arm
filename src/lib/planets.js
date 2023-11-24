const jupiterMass = 1.8982e27 // kg
const saturnMass = 5.6834e26
const neptuneMass = 1.02413e26
const earthMass = 5.972e24
const mercuryMass = 3.3011e23
const moonMass = 7.342e22

const designation = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
]

const types = {
  gasGiant: 0.15,
  neptuneLike: 0.2,
  superEarth: 0.15,
  terrestrial: 0.4,
  asteroidBelt: 0.1
}

const randomType = () => {
  let seed = Math.random()

  for (const type in types) {
    seed -= types[type]
    if (seed < 0) { return type }
  }
}

const masses = {
  gasGiant: [saturnMass, jupiterMass * 13],
  neptuneLike: [neptuneMass / 3, saturnMass],
  superEarth: [earthMass * 1.5, neptuneMass / 3],
  terrestrial: [mercuryMass, earthMass * 1.5],
  asteroidBelt: [moonMass * 0.2, moonMass],
}

const randomMass = (type) => {
  const [min, max] = masses[type]
  return Math.random() ** 1.55 * (max - min) + min
}

const randomPlanetarySystem = star => {
  const planets = []

  let i = 0
  let currentOrbit = star.mass / 5 // AU

  currentOrbit *= 1 + Math.random() * 4
  while (currentOrbit < star.mass * 40) {
    const type = randomType()
    const mass = randomMass(type)

    planets.push({
      orbit: currentOrbit,
      mass,
      type,
      name: `${star.name} A${designation[i]}`
    })

    i++
    currentOrbit *= Math.random() * 0.6 + 1.5
  }

  return planets
}

const rocheLimit = (star, planet) => {
  return 2.44 * star.radius
}

export default randomPlanetarySystem
