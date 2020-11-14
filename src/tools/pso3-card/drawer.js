/* exported drawCard */

const heightInCm = 8.8;
const widthInCm = 6.35;
const sizeRatio = widthInCm / heightInCm;

const DrawingConstant = function (width) {
  const defaultWidth = 300;
  const height = width / sizeRatio;
  const ratio = width / defaultWidth;
  return {
    font: 'Arial',
    lineWidth: '1',
    drawing: {
      border: 'border',
      background: 'background',
      image: 'image',
      descriptionBG: 'descriptionBG',
      nameBG: 'nameBG',
      rangeBG: 'rangeBG',
      categoryText: 'categoryText',
      numberText: 'numberText',
      nameText: 'nameText',
      descriptionText: 'descriptionText',
      illustratorText: 'illustratorText',
      rarityText: 'rarityText',
      targetText: 'targetText',
      attributeHP: 'attributeHP',
      attributeAP: 'attributeAP',
      attributeTP: 'attributeTP',
      attributeMV: 'attributeMV',
      topComboBar: 'topComboBar',
      leftComboBar: 'leftComboBar',
      rightComboBar: 'rightComboBar',
      costBar: 'costBar',
      rangeDef: 'rangeDef'
    },
    border: {
      size: 10 * ratio,
      radius: 16 * ratio
    },
    image: {
      x: 10 * ratio,
      y: 69 * ratio,
      w: width - 20 * ratio,
      h: 210 * ratio
    },
    nameBG: {
      x: 15 * ratio,
      y: 25 * ratio,
      w: width - 30 * ratio,
      h: 25 * ratio
    },
    descriptionBG: {
      x: 15 * ratio,
      y: 284 * ratio,
      w: width - 30 * ratio,
      h: 90 * ratio,
      offset: 4 * ratio
    },
    textSize: {
      category: 14 * ratio,
      number: 12 * ratio,
      name: 24 * ratio,
      description: 12 * ratio,
      illustrator: 6 * ratio,
      attribute: 16 * ratio,
      rarity: 12 * ratio,
      target: 9 * ratio,
      range: 42 * ratio
    },
    textPosition: {
      category: [20 * ratio, 65 * ratio],
      number: [285 * ratio, 22 * ratio],
      name: [width / 2, 45 * ratio],
      description: [20 * ratio, 293 * ratio],
      illustrator: [15 * ratio, height - 25 * ratio],
      rarity: [15 * ratio, 22 * ratio],
      target: [242 * ratio, 227 * ratio]
    },
    textInterLine: {
      description: 2,
      illustrator: 8 * ratio
    },
    attributes: {
      y: 385 * ratio,
      h: height - 15 * ratio,
      offset: 10 * ratio,
      textOffset: 5 * ratio,
      HP: {
        x: 80 * ratio,
        w: 130 * ratio
      },
      AP: {
        x: 130 * ratio,
        w: 180 * ratio
      },
      TP: {
        x: 180 * ratio,
        w: 230 * ratio
      },
      MV: {
        x: 230 * ratio,
        w: 280 * ratio
      }
    },
    comboBar: {
      size: 9 * ratio,
      offset: 6 * ratio,
      border: 2 * ratio,
      top: {
        x: 60 * ratio,
        w: width - 126 * ratio,
        y: 13 * ratio
      },
      left: {
        x: 18 * ratio
        // use image y and h
      },
      right: {
        x: width - 28 * ratio
        // use image y and h
      }
    },
    costBar: {
      x: 180 * ratio,
      y: 52 * ratio,
      w: 100 * ratio,
      h: 15 * ratio,
      radius: 6 * ratio,
      offset: 2 * ratio
    },
    rangeBG: {
      x: 220 * ratio,
      y: 215 * ratio,
      w: 44 * ratio,
      h: 60 * ratio,
      leftOffset: (220 - 36) * ratio,
      topOffset: (215 - 73) * ratio,
      barOffset: 22 * ratio,
      noTargetOffset: 14 * ratio,
      noRangeOffset: 44 * ratio,
      xDescOffset: 92 * ratio,
      yDescOffset: 105 * ratio
    },
    rangeDef: {
      xOffset: 4 * ratio,
      yOffset: 45 * ratio,
      size: 10 * ratio,
      offset: 3 * ratio
    }
  };
};

