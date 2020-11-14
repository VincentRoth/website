/* global drawCard */

const CARD = {
  imageSource: '',
  text: {
    noData: '-',
    illustrator: 'Illust/ ',
    copyright: '©SEGA/SONIC TEAM',
    special: '★ ',
    common: '■ ',
    separator: ' - ',
    comma: ', ',
    positive: '+'
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
      hunter: ['DarkBlue', 'RoyalBlue', 'MidnightBlue'],
      arkz: ['DarkMagenta', 'MediumPurple', 'Purple'],
      object: ['Green', 'MediumSeaGreen', 'DarkGreen'],
      enemy: ['Brown', 'IndianRed', 'FireBrick'],
      action: ['Sienna', 'Peru', 'SaddleBrown'],
      assist: ['DarkGoldenRod', '#E4BE5F', '#AE841A']
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
      background: 'rgba(100,100,100,1)',
      centre: 'black',
      letter: 'red',
      out: 'rgb(128,128,128)',
      in: 'white'
    }
  },
  categories: [
    'hunter',
    'arkz',
    'object',
    'enemy',
    'action',
    'assist'
  ],
  rarity: {
    common: ['N4', 'N3', 'N2', 'N1'],
    rare: ['R4', 'R3', 'R2', 'R1'],
    special: ['S'],
    superSpecial: ['SS'],
    event: ['E']
  },
  maxCost: 7,
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
};

class CardModel {
  constructor () {
    this.rarity = '';
    this.number = '';
    this.name = '';
    this.category = null;
    this.type = '';
    this.cost = 0;
    this.attributes = {
      hp: '',
      ap: '',
      tp: '',
      mv: ''
    };
    this.combos = {
      top: [],
      left: [],
      right: []
    };
    this.target = null;
    this.range = [];
    this.abilities = [];
    this.description = '';
    this.image = null;
    this.illustrator = null;
  }

  configureListeners () {
    const attachListener = (id, callback) => {
      const element = document.getElementById(id);
      callback(element);
      element.onchange = (event) => {
        callback(event.target);
        this.draw();
      };
    };

    attachListener('rarity', element => (this.rarity = element.value));
    attachListener('number', element => (this.number = element.value));
    attachListener('name', element => (this.name = element.value));
    attachListener('category', element => (this.category = element.value));
    attachListener('type', element => (this.type = element.value));
    attachListener('cost', element => (this.cost = element.value || 0));

    attachListener('image', element => {
      const files = element.files;
      if (files && files.length > 0) {
        this.image = new Image();
        this.image.src = URL.createObjectURL(files[0]);
      }
    });

    attachListener('hp', element => (this.attributes.hp = element.value));
    attachListener('ap', element => (this.attributes.ap = element.value));
    attachListener('tp', element => (this.attributes.tp = element.value));
    attachListener('mv', element => (this.attributes.mv = element.value));
  }

  draw () {
    drawCard(this);
  }

  getCategory () {
    const category = this.category.toUpperCase();
    if (this.type) {
      return (category + CARD.text.separator + this.type);
    }
    return category;
  }

  getDescription () {
    const text = [this.description];
    const conditionAbilities = [];
    const commonAbilities = [];
    const abilities = [];
    for (let a = 0; a < this.abilities.length; a++) {
      const ability = ''; // TODO getAbilityDescription(card.abilities[a]);
      if (!ability.common) {
        abilities.push(CARD.text.special + ability.name + CARD.text.separator + ability.description);
      } else {
        if (ability.condition) {
          conditionAbilities.push(ability.name);
        } else {
          commonAbilities.push(ability.name);
        }
      }
    }
    if (conditionAbilities.length > 0) {
      text.push(CARD.text.condition + conditionAbilities.join(CARD.text.comma));
    }
    if (commonAbilities.length > 0) {
      text.push(CARD.text.common + commonAbilities.join(CARD.text.comma));
    }
    return text.concat(abilities);
  }

