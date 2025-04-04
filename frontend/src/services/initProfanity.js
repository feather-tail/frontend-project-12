import leoProfanity from 'leo-profanity';

const profanityInit = () => {
  leoProfanity.add(leoProfanity.getDictionary('en'));
  leoProfanity.add(leoProfanity.getDictionary('ru'));
};

export default profanityInit;