const drawCurvedRect = function (context, x, y, w, h, radius) {
  context.moveTo(x + radius, y);
  context.lineTo(x + w - radius, y);
  context.quadraticCurveTo(x + w, y, x + w, y + radius);
  context.lineTo(x + w, y + h - radius);
  context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  context.lineTo(x + radius, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
};

const getLinesToDraw = function (context, font, fontSizeStart, interline, text, width, height) {
  const cutLines = function (context, text, width) {
    const textCopy = text.map(function (line) {
      return line;
    });
    const lines = [];
    for (let i = 0; i < textCopy.length; i++) {
      const metrics = context.measureText(textCopy[i]);
      if (metrics.width > width) {
        const words = textCopy[i].split(' ');
        const wordsToDraw = [];
        const wordsToDrawAfter = [];
        let findWords = false;
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
          if (findWords) {
            wordsToDrawAfter.push(words[wordIndex]);
          } else {
            wordsToDraw.push(words[wordIndex]);
            if (context.measureText(wordsToDraw.join(' ')).width > width) {
              findWords = true;
              wordsToDrawAfter.push(wordsToDraw.pop());
            }
          }
        }
        lines.push(wordsToDraw.join(' '));
        textCopy[i] = wordsToDrawAfter.join(' ');
        i--;
      } else {
        lines.push(textCopy[i]);
      }
    }
    return lines;
  };

  const validateTotalHeight = function (fontSize, lines, interligne, height) {
    const totalHeight = fontSize * lines.length + interligne * (lines.length - 1);
    return totalHeight <= height;
  };

  const result = {
    fontSize: null,
    lines: null
  };

  let fontSize = fontSizeStart;
  while (fontSize > 8 && (!result.lines || !validateTotalHeight(fontSize, result.lines, interline, height))) {
    result.fontSize = fontSize;
    context.font = result.fontSize + 'px ' + font;
    result.lines = cutLines(context, text, width);
    fontSize--;
  }

  return result;
};

