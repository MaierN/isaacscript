import { CardType } from "isaac-typescript-definitions";

export const DEFAULT_CARD_NAME = "Unknown";

/** This is a temporary map due to missing features in the vanilla API. */
export const CARD_NAMES: { readonly [key in CardType]: string } = {
  [CardType.NULL]: DEFAULT_CARD_NAME,
  [CardType.FOOL]: "0 - The Fool",
  [CardType.MAGICIAN]: "I - The Magician",
  [CardType.HIGH_PRIESTESS]: "II - The High Priestess",
  [CardType.EMPRESS]: "III - The Empress",
  [CardType.EMPEROR]: "IV - The Emperor",
  [CardType.HIEROPHANT]: "V - The Hierophant",
  [CardType.LOVERS]: "VI - The Lovers",
  [CardType.CHARIOT]: "VII - The Chariot",
  [CardType.JUSTICE]: "VIII - Justice",
  [CardType.HERMIT]: "IX - The Hermit",
  [CardType.WHEEL_OF_FORTUNE]: "X - Wheel of Fortune",
  [CardType.STRENGTH]: "XI - Strength",
  [CardType.HANGED_MAN]: "XII - The Hanged Man",
  [CardType.DEATH]: "XIII - Death",
  [CardType.TEMPERANCE]: "XIV - Temperance",
  [CardType.DEVIL]: "XV - The Devil",
  [CardType.TOWER]: "XVI - The Tower",
  [CardType.STARS]: "XVII - The Stars",
  [CardType.MOON]: "XVIII - The Moon",
  [CardType.SUN]: "XIX - The Sun",
  [CardType.JUDGEMENT]: "XX - Judgement",
  [CardType.WORLD]: "XXI - The World",
  [CardType.CLUBS_2]: "2 of Clubs",
  [CardType.DIAMONDS_2]: "2 of Diamonds",
  [CardType.SPADES_2]: "2 of Spades",
  [CardType.HEARTS_2]: "2 of Hearts",
  [CardType.ACE_OF_CLUBS]: "Ace of Clubs",
  [CardType.ACE_OF_DIAMONDS]: "Ace of Diamonds",
  [CardType.ACE_OF_SPADES]: "Ace of Spades",
  [CardType.ACE_OF_HEARTS]: "Ace of Hearts",
  [CardType.JOKER]: "Joker",
  [CardType.RUNE_HAGALAZ]: "Hagalaz",
  [CardType.RUNE_JERA]: "Jera",
  [CardType.RUNE_EHWAZ]: "Ehwaz",
  [CardType.RUNE_DAGAZ]: "Dagaz",
  [CardType.RUNE_ANSUZ]: "Ansuz",
  [CardType.RUNE_PERTHRO]: "Perthro",
  [CardType.RUNE_BERKANO]: "Berkano",
  [CardType.RUNE_ALGIZ]: "Algiz",
  [CardType.RUNE_BLANK]: "Blank Rune",
  [CardType.RUNE_BLACK]: "Black Rune",
  [CardType.CHAOS]: "Chaos Card",
  [CardType.CREDIT]: "Credit Card",
  [CardType.RULES]: "Rules Card",
  [CardType.AGAINST_HUMANITY]: "A Card Against Humanity",
  [CardType.SUICIDE_KING]: "Suicide King",
  [CardType.GET_OUT_OF_JAIL_FREE]: "Get Out Of Jail Free Card",
  [CardType.QUESTION_MARK]: "? Card",
  [CardType.DICE_SHARD]: "Dice Shard",
  [CardType.EMERGENCY_CONTACT]: "Emergency Contact",
  [CardType.HOLY]: "Holy Card",
  [CardType.HUGE_GROWTH]: "Huge Growth",
  [CardType.ANCIENT_RECALL]: "Ancient Recall",
  [CardType.ERA_WALK]: "Era Walk",
  [CardType.RUNE_SHARD]: "Rune Shard",
  [CardType.REVERSE_FOOL]: "0 - The Fool?",
  [CardType.REVERSE_MAGICIAN]: "I - The Magician?",
  [CardType.REVERSE_HIGH_PRIESTESS]: "II - The High Priestess?",
  [CardType.REVERSE_EMPRESS]: "III - The Empress?",
  [CardType.REVERSE_EMPEROR]: "IV - The Emperor?",
  [CardType.REVERSE_HIEROPHANT]: "V - The Hierophant?",
  [CardType.REVERSE_LOVERS]: "VI - The Lovers?",
  [CardType.REVERSE_CHARIOT]: "VII - The Chariot?",
  [CardType.REVERSE_JUSTICE]: "VIII - Justice?",
  [CardType.REVERSE_HERMIT]: "IX - The Hermit?",
  [CardType.REVERSE_WHEEL_OF_FORTUNE]: "X - Wheel of Fortune?",
  [CardType.REVERSE_STRENGTH]: "XI - Strength?",
  [CardType.REVERSE_HANGED_MAN]: "XII - The Hanged Man?",
  [CardType.REVERSE_DEATH]: "XIII - Death?",
  [CardType.REVERSE_TEMPERANCE]: "XIV - Temperance?",
  [CardType.REVERSE_DEVIL]: "XV - The Devil?",
  [CardType.REVERSE_TOWER]: "XVI - The Tower?",
  [CardType.REVERSE_STARS]: "XVII - The Stars?",
  [CardType.REVERSE_MOON]: "XVIII - The Moon?",
  [CardType.REVERSE_SUN]: "XIX - The Sun?",
  [CardType.REVERSE_JUDGEMENT]: "XX - Judgement?",
  [CardType.REVERSE_WORLD]: "XXI - The World?",
  [CardType.CRACKED_KEY]: "Cracked Key",
  [CardType.QUEEN_OF_HEARTS]: "Queen of Hearts",
  [CardType.WILD]: "Wild Card",
  [CardType.SOUL_ISAAC]: "Soul of Isaac",
  [CardType.SOUL_MAGDALENE]: "Soul of Magdalene",
  [CardType.SOUL_CAIN]: "Soul of Cain",
  [CardType.SOUL_JUDAS]: "Soul of Judas",
  [CardType.SOUL_BLUE_BABY]: "Soul of ???",
  [CardType.SOUL_EVE]: "Soul of Eve",
  [CardType.SOUL_SAMSON]: "Soul of Samson",
  [CardType.SOUL_AZAZEL]: "Soul of Azazel",
  [CardType.SOUL_LAZARUS]: "Soul of Lazarus",
  [CardType.SOUL_EDEN]: "Soul of Eden",
  [CardType.SOUL_LOST]: "Soul of the Lost",
  [CardType.SOUL_LILITH]: "Soul of Lilith",
  [CardType.SOUL_KEEPER]: "Soul of the Keeper",
  [CardType.SOUL_APOLLYON]: "Soul of Apollyon",
  [CardType.SOUL_FORGOTTEN]: "Soul of the Forgotten",
  [CardType.SOUL_BETHANY]: "Soul of Bethany",
  [CardType.SOUL_JACOB]: "Soul of Jacob and Esau",
} as const;
