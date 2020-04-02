import React from 'react';
import pluralize from 'pluralize';

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const titleCase = string => {
  const sentence = string.split(' ');
  const { length } = sentence;
  for (let i = 0; i < length; i += 1) {
    sentence[i] = sentence[i][0] ? sentence[i][0].toUpperCase() + sentence[i].slice(1) : '-';
  }

  return sentence.join(' ');
};
export const slugify = string => {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, ''); // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
};
export const slugToTitle = string => {
  return titleCase(string.replace(/-/g, ' '));
};
export const trimPhone = string =>
  string
    .toString()
    .trim()
    .replace(/\s+/g, '')
    .replace(/\+/g, '');
export const isValidPhoneNumber = phone => phone.match(phoneRegex);
export const isValidEmailAddress = email => email.match(emailRegex);
export const nl2br = string =>
  string.split(/\\r\\n|\\n|\\r/).map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  ));
export const makePluralize = (word, count = 0, inclusive = false) => {
  const pluralWord = word.trim();
  const indexOfParenthesis = pluralWord.indexOf('(');
  if (indexOfParenthesis > 0) {
    const firstWord = pluralWord.slice(0, indexOfParenthesis).trim();
    const firstWordPlural = pluralize(firstWord, count, inclusive);

    return pluralWord.replace(firstWord, firstWordPlural);
  }

  return pluralize(pluralWord, count, inclusive);
};
export const findReplace = (searchText, findArray, replacementArray) => {
  let textReplacement = searchText;
  const count = findArray.length;

  for (let i = 0; i < count; i += 1) {
    const find = findArray[i];
    const replace = replacementArray[i];

    textReplacement = textReplacement.replace(find, replace);
  }

  return textReplacement;
};
