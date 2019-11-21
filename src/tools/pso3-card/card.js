/* global config copyright reference */

class Card {
  constructor (cardData) {
    let data = cardData;
    if (!data || !this.checkIntegrity(data)) {
      data = {};
    }
    // card reference, can be a number or the character reference, so a string
    this.ref = data.ref;
    this.name = data.name;
    this.category = data.category;
    this.type = data.type;
    this.class = data.class;
    this.rarity = data.rarity;
    // Stats are numbers for cost, HP, AP, TP and MV
    this.stats = data.stats || {
      cost: null,
      hp: null,
      ap: null,
      tp: null,
      mv: null
    };
    // Combos are array for chaining cards
    // Top combo is for playing card to protect against this card
    // Right and left combos are used to chain card in a same attack
    // At least a color should match from top to top or from right to left to be able to chain a card
    this.combos = data.combos || { top: [], right: [], left: [] };
    this.target = data.target;
    this.range = data.range || 'none';
    this.abilities = data.abilities || [];
    // Image URL, can be relative
    this.image = data.image;
  }

  getNumber (card) {
    return card.ref.toUpperCase();
  }
  getCategory (card) {
    // TODO assist
    var type = card.type;
    if (card.category === config.constant.HUNTER || card.category === config.constant.ARKZ) {
      type = card.class;
    }
    return card.category.toUpperCase() + config.text.separator + type;
  }
  getCardDescription (card) {
    var text = [];
    var conditionAbilities = [];
    var commonAbilities = [];
    var abilities = [];
    for (var a = 0; a < card.abilities.length; a++) {
      var ability = getAbilityDescription(card.abilities[a]);
      if (!ability.common) {
        abilities.push(config.text.special + ability.name + config.text.separator + ability.description);
      } else {
        if (ability.condition) {
          conditionAbilities.push(ability.name);
        } else {
          commonAbilities.push(ability.name);
        }
      }
    }
    if (conditionAbilities.length > 0) {
      text.push(config.text.condition + conditionAbilities.join(config.text.comma));
    }
    if (commonAbilities.length > 0) {
      text.push(config.text.common + commonAbilities.join(config.text.comma));
    }
    return text.concat(abilities);
  }
  getCardAbilities (card) {
    var abilities = [];
    for (var a = 0; a < card.abilities.length; a++) {
      var ability = getAbilityDescription(card.abilities[a]);
      abilities.push(ability.name + config.text.separator + ability.description);
    }
    return abilities;
  }
  getCardAttributes (card) {
    // TODO
    var attributeHPToString = function (attribute) {
      if (typeof attribute === 'number') {
        if (attribute >= 0 && card.type !== config.constant.OBJECT && card.type !== config.constant.ENEMY) {
          return config.text.positive + attribute.toString();
        }
        return attribute.toString();
      } else if (typeof attribute === 'string') {
        return attribute;
      }
      return config.text.noData;
    };
    var attributeAPToString = function (attribute) {
      if (typeof attribute === 'number') {
        if (
          attribute >= 0
          && card.type !== config.constant.HUNTER
          && card.type !== config.constant.ARKZ
          && card.type !== config.constant.ENEMY
        ) {
          return config.text.positive + attribute.toString();
        }
        return attribute.toString();
      } else if (typeof attribute === 'string') {
        return attribute;
      }
      return config.text.noData;
    };
    var attributeTPToString = attributeAPToString;
    var attributeMVToString = function (attribute) {
      if (typeof attribute === 'number') {
        return attribute.toString();
      }
      return config.text.noData;
    };
    var attributes = [];
    attributes.push(attributeHPToString(card.HP));
    attributes.push(attributeAPToString(card.AP));
    attributes.push(attributeTPToString(card.TP));
    attributes.push(attributeMVToString(card.MV));
    return attributes;
  }
  getCardTarget (card) {
    if (card.target) {
      return card.target;
    }
    return '';
  }
  getCardRarity (card) {
    if (card.rarity) {
      return card.rarity;
    }
    return '';
  }
  getCardIllustrator (card) {
    var text = [];
    if (card.illustrator) {
      text.push(config.text.illustrator + card.illustrator);
    } else {
      text.push('');
    }
    text.push(decodeURI(copyright));
    return text;
  }
  getCardImage (card) {
    var image = new Image();
    image.src = config.imageSource + card.image;
    return image;
  }
  getCardBordersColor (card) {
    return config.colors.background[card.category][0];
  }
  getCardBackgroundColor (card) {
    return config.colors.background[card.category][1];
  }
  getCardTextBackgroundColor (card) {
    return config.colors.background[card.category][2];
  }
  getCardRarityColor (card) {
    if (config.rarity.common.indexOf(card.rarity) !== -1) {
      return config.colors.rarity.common;
    } else if (config.rarity.rare.indexOf(card.rarity) !== -1) {
      return config.colors.rarity.rare;
    } else if (config.rarity.special.indexOf(card.rarity) !== -1) {
      return config.colors.rarity.special;
    } else if (config.rarity.superSpecial.indexOf(card.rarity) !== -1) {
      return config.colors.rarity.superSpecial;
    } else if (config.rarity.event.indexOf(card.rarity) !== -1) {
      return config.colors.rarity.event;
    }
    return config.colors.text;
  }
  getCardTopColors (card) {
    var colors = [];
    for (var i = 0; i < card.top.length; i++) {
      colors.push(config.colors[card.top[i]]);
    }
    return colors;
  }
  getCardLeftColors (card) {
    var colors = [];
    for (var i = 0; i < card.left.length; i++) {
      colors.push(config.colors[card.left[i]]);
    }
    return colors;
  }
  getCardRightColors (card) {
    var colors = [];
    for (var i = 0; i < card.right.length; i++) {
      colors.push(config.colors[card.right[i]]);
    }
    return colors;
  }
  getCardCostColors (card) {
    var colors = [];
    for (var i = 0; i < config.costMax; i++) {
      if (i < config.costMax - (card.cost ? card.cost : 0)) {
        colors.push(config.colors.cost.empty);
      } else {
        colors.push(config.colors.cost.full);
      }
    }
    return colors;
  }
  getCardRangeColors (card) {
    var rangeDef = config.rangeDefinition[card.range];
    var rangeColors = [];
    for (var i = 0; i < rangeDef.length; i++) {
      var rangeLineColor = [];
      for (var j = 0; j < rangeDef[i].length; j++) {
        if (rangeDef[i][j] === 0) {
          rangeLineColor.push(config.colors.range.outNear);
        } else if (rangeDef[i][j] === 1) {
          rangeLineColor.push(config.colors.range.in);
        } else if (rangeDef[i][j] === 2) {
          rangeLineColor.push(config.colors.range.outFar);
        } else {
          rangeLineColor.push(config.colors.range.centre);
        }
      }
      rangeColors.push(rangeLineColor);
    }
    return rangeColors;
  }
  getRangeLetter () {
    var rangeDef = config.rangeDefinition[this.range];
    if (rangeDef.length < 2) {
      return '';
    }
    return rangeDef[rangeDef.length - 2][1];
  }
  getCardTextColor () {
    // TODO keep ?
    return config.colors.text;
  }
  getCardComboBackgroundColor () {
    // TODO keep ?
    return config.colors.combo.background;
  }
  getCardComboBorderColor () {
    // TODO keep ?
    return config.colors.combo.border;
  }
  getCardAttributeColors () {
    // TODO keep ?
    return [config.colors.attributes.HP, config.colors.attributes.AP, config.colors.attributes.TP, config.colors.attributes.MV];
  }
  getCardCostBackgroundColor () {
    // TODO keep ?
    return config.colors.cost.background;
  }
  getCardRangeLetterColor () {
    // TODO keep ?
    return config.colors.range.letter;
  }
  getCardRangeBackgroundColor () {
    // TODO keep ?
    return config.colors.range.background;
  }

