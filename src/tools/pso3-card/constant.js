/* exported copyright config reference */

const copyright = Object.freeze('%C2%A9SEGA/SONIC%20TEAM');

const config = Object.freeze({
  constant: {
    HUNTER: 'Hunter',
    ARKZ: 'Arkz',
    OBJECT: 'Objet',
    ENEMY: 'Créature',
    ACTION: 'Action',
    ASSIST: 'Assist',
    DEFAULT_TARGET: 'none',
    combo: {
      B: 'B',
      G: 'G',
      Gs: 'Gs',
      Gh: 'Gh',
      O: 'O',
      P: 'P',
      R: 'R',
      Y: 'Y'
    }
  },
  text: {
    noData: '-',
    illustrator: 'Illus. ',
    special: '★ ',
    common: ' • ',
    condition: '■ ',
    separator: ' - ',
    comma: ', ',
    positive: '+',
    lineSeparator: '@@'
  },
  colors: {
    B: '#00c7fb',
    G: '#3fa026',
    Gs: '#908e90',
    Gh: '#575757',
    O: '#fc7000',
    P: '#91238f',
    R: '#dc3510',
    Y: '#e7cb00',
    text: 'white',
    background: {
      Hunter: ['DarkBlue', 'RoyalBlue', 'MidnightBlue'],
      Arkz: ['DarkMagenta', 'MediumPurple', 'Purple'],
      Objet: ['Green', 'MediumSeaGreen', 'DarkGreen'],
      Créature: ['Brown', 'IndianRed', 'FireBrick'],
      Action: ['Sienna', 'Peru', 'SaddleBrown'],
      Assist: ['DarkGoldenRod', '#E4BE5F', '#AE841A']
    },
    attributes: {
      HP: 'LimeGreen',
      AP: '#dc3510',
      TP: 'DeepSkyBlue',
      MV: 'DarkMagenta'
    },
    combo: {
      background: 'rgba(100,100,100,0.3)',
      border: 'black'
    },
    rarity: {
      common: 'white',
      rare: '#ffb66b',
      special: '#cedf52',
      superSpecial: '#62f4b1',
      event: '#ff71c6'
    },
    cost: {
      full: 'gold',
      empty: 'rgb(128,128,128)',
      background: 'black'
    },
    range: {
      background: 'rgba(100,100,100,0.75)',
      centre: 'black',
      letter: 'red',
      in: 'white',
      outNear: 'rgb(128,128,128)',
      outFar: 'rgba(128,128,128,0)'
    }
  },
  categories: [
    'Hunter',
    'Arkz',
    'Objet',
    'Créature',
    'Action',
    'Assist'
  ],
  types: {
    Hunter: ['Hunter', 'Ranger', 'Force'],
    Arkz: ['Hunter', 'Ranger', 'Force'],
    Objet: ['Épée', 'Fusil', 'Canne', 'Armure', 'Mag'],
    Créature: ['Natif', 'Bête', 'Machine', 'Dark'],
    Action: ['Attaque', 'Tech', 'Défense'],
    Assist: [
      'Permanent',
      '8 tours',
      '6 tours',
      '5 tours',
      '4 tours',
      '2 tours',
      'Une fois'
    ]
  },
  classes: {
    Hunter: ['HUmar', 'HUnewearl', 'HUcast', 'HUcaseal'],
    Ranger: ['RAmar', 'RAmarl', 'RAcast', 'RAcaseal'],
    Force: ['FOmar', 'FOmarl', 'FOnewm', 'FOnewearl'],
    Tech: ['Attaque']
  },
  rarity: {
    common: ['N4', 'N3', 'N2', 'N1'],
    rare: ['R4', 'R3', 'R2', 'R1'],
    special: ['S'],
    superSpecial: ['SS'],
    event: ['E']
  },
  costMax: 7,
  target: [
    '',
    'Unique',
    'Multiple',
    'Tous',
    'Equipe',
    'Pour soi'
  ],
  range: [
    'none',
    'simple',
    'sword',
    'huge-fan',
    'slicer',
    'twin-saber',
    'circle',
    'cross',
    'right-punch',
    'gun',
    'heavy-gun',
    'rifle',
    'long-rifle',
    'shot',
    'maser',
    'faust',
    'dark-meteor',
    'bazooka',
    'indi-belra',
    'gizonde',
    'all'
  ],
  rangeDefinition: {
    none: [],
    simple: [[0, 1, 0], [0, null, 0], [0, 0, 0]],
    sword: [[1, 1, 1], [0, null, 0], [0, 0, 0]],
    'huge-fan': [[2, 1, 2], [1, 1, 1], [0, null, 0], [0, 0, 0]],
    slicer: [[2, 1, 2], [1, 0, 1], [0, null, 0], [0, 0, 0]],
    'twin-saber': [[0, 1, 0], [1, null, 0], [0, 0, 0]],
    circle: [[1, 1, 1], [1, null, 1], [1, 1, 1]],
    cross: [[0, 1, 0], [1, null, 1], [0, 1, 0]],
    'right-punch': [[2, 1, 1], [0, 1, 1], [0, null, 0], [0, 0, 0]],
    gun: [[2, 1, 2], [0, 1, 0], [0, null, 0], [0, 0, 0]],
    'heavy-gun': [[1, 1, 1], [1, 1, 1], [0, null, 0], [0, 0, 0]],
    rifle: [[2, 1, 2], [2, 1, 2], [0, 1, 0], [0, null, 0], [0, 0, 0]],
    'long-rifle': [
      [2, 1, 2],
      [2, 1, 2],
      [2, 1, 2],
      [0, 1, 0],
      [0, null, 0],
      [0, 0, 0]
    ],
    shot: [[1, 1, 1], [0, 1, 0], [0, null, 0], [0, 0, 0]],
    maser: [[2, 1, 2], [1, 2, 2], [0, 1, 0], [0, null, 0], [0, 0, 0]],
    faust: [[1, 1, 1], [1, 1, 1], [0, null, 0], [0, 0, 0]],
    'dark-meteor': [[1, 1, 1], [1, 1, 1], [1, 1, 1], [0, null, 0], [0, 0, 0]],
    bazooka: [[1, 1, 1], [1, 1, 1], [0, 0, 0], [0, null, 0], [0, 0, 0]],
    'indi-belra': [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [0, null, 0],
      [0, 0, 0]
    ],
    gizonde: [[1, 2, 1], [2, 1, 2], [1, 0, 1], [0, null, 0], [0, 0, 0]],
    all: [[1, 1, 1], [1, 'A', 1], [1, 1, 1]]
  }
});

const reference = Object.freeze({
  abilities: []
});
