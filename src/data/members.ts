import type { Member, Zone } from './types';

// Prototype mock data — realistic CMI-style names, roles and assignments.
const firstNames = [
  'Thomas', 'Jose', 'Sebastian', 'Antony', 'Varghese', 'Mathew', 'Joseph', 'Paul',
  'George', 'Francis', 'James', 'John', 'Augustine', 'Cyriac', 'Dominic', 'Emmanuel',
  'Xavier', 'Kuriakose', 'Alex', 'Benny', 'Davis', 'Roy', 'Jacob', 'Martin',
  'Vincent', 'Stephen', 'Ignatius', 'Philip', 'Charles', 'Michael', 'Jomon', 'Tomy',
  'Bijoy', 'Shaji', 'Anil', 'Prince',
];
const lastNames = [
  'Kattady', 'Puthenpurayil', 'Vadakkel', 'Chirayath', 'Panjikaran', 'Mundadan',
  'Kalapurackal', 'Nellikunnel', 'Manjaly', 'Vazhappilly', 'Karottukampil', 'Elavunkal',
  'Kizhakkedath', 'Palathingal', 'Cheruvallil', 'Perumpallil', 'Anikkad', 'Thottumkal',
];
const roles = [
  'Provincial', 'Vicar Provincial', 'Provincial Councillor', 'Superior', 'Vice Superior',
  'Principal', 'Vice Principal', 'Parish Priest', 'Assistant Parish Priest', 'Professor',
  'Formator', 'Bursar', 'Director', 'Chaplain', 'Manager', 'Missionary',
];
const houses = [
  'St. Joseph’s Monastery, Calicut', 'Provincial House, Calicut', 'Nirmala Bhavan, Wayanad',
  'Little Flower Ashram, Kalpetta', 'Chavara Bhavan, Kannur', 'St. Thomas Monastery, Tamarassery',
  'Carmel Hill, Ooty', 'Preshitha Bhavan, Gudalur', 'Snehagiri, Sulthan Bathery',
  'Darsana, Wayanad', 'Vimala Bhavan, Vadakara', 'Bethania Ashram, Mananthavady',
];
const institutions = [
  'St. Joseph’s HSS, Calicut', 'Chavara Public School, Kannur', 'Little Flower College, Kalpetta',
  'Carmel Jyothi ITI, Wayanad', 'Snehalaya Rehabilitation Centre', 'Chavara Hospital, Tamarassery',
  'Preshitha Retreat Centre', 'Nirmala Special School', undefined, undefined,
];
const dioceses = ['Calicut', 'Thamarassery', 'Kannur', 'Mananthavady', 'Sultanpet', 'Ooty'];
const parishes = ['St. Mary’s', 'Sacred Heart', 'St. George', 'Little Flower', 'Holy Family', 'St. Antony’s'];
const zones: Zone[] = ['Calicut', 'Wayanad', 'Malabar', 'Nilgiris', 'Mission'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const feasts = [
  'St. Thomas the Apostle', 'St. Joseph', 'St. Sebastian', 'St. George', 'St. Antony',
  'Sacred Heart', 'St. Francis', 'St. Augustine', 'St. Dominic', 'St. Kuriakose Elias Chavara',
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const members: Member[] = Array.from({ length: 36 }, (_, i) => {
  const bm = (i % 12) + 1;
  const fm = ((i + 5) % 12) + 1;
  const bd = ((i * 7) % 27) + 1;
  const fd = ((i * 3) % 27) + 1;
  const profYear = 1978 + (i % 40);
  const ordYear = profYear + 6;
  const house = pick(houses, i);
  const role = pick(roles, i);
  const inst = pick(institutions, i);
  const zone = pick(zones, i);
  return {
    id: `m${i + 1}`,
    name: `Fr. ${pick(firstNames, i)} ${pick(lastNames, i * 3)} CMI`,
    role,
    house,
    institution: inst,
    zone,
    country: i % 9 === 0 ? 'Germany' : i % 7 === 0 ? 'Tanzania' : 'India',
    phone: `+91 98${470 + (i % 500)} ${100000 + i * 137}`.slice(0, 17),
    email: `${pick(firstNames, i).toLowerCase()}.${pick(lastNames, i * 3).toLowerCase()}@cmicalicut.org`,
    birthday: `${pick(months, bm - 1)} ${bd}`,
    birthMonth: bm,
    feastDay: `${pick(months, fm - 1)} ${fd}`,
    feastMonth: fm,
    diocese: pick(dioceses, i),
    parish: `${pick(parishes, i)} Church`,
    professionDate: `16 May ${profYear}`,
    ordinationDate: `28 Dec ${ordYear}`,
    feastName: pick(feasts, i),
    assignments: [
      { role, place: inst || house, from: `${2015 + (i % 8)}`, to: null },
      { role: 'Assistant Parish Priest', place: pick(parishes, i + 1) + ' Church', from: `${2010 + (i % 5)}`, to: `${2015 + (i % 8)}` },
      { role: 'Formator', place: pick(houses, i + 2), from: `${2005 + (i % 4)}`, to: `${2010 + (i % 5)}` },
    ],
  } satisfies Member;
});

export function memberById(id: string) {
  return members.find((m) => m.id === id);
}