  checkIntegrity () {
    return Card.checkIntegrity(this);
  }

  static checkIntegrity (card) {
    const errors = [];

    if (!card.ref) {
      errors.push('Card reference is unknown.');
    }
    if (!card.type) {
      errors.push('Card type is unknown. Cannot process further.');
      return errors;
    }

    // category
    if (config.categories.indexOf(card.category) === -1) {
      errors.push(`${card.type} ${card.ref} category "${card.category}" is unknown.`);
    } else if (config.types[card.category].indexOf(card.type) === -1) {
      // type
      errors.push(`${card.type} ${card.ref} type "${card.type}" is unknown.`);
    } else if (config.classes[card.type] && config.classes[card.type].indexOf(card.class) === -1) {
      // class
      errors.push(`${card.type} ${card.ref} class "${card.class}" is unknown.`);
    }

    // rarity
    if ((card.categories === config.constant.HUNTER || card.categories === config.constant.ARKZ) && card.rarity) {
      errors.push(`${card.type} ${card.ref} rarity "${card.rarity}" should not be set.`);
    } else if (
      config.rarity.common.indexOf(card.rarity) === -1
      && config.rarity.rare.indexOf(card.rarity) === -1
      && config.rarity.special.indexOf(card.rarity) === -1
      && config.rarity.superSpecial.indexOf(card.rarity) === -1
      && config.rarity.event.indexOf(card.rarity) === -1
    ) {
      errors.push(`${card.type} ${card.ref} rarity "${card.rarity}" is unknown.`);
    }

    // cost
    if ((card.categories === config.constant.HUNTER || card.categories !== config.constant.ARKZ) && card.cost) {
      errors.push(`${card.type} ${card.ref} cost should not be set.`);
    } else if (typeof card.cost !== 'number') {
      errors.push(`${card.type} ${card.ref} cost is not defined.`);
    }

    // stats
    if (card.categories !== config.constant.ACTION && card.type !== config.constant.ASSIST) {
      // HP
      if (typeof card.stats.hp !== 'number') {
        errors.push(`${card.type} ${card.ref} HP is not defined.`);
      }
      // AP
      if (card.type !== config.constant.OBJECT && typeof card.stats.ap !== 'number' && card.stats.ap !== '?') {
        errors.push(`${card.type} ${card.ref} AP is not defined.`);
      }
      // TP
      if (card.type !== config.constant.OBJECT && typeof card.stats.tp !== 'number' && card.stats.tp !== '?') {
        errors.push(`${card.type} ${card.ref} TP is not defined.`);
      }
      // MV
      if (card.type !== config.constant.OBJECT && typeof card.stats.mv !== 'number') {
        errors.push(`${card.type} ${card.ref} MV is not defined.`);
      }
    }

    const checkCombo = (position, combos) => {
      if (!Array.isArray(combos)) {
        // existence
        errors.push(`${card.type} ${card.ref} ${position} combo is not defined.`);
      } else {
        // color
        combos.forEach(combo => {
          if (!config.colors[combo]) {
            errors.push(`${card.type} ${card.ref} ${position} combo color for "${combo}" is unknown.`);
          }
        });
      }
    };

    checkCombo('top', card.combos.top);
    checkCombo('left', card.combos.left);
    checkCombo('right', card.combos.right);

    // target
    if (config.target.indexOf(card.target) === -1) {
      errors.push(`${card.type} ${card.ref} target "${card.target}" is unknown.`);
    }
    // range
    if (config.range.indexOf(card.range) === -1) {
      errors.push(`${card.type} ${card.ref} range "${card.range}" is unknown.`);
    }

    // abilities
    card.abilities.forEach(ability => {
      let found = reference.abilities.filter(refAbility => refAbility.name === ability).length;
      if (!found) {
        errors.push(`${card.type} ${card.ref} ability "${ability}" is unknown.`);
      }
    });

    // image url
    if (!card.image) {
      errors.push(`${card.type} ${card.ref} image is not defined.`);
    }
    console.error(errors.join('\n'));
    return errors;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var test = new Card();
  test.ref = 1;
  test.type = config.constant.OBJECT;
  console.dir(test.checkIntegrity());
  console.dir(test);
});