  getAbilities () {
    const abilities = [];
    for (let a = 0; a < this.abilities.length; a++) {
      const ability = ''; // TODO getAbilityDescription(card.abilities[a]);
      abilities.push(ability.name + CARD.text.separator + ability.description);
    }
    return abilities;
  }

  getTarget () {
    if (this.target) {
      return this.target;
    }
    return '';
  }

  getRarity () {
    if (this.rarity) {
      return this.rarity;
    }
    return '';
  }

  getIllustrator () {
    const text = [];
    if (this.illustrator) {
      text.push(CARD.text.illustrator + this.illustrator);
    } else {
      text.push('');
    }
    text.push(CARD.text.copyright);
    return text;
  }

  getImage () {
    return this.image;
  }

  getBordersColor () {
    return CARD.colors.background[this.category][0];
  }

  getBackgroundColor () {
    return CARD.colors.background[this.category][1];
  }

  getTextBackgroundColor () {
    return CARD.colors.background[this.category][2];
  }

  getTextColor () {
    return CARD.colors.text;
  }

  getRarityColor () {
    if (CARD.rarity.common.indexOf(this.rarity) !== -1) {
      return CARD.colors.rarity.common;
    } else if (CARD.rarity.rare.indexOf(this.rarity) !== -1) {
      return CARD.colors.rarity.rare;
    } else if (CARD.rarity.special.indexOf(this.rarity) !== -1) {
      return CARD.colors.rarity.special;
    } else if (CARD.rarity.superSpecial.indexOf(this.rarity) !== -1) {
      return CARD.colors.rarity.superSpecial;
    } else if (CARD.rarity.event.indexOf(this.rarity) !== -1) {
      return CARD.colors.rarity.event;
    }
    return CARD.colors.text;
  }

  getTopColors () {
    return this.combos.top.map(ref => CARD.colors[ref]);
  }

  getLeftColors () {
    return this.combos.left.map(ref => CARD.colors[ref]);
  }

  getRightColors () {
    return this.combos.right.map(ref => CARD.colors[ref]);
  }

  getComboBackgroundColor () {
    return CARD.colors.combo.background;
  }

  getComboBorderColor () {
    return CARD.colors.combo.border;
  }

  getAttributes () {
    return [this.attributes.hp, this.attributes.ap, this.attributes.tp, this.attributes.mv];
  }

  getAttributeColors () {
    return [CARD.colors.attributes.HP, CARD.colors.attributes.AP, CARD.colors.attributes.TP, CARD.colors.attributes.MV];
  }

  getCostColors () {
    const colors = [];
    for (let i = 0; i < CARD.maxCost; i++) {
      if (i < CARD.maxCost - this.cost) {
        colors.push(CARD.colors.cost.empty);
      } else {
        colors.push(CARD.colors.cost.full);
      }
    }
    return colors;
  }

  getCostBackgroundColor () {
    return CARD.colors.cost.background;
  }

  getRangeColors () {
    // TODO
    const rangeDef = CARD.rangeDefinition[this.range];
    const rangeColors = [];
    for (let i = 0; i < rangeDef.length; i++) {
      const rangeLineColor = [];
      for (let j = 0; j < rangeDef[i].length; j++) {
        if (rangeDef[i][j] === 0) {
          rangeLineColor.push(CARD.colors.range.outNear);
        } else if (rangeDef[i][j] === 1) {
          rangeLineColor.push(CARD.colors.range.in);
        } else if (rangeDef[i][j] === 2) {
          rangeLineColor.push(CARD.colors.range.outFar);
        } else {
          rangeLineColor.push(CARD.colors.range.centre);
        }
      }
      rangeColors.push(rangeLineColor);
    }
    return rangeColors;
  }

  getRangeLetter () {
    // TODO
    const rangeDef = CARD.rangeDefinition[this.range];
    if (rangeDef.length < 2) {
      return '';
    }
    return rangeDef[rangeDef.length - 2][1];
  }

  getRangeLetterColor () {
    return CARD.colors.range.letter;
  }

  getRangeBackgroundColor () {
    return CARD.colors.range.background;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const model = new CardModel();
  model.configureListeners();
  model.draw();
});
