const masses = {
  B: [2.1, 16],
  A: [1.4, 2.1],
  F: [1.04, 1.4],
  G: [0.8, 1.4],
  K: [0.45, 0.8],
  M: [0.08, 0.45],
}

const colors = {
  B: 'rgb(162, 192, 255)',
  A: 'rgb(213, 224, 255)',
  F: 'rgb(249, 245, 255)',
  G: 'rgb(255, 237, 227)',
  K: 'rgb(255, 218, 181)',
  M: 'rgb(255, 181, 108)',
}

export const randomType = () => {
  const seed = Math.random()

  if (seed < 0.0013) {
    return 'B'
  } else if (seed < 0.006) {
    return 'A'
  } else if (seed < 0.03) {
    return 'F'
  } else if (seed < 0.106) {
    return 'G'
  } else if (seed < 0.227) {
    return 'K'
  } else {
    return 'M'
  }
}

export const randomMass = () => {
  const [min, max] = masses[randomType()]
  return Math.random() ** 2.35 * (max - min) + min
}

export const massToType = (mass) => {
  for (let [type, [min, max]] of Object.entries(masses)) {
    if (mass >= min && mass <= max) { return type }
  }

  throw new Error('Mass out of range?')
}

export const luminosity = (mass) => {
  return [mass**0.5, colors[massToType(mass)]]
}
