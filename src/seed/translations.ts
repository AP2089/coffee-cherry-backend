import type { ICoffeeLocalizedContent } from '../types'

type TranslationSeed = ICoffeeLocalizedContent & { slug: string }

export const coffeeTranslationsSeed: TranslationSeed[] = [
  {
    slug: 'bloom',
    country: 'Ethiopia',
    region: 'Yirgacheffe, Gediyo',
    process: 'Washed',
    altitude: '1,950 – 2,200 m',
    description:
      'A light floral profile with berry acidity and a transparent body. A morning coffee for those who value clarity of taste.',
    story:
      'Bloom was born on the slopes of Yirgacheffe, where cool nights and misty mornings shape delicate acidity. We roast it light to preserve the floral aroma and berry clarity — like the first breath of air after rain.',
    flavorNotes: ['jasmine', 'bergamot', 'white peach', 'tea rose'],
  },
  {
    slug: 'velvet',
    country: 'Colombia',
    region: 'Huila, San Agustín',
    process: 'Honey',
    altitude: '1,700 – 1,900 m',
    description:
      'A smooth chocolate character with caramel sweetness and a velvety body. Coffee for a slow evening.',
    story:
      'Velvet is Huila at its softest. Honey processing enhances sweetness, and a medium roast reveals cocoa and caramel. We named it so because the cup feels enveloping — no sharp edges, only depth.',
    flavorNotes: ['dark chocolate', 'caramel', 'roasted almond', 'creamy cocoa'],
  },
  {
    slug: 'santos',
    country: 'Brazil',
    region: 'Cerrado Mineiro',
    process: 'Natural',
    altitude: '1,100 – 1,250 m',
    description:
      'A warm nutty profile with natural sweetness and a rounded body. A versatile specialty for any day.',
    story:
      'Santos grew on the Cerrado plateau, where sun and dry climate create dense sweetness. Natural processing adds nutty warmth. This is the coffee that starts the day in our lab — calm, reliable, honest.',
    flavorNotes: ['roasted hazelnut', 'caramel', 'milk chocolate', 'dried fig'],
  },
  {
    slug: 'noir',
    country: 'Kenya',
    region: 'Nyeri, Aberdare',
    process: 'Washed',
    altitude: '1,800 – 2,050 m',
    description:
      'A bold dark character with citrus acidity and berry depth. For those seeking intensity.',
    story:
      'Noir is Kenya without compromise. High acidity, blackcurrant and grapefruit. We roast it to preserve the drama of the profile: dark, but not heavy — like a night with moonlight.',
    flavorNotes: ['blackcurrant', 'grapefruit', 'dark honey', 'cedar'],
  },
  {
    slug: 'ember',
    country: 'Guatemala',
    region: 'Antigua Valley',
    process: 'Washed',
    altitude: '1,500 – 1,700 m',
    description:
      'A warm spicy profile with deep dried-fruit sweetness. An evening coffee by the embers.',
    story:
      'Ember was born in the Antigua valley, surrounded by volcanoes. Volcanic soil gives spice and density. We hear smoldering coals in it: cinnamon, dried fruit, deep warmth — the last coffee of the day at coffee cherry.',
    flavorNotes: ['cinnamon', 'dried apricot', 'cacao nibs', 'nutmeg'],
  },
]
