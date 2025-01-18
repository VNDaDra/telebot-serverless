// export const ALLOW_GROUP = [
//   -1001642923718, // Gaming bros
//   -4657376450, // Engrisk
// ];

export const GAME_ALLOW_GROUP = [
  -1002030621208, // Test
  -4506508137, // Coin bros
];

export const GPT_ALLOW_GROUP = [
  -1002030621208, // Test
  -1002315203839, // Engrisk
];

export enum Command {
  GAMING_COMMAND = "/game",
  TRANSLATE_ENG = "/te",
  TRANSLATE_VIE = "/tv",
  CHECK_GRAMMAR = "/cg",
}

export const BOT_TYPE = {
  GAME: process.env.TELEGRAM_GAME_BOT_ENDPOINT,
  GPT: process.env.TELEGRAM_GPT_BOT_ENDPOINT,
}

export const GPT_TEXT_LIMIT = 10000;

export const MOCKING_SENTENCES = [
  'NO HOPE',
  // "Just because you support something doesn't mean it's good or always good",
  // "Just complete your life, everything else has its own complete",
  // "I will not trust anything from this market anymore",
  // "I really can't imagine a man hating a man",
  // "I would pay for movies - and would not pay to avoid ads",
  // "We should know what is important than money",
  // "Nothing special is special",
  // "One thing we must always know, what is more important than money",
  // "The past is the past, the future is the future",
];
