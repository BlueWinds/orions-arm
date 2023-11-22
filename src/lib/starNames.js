const pick = (a) => a[Math.floor(Math.random() * a.length)]

const letters = [
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
  'Zeta',
  'Eta',
  'Theta',
  'Iota',
  'Kappa',
  'Lambda',
  'Mu',
  'Nu',
  'Xi',
  'Omicron',
  'Pi',
  'Rho',
  'Sigma',
  'Tau',
  'Upsilon',
  'Phi',
  'Chi',
  'Psi',
  'Omega',
]

const constellations = [
  "Andromeda",
  "Aquarius",
  "Aquila",
  "Ara",
  "Argo Navis‎",
  "Aries",
  "Auriga",
  "Boötes‎",
  "Cancer",
  "Canis Major‎",
  "Canis Minor‎",
  "Capricornus‎",
  "Cassiopeia",
  "Centaurus‎",
  "Cepheus",
  "Cetus‎",
  "Corona Australis‎",
  "Corona Borealis‎",
  "Corvus",
  "Crater",
  "Cygnus",
  "Delphinus‎",
  "Draco",
  "Equuleus‎",
  "Eridanus",
  "Gemini",
  "Hercules",
  "Hydra",
  "Leo",
  "Lepus",
  "Libra",
  "Lupus",
  "Lyra‎",
  "Ophiuchus‎",
  "Orion",
  "Pegasus",
  "Perseus",
  "Pisces",
  "Piscis Austrinus‎",
  "Sagitta‎",
  "Sagittarius",
  "Scorpius‎",
  "Serpens‎",
  "Taurus",
  "Triangulum‎",
  "Ursa Major‎",
  "Ursa Minor‎",
  "Virgo",
]

const randomName = () => {
  return `${pick(letters)} ${pick(constellations)}`
}

export default randomName