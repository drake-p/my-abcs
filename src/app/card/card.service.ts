import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { Card } from './card';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const KEYS = {
  0: '0',
  1: '1',
  2: '2-4',
  3: '2-4',
  4: '2-4',
  5: '5+',
};

@Injectable()
export class CardService {
  cards: Card[] = [];
  emitter: EventEmitter<any> = new EventEmitter();
  win: number;

  getCards(): Card[] {
    return this.cards;
  };

  addCard(cardName: string): void {
    this.cards.push(<Card>{id: 0, name: cardName, types: []});
    this.cards.sort((a, b) => {
      return a.name > b.name ? +1 : -1;
    });
    this.emitter.emit(null);
  };

  removeCard(card: Card): void {
    var index = this.cards.indexOf(card);
    this.cards.splice(index, 1);
    this.emitter.emit(null);
  };

  subscribe(callback: any): void {
    this.emitter.subscribe(callback);
  }

  getKeyPermanents(): Card[] {
    let keyCards: Card[] = [];
    let keyLetters: string[] = [];

    let letterCounts = this.count();

    for (var letter in letterCounts) {
      if (letterCounts[letter] == 1) {
        keyLetters.push(letter);
      }
    }

    this.cards.forEach((card) => {
      card.unique = keyLetters.some((letter) => {
        return card.name.toUpperCase().includes(letter);
      });
    });

    return keyCards;
  }

  getFrequencies(): Object[] {
    let frequencies = {'0': '', '1': '', '2-4': '', '5+': ''};
    let letterCounts = this.count();

    // check whether we have all 26 letters
    this.win = this.isWin(letterCounts);

    // group letters by frequency
    for (let letter in letterCounts) {
      let key = KEYS[letterCounts[letter]] || KEYS[5];
      frequencies[key] += letter + ' ';
    };

    return this.format(frequencies);
  }

  count(): Object {
    let letterCounts = {};

    // make a hash like {A: 0, B: 0, C: 0, ...}
    Array.from(ALPHABET, (letter, i) => {
      letterCounts[letter] = 0;
    });

    // tally up the letters in each card name
    this.getCards().forEach((card: Card) => {
      Array.from(card.name.toUpperCase()).forEach((letter: string) => {

        // don't worry about non-alphabetic characters; they don't count
        if (letterCounts[letter] != undefined) {
          letterCounts[letter]++;
        }
      });
    });

    return letterCounts;
  }

  format(frequencies: Object): Object[] {
    let formatted: Object[];
    formatted = [];

    // take {'0': '', '1': ''} and make [{'label': '0', 'letters': ''}, {'label': '1', 'letters': ''}]
    for (let key in frequencies) {
      if (frequencies[key]) {
        formatted.push({
          label: key,
          letters: frequencies[key]
        });
      }
    }

    return formatted;
  }

  isWin(letterCounts: Object): number {
    for (let letter in letterCounts) {
      if (letterCounts[letter] == 0) {
        return 0;
      }
    }

    return 1;
  }
}