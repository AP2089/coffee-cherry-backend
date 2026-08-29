import type { ICoffee } from '../types'

export const coffeesSeed: ICoffee[] = [
  {
    name: 'bloom',
    slug: 'bloom',
    country: 'Эфиопия',
    region: 'Йиргачеффе, Гедео',
    variety: 'Heirloom',
    process: 'Мытый',
    altitude: '1 950 – 2 200 м',
    description:
      'Лёгкий цветочный профиль с ягодной кислотностью и прозрачным телом. Утренний кофе для тех, кто ценит ясность вкуса.',
    story:
      'bloom родился на склонах Йиргачеффе, где прохладные ночи и туманные утра формируют тонкую кислотность. Мы обжариваем его светло, чтобы сохранить цветочный аромат и ягодную чистоту — как первый глоток воздуха после дождя.',
    flavorNotes: ['жасмин', 'бергамот', 'белый персик', 'чайная роза'],
    price: 1890,
    weights: [250, 500, 1000],
    image: '/images/bloom.jpg',
    gallery: ['/images/bloom.jpg', '/images/bloom-2.jpg', '/images/bloom-3.jpg'],
    stock: 120,
  },
  {
    name: 'velvet',
    slug: 'velvet',
    country: 'Колумбия',
    region: 'Уила, Сан-Агустин',
    variety: 'Caturra / Castillo',
    process: 'Хани',
    altitude: '1 700 – 1 900 м',
    description:
      'Гладкий шоколадный характер с карамельной сладостью и бархатистым телом. Кофе для медленного вечера.',
    story:
      'velvet — это Уила в её самой мягкой версии. Обработка хани усиливает сладость, а средняя обжарка раскрывает какао и карамель. Мы назвали его так, потому что напиток будто обволакивает — без резкости, только глубина.',
    flavorNotes: ['тёмный шоколад', 'карамель', 'жареный миндаль', 'сливочный какао'],
    price: 1750,
    weights: [250, 500, 1000],
    image: '/images/velvet.jpg',
    gallery: ['/images/velvet.jpg', '/images/velvet-2.jpg', '/images/velvet-3.jpg'],
    stock: 140,
  },
  {
    name: 'santos',
    slug: 'santos',
    country: 'Бразилия',
    region: 'Серрадо Минейро',
    variety: 'Yellow Bourbon',
    process: 'Натуральный',
    altitude: '1 100 – 1 250 м',
    description:
      'Тёплый ореховый профиль с естественной сладостью и округлым телом. Универсальный specialty для любого дня.',
    story:
      'santos вырос на плато Серрадо, где солнце и сухой климат дают плотную сладость. Натуральная обработка добавляет ореховую теплоту. Это кофе, с которого начинается день в нашей лаборатории — спокойный, надёжный, честный.',
    flavorNotes: ['жареный фундук', 'карамель', 'молочный шоколад', 'сушёный инжир'],
    price: 1590,
    weights: [250, 500, 1000],
    image: '/images/santos.jpg',
    gallery: ['/images/santos.jpg', '/images/santos-2.jpg', '/images/santos-3.jpg'],
    stock: 160,
  },
  {
    name: 'noir',
    slug: 'noir',
    country: 'Кения',
    region: 'Ньери, Абердэр',
    variety: 'SL28 / SL34',
    process: 'Мытый',
    altitude: '1 800 – 2 050 м',
    description:
      'Выразительный тёмный характер с цитрусовой кислотностью и ягодной глубиной. Для тех, кто ищет интенсивность.',
    story:
      'noir — это Кения без компромиссов. Высокая кислотность, чёрная смородина и грейпфрут. Мы обжариваем его так, чтобы сохранить драматичность профиля: тёмный, но не тяжёлый — как ночь с лунным светом.',
    flavorNotes: ['чёрная смородина', 'грейпфрут', 'тёмный мёд', 'кедр'],
    price: 2100,
    weights: [250, 500, 1000],
    image: '/images/noir.jpg',
    gallery: ['/images/noir.jpg', '/images/noir-2.jpg', '/images/noir-3.jpg'],
    stock: 90,
  },
  {
    name: 'ember',
    slug: 'ember',
    country: 'Гватемала',
    region: 'Долина Антигуа',
    variety: 'Bourbon / Typica',
    process: 'Мытый',
    altitude: '1 500 – 1 700 м',
    description:
      'Тёплый пряный профиль с глубокой сладостью сухофруктов. Вечерний кофе у тлеющего очага.',
    story:
      'ember родился в долине Антигуа, окружённой вулканами. Вулканическая почва даёт пряность и плотность. Мы слышим в нём тлеющие угли: корица, сухофрукты, глубокая теплота — последний сорт дня в coffee cherry.',
    flavorNotes: ['корица', 'сушёный абрикос', 'какао-нибс', 'мускатный орех'],
    price: 1820,
    weights: [250, 500, 1000],
    image: '/images/ember.jpg',
    gallery: ['/images/ember.jpg', '/images/ember-2.jpg', '/images/ember-3.jpg'],
    stock: 110,
  },
]