function drawCard (card) {
  const canvas = document.getElementById('card');
  // TODO
  canvas.width = 400;
  canvas.height = canvas.width / sizeRatio;
  const context = canvas.getContext('2d');

  const constant = new DrawingConstant(canvas.width);

  let x = 0;
  let y = 0;
  let w = canvas.width;
  let h = canvas.height;
  context.lineWidth = constant.lineWidth;

  const resetSize = function () {
    x = 0;
    y = 0;
    w = canvas.width;
    h = canvas.height;
  };

  const adjustSize = function (objectToDraw) {
    if (objectToDraw === constant.drawing.background) {
      resetSize();
      x += constant.border.size;
      y += constant.border.size;
      w -= 2 * constant.border.size;
      h -= 2 * constant.border.size;
    } else if (objectToDraw === constant.drawing.image) {
      x = constant.image.x;
      y = constant.image.y;
      w = constant.image.w;
      h = constant.image.h;
    } else if (objectToDraw === constant.drawing.nameBG) {
      x = constant.nameBG.x;
      y = constant.nameBG.y;
      w = constant.nameBG.w;
      h = constant.nameBG.h;
    } else if (objectToDraw === constant.drawing.descriptionBG) {
      x = constant.descriptionBG.x;
      y = constant.descriptionBG.y;
      w = constant.descriptionBG.w;
      h = constant.descriptionBG.h;
    } else if (objectToDraw === constant.drawing.categoryText) {
      x = constant.textPosition.category[0];
      y = constant.textPosition.category[1];
    } else if (objectToDraw === constant.drawing.numberText) {
      x = constant.textPosition.number[0];
      y = constant.textPosition.number[1];
    } else if (objectToDraw === constant.drawing.nameText) {
      x = constant.textPosition.name[0];
      y = constant.textPosition.name[1];
    } else if (objectToDraw === constant.drawing.descriptionText) {
      x = constant.textPosition.description[0];
      y = constant.textPosition.description[1] + constant.descriptionBG.offset;
      w = constant.descriptionBG.w - constant.descriptionBG.offset * 2;
      h = constant.descriptionBG.h - constant.descriptionBG.offset * 2;
    } else if (objectToDraw === constant.drawing.illustratorText) {
      x = constant.textPosition.illustrator[0];
      y = constant.textPosition.illustrator[1];
    } else if (objectToDraw === constant.drawing.rarityText) {
      x = constant.textPosition.rarity[0];
      y = constant.textPosition.rarity[1];
    } else if (objectToDraw === constant.drawing.targetText) {
      x = constant.textPosition.target[0];
      y = constant.textPosition.target[1];
    } else if (objectToDraw === constant.drawing.attributeHP) {
      x = constant.attributes.HP.x;
      y = constant.attributes.y;
      w = constant.attributes.HP.w;
      h = constant.attributes.h;
    } else if (objectToDraw === constant.drawing.attributeAP) {
      x = constant.attributes.AP.x;
      y = constant.attributes.y;
      w = constant.attributes.AP.w;
      h = constant.attributes.h;
    } else if (objectToDraw === constant.drawing.attributeTP) {
      x = constant.attributes.TP.x;
      y = constant.attributes.y;
      w = constant.attributes.TP.w;
      h = constant.attributes.h;
    } else if (objectToDraw === constant.drawing.attributeMV) {
      x = constant.attributes.MV.x;
      y = constant.attributes.y;
      w = constant.attributes.MV.w;
      h = constant.attributes.h;
    } else if (objectToDraw === constant.drawing.topComboBar) {
      x = constant.comboBar.top.x;
      y = constant.comboBar.top.y;
      w = constant.comboBar.top.w;
      h = constant.comboBar.size;
    } else if (objectToDraw === constant.drawing.leftComboBar) {
      x = constant.comboBar.left.x;
      y = constant.image.y + constant.comboBar.offset * 2;
      w = constant.comboBar.size;
      h = constant.image.h - constant.comboBar.offset * 4;
    } else if (objectToDraw === constant.drawing.rightComboBar) {
      x = constant.comboBar.right.x;
      y = constant.image.y + constant.comboBar.offset * 2;
      w = constant.comboBar.size;
      h = constant.image.h - constant.comboBar.offset * 4;
    } else if (objectToDraw === constant.drawing.costBar) {
      x = constant.costBar.x;
      y = constant.costBar.y;
      w = constant.costBar.w;
      h = constant.costBar.h;
    } else if (objectToDraw === constant.drawing.rangeBG) {
      x = constant.rangeBG.x;
      y = constant.rangeBG.y;
      w = constant.rangeBG.w;
      h = constant.rangeBG.h;
    } else if (objectToDraw === constant.drawing.rangeDef) {
      x = constant.rangeBG.x + constant.rangeDef.xOffset;
      y = constant.rangeBG.y + constant.rangeDef.yOffset;
      w = constant.rangeDef.size;
      h = constant.rangeDef.size;
    } else {
      resetSize();
    }
  };

  // Clear previous drawing
  context.clearRect(x, y, w, h);

  /******************
   * CARD BACKGROUND *
   ******************/
  // Borders
  context.beginPath();
  context.fillStyle = card.getBordersColor();
  drawCurvedRect(context, x, y, w, h, constant.border.radius);
  context.fill();
  context.closePath();

  // Background
  adjustSize(constant.drawing.background);
  context.beginPath();
  context.fillStyle = card.getBackgroundColor();
  context.rect(x, y, w, h);
  context.fill();
  context.closePath();

  // Text background
  context.fillStyle = card.getTextBackgroundColor();
  // Name
  adjustSize(constant.drawing.nameBG);
  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.closePath();

  // Description
  adjustSize(constant.drawing.descriptionBG);
  context.beginPath();
  context.rect(x, y, w, h);
  context.fill();
  context.closePath();

  /******************
    *    CARD IMAGE   *
    ******************/
  // Image
  const image = card.getImage();
  if (image) {
    image.width = constant.image.w;
    image.height = constant.image.h;
    image.onload = function () {
      adjustSize(constant.drawing.image);
      context.drawImage(image, x, y, w, h);

      /******************
        *  GAME FEATURES  *
        *    Need image   *
        *  before drawing *
        ******************/

      // Left colors with borders
      adjustSize(constant.drawing.leftComboBar);
      const leftColors = card.getLeftColors();
      if (leftColors.length > 0) {
        const leftBorder = constant.comboBar.border;
        const nbL = leftColors.length;
        for (let iLC = 0; iLC < nbL; iLC++) {
          const offsetL = constant.comboBar.offset;
          context.beginPath();
          context.fillStyle = card.getComboBorderColor();
          context.rect(x - leftBorder, y + (h * iLC / nbL) + offsetL - leftBorder, w + leftBorder * 2, h / nbL - offsetL + leftBorder * 2);
          context.fill();
          context.closePath();
          context.beginPath();
          context.fillStyle = leftColors[iLC];
          context.rect(x, y + (h * iLC / nbL) + offsetL, w, h / nbL - offsetL);
          context.fill();
          context.closePath();
        }
      }

      // Right colors with borders
      adjustSize(constant.drawing.rightComboBar);
      const rightColors = card.getRightColors();
      if (rightColors.length > 0) {
        const rightBorder = constant.comboBar.border;
        const nbR = rightColors.length;
        for (let iRC = 0; iRC < nbR; iRC++) {
          const offsetR = constant.comboBar.offset;
          context.beginPath();
          context.fillStyle = card.getComboBorderColor();
          context.rect(x - rightBorder, y + (h * iRC / nbR) + offsetR - rightBorder, w + rightBorder * 2, h / nbR - offsetR + rightBorder * 2);
          context.fill();
          context.closePath();
          context.beginPath();
          context.fillStyle = rightColors[iRC];
          context.rect(x, y + (h * iRC / nbR) + offsetR, w, h / nbR - offsetR);
          context.fill();
          context.closePath();
        }
      }

      // Range
      const rangeDefColors = card.getRangeColors();
      const target = card.getTarget();
      const hasRange = rangeDefColors.length > 0;
      const hasTarget = target && target.length > 0;
      const inDescription = card.getDescription().length < 1;

      if (hasTarget || hasRange) {
        const adjustRangeSize = function (adjustY, adujstLeft, adjustTop) {
          const numberOfLongRange = rangeDefColors.length - 3 < 0 ? 0 : rangeDefColors.length - 3;
          const rangeBGOffset = (constant.rangeDef.size + constant.rangeDef.offset) * numberOfLongRange;

          if (adjustY && numberOfLongRange > 0) {
            y = y - rangeBGOffset * (adjustTop ? 0 : 1);
            h = h + rangeBGOffset;
          } else if (!adjustY && adjustTop) {
            y = y + rangeBGOffset;
          }

          if (inDescription) {
            x = x - constant.rangeBG.xDescOffset;
            y = y + constant.rangeBG.yDescOffset - (constant.descriptionBG.h - constant.rangeBG.h - rangeBGOffset) / 2;
          } else {
            if (adujstLeft) {
              x = x - constant.rangeBG.leftOffset - (leftColors.length < 1 ? constant.rangeBG.barOffset : 0);
            } else {
              x = x + (rightColors.length < 1 ? constant.rangeBG.barOffset : 0);
            }
            if (adjustTop) {
              y = y - constant.rangeBG.topOffset;
            }
          }

          if (!hasTarget) {
            if (adjustY) {
              h = h - constant.rangeBG.noTargetOffset;
              if (!adjustTop) {
                y = y + constant.rangeBG.noTargetOffset;
              }
            } else if (adjustTop) {
              y = y - constant.rangeBG.noTargetOffset;
            }
            if (inDescription) {
              y = y - constant.rangeBG.noTargetOffset / 2;
            }
          }

          if (!hasRange) {
            h = h - constant.rangeBG.noRangeOffset;
            y = y + constant.rangeBG.noRangeOffset;
          }
        };

        // Range background
        adjustSize(constant.drawing.rangeBG);
        adjustRangeSize(true, card.isRangeLeft, card.isRangeTop);
        context.beginPath();
        context.fillStyle = card.getRangeBackgroundColor();
        context.rect(x, y, w, h);
        context.fill();
        context.closePath();

        // Target
        adjustSize(constant.drawing.targetText);
        adjustRangeSize(true, card.isRangeLeft, card.isRangeTop);
        context.fillStyle = card.getTextColor();
        context.font = constant.textSize.target + 'px ' + constant.font;
        context.textAlign = 'center';
        context.fillText(target, x, y);

        // Range square
        adjustSize(constant.drawing.rangeDef);
        adjustRangeSize(false, card.isRangeLeft, card.isRangeTop);
        for (let iRDC = rangeDefColors.length - 1; iRDC >= 0; iRDC--) {
          for (let jRDC = 0; jRDC < rangeDefColors[iRDC].length; jRDC++) {
            context.beginPath();
            context.fillStyle = rangeDefColors[iRDC][jRDC];
            context.rect(x + (w + constant.rangeDef.offset) * jRDC, y - (h + constant.rangeDef.offset) * (rangeDefColors.length - 1 - iRDC), w, h);
            context.fill();
            context.closePath();
          }
        }

        // Range letter
        const rangeLetter = card.getRangeLetter();
        if (typeof (rangeLetter) === 'string' || typeof (rangeLetter) === 'number') {
          context.fillStyle = card.getRangeLetterColor();
          context.font = constant.textSize.range + 'px ' + constant.font;
          context.textAlign = 'center';
          context.fillText(rangeLetter, x + (w * 1.5 + constant.rangeDef.offset), y + h / 2 + constant.rangeDef.offset);
        }
      }
    };
  }
  /******************
    *    CARD TEXT    *
    ******************/
  context.fillStyle = card.getTextColor();
  // Category
  adjustSize(constant.drawing.categoryText);
  context.font = constant.textSize.category + 'px ' + constant.font;
  context.textAlign = 'left';
  context.fillText(card.getCategory(), x, y);

  // Number
  adjustSize(constant.drawing.numberText);
  context.font = constant.textSize.number + 'px ' + constant.font;
  context.textAlign = 'right';
  context.fillText(card.number, x, y);

  // Name
  adjustSize(constant.drawing.nameText);
  context.font = constant.textSize.name + 'px ' + constant.font;
  context.textAlign = 'center';
  context.fillText(card.name, x, y);

  // Description
  adjustSize(constant.drawing.descriptionText);
  context.textAlign = 'left';
  const descriptionTextLines = getLinesToDraw(context, constant.font, constant.textSize.description, constant.textInterLine.description, card.getDescription(), w, h);
  context.font = descriptionTextLines.size + 'px ' + constant.font;
  for (let iDT = 0; iDT < descriptionTextLines.lines.length; iDT++) {
    context.fillText(descriptionTextLines.lines[iDT], x, y);
    y += descriptionTextLines.fontSize + constant.textInterLine.description;
  }

  // Illustrator
  adjustSize(constant.drawing.illustratorText);
  context.font = constant.textSize.illustrator + 'px ' + constant.font;
  context.textAlign = 'left';
  const illustratorText = card.getIllustrator();
  for (let iIT = 0; iIT < illustratorText.length; iIT++) {
    context.fillText(illustratorText[iIT], x, y);
    y += constant.textInterLine.illustrator;
  }

  // Rarity
  adjustSize(constant.drawing.rarityText);
  context.fillStyle = card.getRarityColor();
  context.font = constant.textSize.rarity + 'px ' + constant.font;
  context.textAlign = 'left';
  context.fillText(card.getRarity(), x, y);

  /******************
    *  GAME FEATURES  *
    ******************/
  // Attributes with their background
  const attributes = card.getAttributes();
  const attributeColors = card.getAttributeColors();
  const offset = constant.attributes.offset;
  context.font = constant.textSize.attribute + 'px ' + constant.font;
  context.textAlign = 'center';
  // HP
  adjustSize(constant.drawing.attributeHP);
  context.beginPath();
  context.fillStyle = attributeColors[0];
  context.moveTo(x, y);
  context.lineTo(w - offset, y);
  context.lineTo(w, h);
  context.lineTo(x + offset, h);
  context.lineTo(x, y);
  context.fill();
  context.closePath();
  context.fillStyle = card.getTextColor();
  context.fillText(attributes[0], (x + w) / 2, (y + h) / 2 + constant.attributes.textOffset);
  // AP
  adjustSize(constant.drawing.attributeAP);
  context.beginPath();
  context.fillStyle = attributeColors[1];
  context.moveTo(x, y);
  context.lineTo(w - offset, y);
  context.lineTo(w, h);
  context.lineTo(x + offset, h);
  context.lineTo(x, y);
  context.fill();
  context.closePath();
  context.fillStyle = card.getTextColor();
  context.fillText(attributes[1], (x + w) / 2, (y + h) / 2 + constant.attributes.textOffset);
  // TP
  adjustSize(constant.drawing.attributeTP);
  context.beginPath();
  context.fillStyle = attributeColors[2];
  context.moveTo(x, y);
  context.lineTo(w - offset, y);
  context.lineTo(w, h);
  context.lineTo(x + offset, h);
  context.lineTo(x, y);
  context.fill();
  context.closePath();
  context.fillStyle = card.getTextColor();
  context.fillText(attributes[2], (x + w) / 2, (y + h) / 2 + constant.attributes.textOffset);
  // MV
  adjustSize(constant.drawing.attributeMV);
  context.beginPath();
  context.fillStyle = attributeColors[3];
  context.moveTo(x, y);
  context.lineTo(w - offset, y);
  context.lineTo(w, h);
  context.lineTo(x + offset, h);
  context.lineTo(x, y);
  context.fill();
  context.closePath();
  context.fillStyle = card.getTextColor();
  context.fillText(attributes[3], (x + w) / 2, (y + h) / 2 + constant.attributes.textOffset);

  // Top colors with borders
  adjustSize(constant.drawing.topComboBar);
  const topColors = card.getTopColors();
  if (topColors.length > 0) {
    const topBorder = constant.comboBar.border;
    const nbT = topColors.length;
    for (let iTC = 0; iTC < nbT; iTC++) {
      const offsetT = constant.comboBar.offset;
      context.beginPath();
      context.fillStyle = card.getComboBorderColor();
      context.rect(x + (w * iTC / nbT) + offsetT - topBorder, y - topBorder, w / nbT - offsetT + topBorder * 2, h + topBorder * 2);
      context.fill();
      context.closePath();
      context.beginPath();
      context.fillStyle = topColors[iTC];
      context.rect(x + (w * iTC / nbT) + offsetT, y, w / nbT - offsetT, h);
      context.fill();
      context.closePath();
    }
  }

  // Cost with background
  adjustSize(constant.drawing.costBar);
  context.beginPath();
  context.fillStyle = card.getCostBackgroundColor();
  drawCurvedRect(context, x, y, w, h, constant.costBar.radius);
  context.fill();
  context.closePath();

  const costColors = card.getCostColors();
  for (let iCC = 0; iCC < costColors.length; iCC++) {
    context.beginPath();
    context.fillStyle = costColors[iCC];
    context.arc(x + constant.costBar.radius * (iCC * 2 + 1) + constant.costBar.offset * (iCC + 1), y + h / 2, constant.costBar.radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
};
