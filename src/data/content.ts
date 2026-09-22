import type {
  Album, AuditEntry, CmiEvent, Institution, Leader, NewsArticle, Reflection, UserAccount, Zone,
} from './types';
import { members } from './members';

const zones: Zone[] = ['Calicut', 'Wayanad', 'Malabar', 'Nilgiris', 'Mission'];

// ---------------- Institutions (13) ----------------
export const institutions: Institution[] = [
  { id: 'i1', name: 'St. Joseph’s Monastery', category: 'house', zone: 'Calicut', address: 'Mananchira, Calicut, Kerala 673001', phone: '+91 495 2701234', email: 'stjoseph@cmicalicut.org', year: 1957, apostolates: ['Prayer', 'Community life', 'Provincial administration'], head: 'Fr. Thomas Kattady CMI', residents: 14 },
  { id: 'i2', name: 'Provincial House', category: 'house', zone: 'Calicut', address: 'Kovoor, Calicut, Kerala 673008', phone: '+91 495 2760111', email: 'provincialhouse@cmicalicut.org', year: 1962, apostolates: ['Retreat', 'Spiritual direction'], head: 'Fr. Jose Puthenpurayil CMI', residents: 9 },
  { id: 'i3', name: 'St. Joseph’s Higher Secondary School', category: 'education', zone: 'Calicut', address: 'Devagiri, Calicut, Kerala 673008', phone: '+91 495 2721133', email: 'stjosephhss@cmicalicut.org', year: 1958, apostolates: ['Education', 'Value formation'], head: 'Fr. Sebastian Vadakkel CMI', residents: 0 },
  { id: 'i4', name: 'Little Flower College', category: 'education', zone: 'Wayanad', address: 'Kalpetta, Wayanad, Kerala 673121', phone: '+91 4936 202345', email: 'lfc@cmicalicut.org', year: 1981, apostolates: ['Higher education', 'Rural upliftment'], head: 'Fr. Antony Chirayath CMI', residents: 0 },
  { id: 'i5', name: 'Chavara Public School', category: 'education', zone: 'Malabar', address: 'Kannur, Kerala 670001', phone: '+91 497 2701222', email: 'chavara@cmicalicut.org', year: 1995, apostolates: ['CBSE education'], head: 'Fr. Varghese Mundadan CMI', residents: 0 },
  { id: 'i6', name: 'Snehalaya Rehabilitation Centre', category: 'social', zone: 'Wayanad', address: 'Mananthavady, Wayanad, Kerala 670645', phone: '+91 4935 240100', email: 'snehalaya@cmicalicut.org', year: 2003, apostolates: ['De-addiction', 'Counselling', 'Rehabilitation'], head: 'Fr. Mathew Manjaly CMI', residents: 22 },
  { id: 'i7', name: 'Chavara Hospital', category: 'health', zone: 'Malabar', address: 'Tamarassery, Kozhikode, Kerala 673573', phone: '+91 495 2222333', email: 'hospital@cmicalicut.org', year: 1988, apostolates: ['Primary healthcare', 'Palliative care'], head: 'Fr. Joseph Kalapurackal CMI', residents: 6 },
  { id: 'i8', name: 'Preshitha Retreat Centre', category: 'pastoral', zone: 'Calicut', address: 'Vellimadukunnu, Calicut, Kerala 673012', phone: '+91 495 2730044', email: 'preshitha@cmicalicut.org', year: 1999, apostolates: ['Retreats', 'Youth ministry'], head: 'Fr. Paul Nellikunnel CMI', residents: 11 },
  { id: 'i9', name: 'Nirmala Special School', category: 'social', zone: 'Wayanad', address: 'Sulthan Bathery, Wayanad, Kerala 673592', phone: '+91 4936 220077', email: 'nirmala@cmicalicut.org', year: 2007, apostolates: ['Special education', 'Inclusive care'], head: 'Fr. George Vazhappilly CMI', residents: 8 },
  { id: 'i10', name: 'Carmel Hill Monastery', category: 'house', zone: 'Nilgiris', address: 'Ooty, Tamil Nadu 643001', phone: '+91 423 2443210', email: 'carmelhill@cmicalicut.org', year: 1974, apostolates: ['Community life', 'Pastoral outreach'], head: 'Fr. Francis Karottukampil CMI', residents: 10 },
  { id: 'i11', name: 'Preshitha Bhavan Mission', category: 'mission', zone: 'Nilgiris', address: 'Gudalur, Nilgiris, Tamil Nadu 643212', phone: '+91 423 2523311', email: 'gudalur@cmicalicut.org', year: 1985, apostolates: ['Tribal mission', 'Education'], head: 'Fr. James Elavunkal CMI', residents: 7 },
  { id: 'i12', name: 'St. Chavara Mission Station', category: 'mission', zone: 'Mission', address: 'Dodoma, Tanzania', phone: '+255 26 2963000', email: 'tanzania@cmicalicut.org', year: 2010, apostolates: ['Overseas mission', 'Parish ministry'], head: 'Fr. John Kizhakkedath CMI', residents: 5 },
  { id: 'i13', name: 'Darsana Formation House', category: 'house', zone: 'Wayanad', address: 'Kalpetta, Wayanad, Kerala 673122', phone: '+91 4936 203456', email: 'darsana@cmicalicut.org', year: 1990, apostolates: ['Formation', 'Philosophy studies'], head: 'Fr. Augustine Palathingal CMI', residents: 18 },
];

// ---------------- Events (24) ----------------
const today = new Date();
function inDays(d: number) {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
}
export const events: CmiEvent[] = [
  { id: 'e1', title: 'Provincial Assembly 2026', category: 'province', date: inDays(3), time: '09:30', location: 'Provincial House, Calicut', description: 'Annual gathering of all members for reflection, reports and planning for the coming year.' },
  { id: 'e2', title: 'Feast of St. Kuriakose Elias Chavara', category: 'feast', date: inDays(6), time: '06:30', location: 'St. Joseph’s Monastery', description: 'Solemn celebration honouring the founder of the CMI congregation.' },
  { id: 'e3', title: 'Silver Jubilee — Fr. Varghese Mundadan CMI', category: 'jubilee', date: inDays(9), time: '10:00', location: 'Chavara Public School, Kannur', description: '25 years of priestly ministry.' },
  { id: 'e4', title: 'Birthday — Fr. Thomas Kattady CMI', category: 'birthday', date: inDays(1), location: 'St. Joseph’s Monastery' },
  { id: 'e5', title: 'Ordination Anniversary — Fr. Jose Puthenpurayil', category: 'anniversary', date: inDays(4) },
  { id: 'e6', title: 'Province Formation Meet', category: 'province', date: inDays(12), time: '09:00', location: 'Darsana, Wayanad', description: 'Formators and students gather for the annual formation review.' },
  { id: 'e7', title: 'Feast of St. Thomas the Apostle', category: 'feast', date: inDays(14), time: '07:00', location: 'All communities', description: 'Patronal feast of the province.' },
  { id: 'e8', title: 'Golden Jubilee — Fr. Sebastian Vadakkel CMI', category: 'jubilee', date: inDays(18), time: '10:30', location: 'Devagiri, Calicut' },
  { id: 'e9', title: 'Birthday — Fr. Antony Chirayath CMI', category: 'birthday', date: inDays(2) },
  { id: 'e10', title: 'Mission Sunday Collection', category: 'province', date: inDays(21), location: 'All parishes' },
  { id: 'e11', title: 'Feast of St. Joseph', category: 'feast', date: inDays(24), time: '06:30' },
  { id: 'e12', title: 'Birthday — Fr. Mathew Manjaly CMI', category: 'birthday', date: inDays(5) },
  { id: 'e13', title: 'Profession Anniversary — Community', category: 'anniversary', date: inDays(27) },
  { id: 'e14', title: 'Province Youth Retreat', category: 'province', date: inDays(30), time: '17:00', location: 'Preshitha Retreat Centre' },
  { id: 'e15', title: 'Feast of Sacred Heart', category: 'feast', date: inDays(33) },
  { id: 'e16', title: 'Birthday — Fr. Joseph Kalapurackal CMI', category: 'birthday', date: inDays(7) },
  { id: 'e17', title: 'Silver Jubilee — Fr. Paul Nellikunnel CMI', category: 'jubilee', date: inDays(36) },
  { id: 'e18', title: 'Council Meeting', category: 'province', date: inDays(8), time: '15:00', location: 'Provincial House' },
  { id: 'e19', title: 'Feast of St. Sebastian', category: 'feast', date: inDays(40) },
  { id: 'e20', title: 'Birthday — Fr. Francis Karottukampil CMI', category: 'birthday', date: inDays(10) },
  { id: 'e21', title: 'Anniversary — Foundation of Provincial House', category: 'anniversary', date: inDays(44) },
  { id: 'e22', title: 'Feast of St. George', category: 'feast', date: inDays(48) },
  { id: 'e23', title: 'Province Sports Day', category: 'province', date: inDays(52), time: '08:00', location: 'Devagiri Campus' },
  { id: 'e24', title: 'Diamond Jubilee — St. Joseph’s Monastery', category: 'jubilee', date: inDays(56), time: '10:00', location: 'Mananchira, Calicut' },
];

// ---------------- News (11) ----------------
const img = (id: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;
export const news: NewsArticle[] = [
  { id: 'n1', category: 'Province', headline: 'Province celebrates 70 years of service in Malabar', date: '2026-09-12', author: 'Communications Desk', summary: 'A thanksgiving Eucharist marked seven decades of educational, healthcare and pastoral service across the region.', image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=70', featured: true,
    body: ['The CMI St. Thomas Province Calicut marked a historic milestone this week as members, collaborators and well-wishers gathered to give thanks for seventy years of dedicated service.', 'From humble beginnings at St. Joseph’s Monastery, the province has grown into a network of schools, hospitals, retreat centres and mission stations spanning Kerala, Tamil Nadu and beyond.', 'In his homily, the Provincial reflected on the founder’s vision of “education for liberation” and called the community to renewed commitment in service of the poor.'] },
  { id: 'n2', category: 'Education', headline: 'Little Flower College inaugurates new science block', date: '2026-09-08', author: 'Fr. Antony Chirayath CMI', summary: 'The state-of-the-art facility will serve students across Wayanad district.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=70',
    body: ['The new three-storey science block was blessed and inaugurated in the presence of civic leaders and alumni.', 'The facility houses modern laboratories, a digital library and seminar halls designed for collaborative learning.'] },
  { id: 'n3', category: 'Mission', headline: 'Tanzania mission welcomes three new members', date: '2026-09-03', summary: 'The overseas mission continues to grow with young missionaries joining the community at Dodoma.', image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=1200&q=70',
    body: ['Three newly professed members have arrived at the St. Chavara Mission Station in Dodoma.', 'They will assist in parish ministry, education and community development initiatives.'] },
  { id: 'n4', category: 'Social', headline: 'Snehalaya marks 20 years of rehabilitation ministry', date: '2026-08-28', summary: 'Two decades of accompanying those on the path to recovery and dignity.', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=70',
    body: ['The rehabilitation centre at Mananthavady has accompanied thousands towards recovery over twenty years.', 'A commemorative gathering honoured staff, benefactors and recovered residents.'] },
  { id: 'n5', category: 'Province', headline: 'Annual retreat draws record participation', date: '2026-08-20', summary: 'Members gathered at Preshitha Retreat Centre for the province’s annual spiritual renewal.', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=70',
    body: ['The eight-day retreat focused on the theme of “Rooted in Christ, reaching out in service.”'] },
  { id: 'n6', category: 'Education', headline: 'Chavara Public School students win state science fair', date: '2026-08-14', summary: 'Young innovators bring home top honours from the state-level competition.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=70',
    body: ['A team of students presented a sustainable water-purification model that impressed the judges.'] },
  { id: 'n7', category: 'Healthcare', headline: 'Chavara Hospital launches mobile palliative care unit', date: '2026-08-06', summary: 'Bringing compassionate care to homebound patients across Tamarassery.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=70',
    body: ['The new mobile unit extends the hospital’s palliative services to remote areas.'] },
  { id: 'n8', category: 'Province', headline: 'New provincial council assumes office', date: '2026-07-30', summary: 'The newly elected leadership team begins its term of service.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70',
    body: ['The installation ceremony was held at the Provincial House with the participation of the whole community.'] },
  { id: 'n9', category: 'Vocation', headline: 'Vocation camp inspires young discerners', date: '2026-07-22', summary: 'Over sixty young men gathered to explore religious life with the CMI community.', image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=70',
    body: ['The three-day camp included prayer, sharing sessions and interaction with senior members.'] },
  { id: 'n10', category: 'Social', headline: 'Flood relief efforts reach thousands in Wayanad', date: '2026-07-15', summary: 'Communities mobilise to support families affected by monsoon flooding.', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=70',
    body: ['Relief materials and temporary shelter were provided to affected families across the district.'] },
  { id: 'n11', category: 'Education', headline: 'Digital learning initiative expands to rural schools', date: '2026-07-08', summary: 'Bridging the digital divide for students in remote areas.', image: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=1200&q=70',
    body: ['Smart classrooms have been set up in five rural schools managed by the province.'] },
];

// ---------------- Gallery ----------------
const photo = (p: string) => 'https://images.unsplash.com/photo-' + p + '?auto=format&fit=crop&w=800&q=70';
export const albums: Album[] = [
  { id: 'a1', title: 'Provincial Assembly 2026', cover: photo('1511578314322-379afb476865'), count: 24, photos: ['1511578314322-379afb476865', '1540575467063-178a50c2df87', '1475721027785-f74eccf877e2', '1523580494863-6f3031224c94'].map(photo) },
  { id: 'a2', title: 'Founder’s Feast Celebration', cover: photo('1519491050282-cf00c82424b4'), count: 18, photos: ['1519491050282-cf00c82424b4', '1508361001413-7a9dca21d08a', '1492684223066-81342ee5ff30'].map(photo) },
  { id: 'a3', title: 'Youth Retreat', cover: photo('1517486808906-6ca8b3f04846'), count: 32, photos: ['1517486808906-6ca8b3f04846', '1529070538774-1843cb3265df', '1523050854058-8df90110c9f1'].map(photo) },
  { id: 'a4', title: 'Mission Stations', cover: photo('1489493887464-892be6d1daae'), count: 15, photos: ['1489493887464-892be6d1daae', '1469571486292-0ba58a3f068b'].map(photo) },
];

// ---------------- Chavarul reflections ----------------
export const reflections: Reflection[] = [
  { id: 'r1', title: 'On the value of time', category: 'Daily life', excerpt: 'Do not waste even a single moment, for time lost is never regained…', body: ['Do not waste even a single moment, for time lost is never regained. Each hour is a gift entrusted to us by God, to be spent in prayer, in work and in loving service of one another.', 'The disciplined use of time is itself a form of prayer. When we are faithful in small things, we grow faithful in great ones.'] },
  { id: 'r2', title: 'On family harmony', category: 'Family', excerpt: 'Let peace reign in the home, for a peaceful family is a dwelling place of God…', body: ['Let peace reign in the home, for a peaceful family is a dwelling place of God. Where there is mutual forbearance and forgiveness, there the Lord abides.', 'Speak gently, listen patiently, and let no quarrel remain unhealed at the close of day.'] },
  { id: 'r3', title: 'On charity to the poor', category: 'Service', excerpt: 'Whatever you give to the poor, you give to Christ himself…', body: ['Whatever you give to the poor, you give to Christ himself. Do not turn away from the one in need, for in their face you behold the Lord.', 'Generosity is not measured by the amount given but by the love with which it is offered.'] },
  { id: 'r4', title: 'On humility', category: 'Virtue', excerpt: 'Seek not honour, but the lowest place, and God will raise you up…', body: ['Seek not honour, but the lowest place, and God will raise you up in due time. The humble heart is the soil in which grace takes root.'] },
  { id: 'r5', title: 'On perseverance in prayer', category: 'Prayer', excerpt: 'Persevere in prayer even when the heart feels dry…', body: ['Persevere in prayer even when the heart feels dry, for fidelity in darkness is more pleasing to God than fervour in consolation.'] },
  { id: 'r6', title: 'On honest work', category: 'Daily life', excerpt: 'Let your work be honest and your dealings just…', body: ['Let your work be honest and your dealings just, that your labour may be a blessing to yourself and to your neighbour.'] },
];

// ---------------- Leadership ----------------
export const leadership: Leader[] = [
  { id: 'l1', name: 'Fr. Thomas Kattady CMI', role: 'Provincial', note: 'Leads the province and its apostolic mission.' },
  { id: 'l2', name: 'Fr. Jose Puthenpurayil CMI', role: 'Vicar Provincial', note: 'Assists the Provincial in administration.' },
  { id: 'l3', name: 'Fr. Sebastian Vadakkel CMI', role: 'Provincial Councillor', note: 'Councillor for education apostolate.' },
  { id: 'l4', name: 'Fr. Antony Chirayath CMI', role: 'Provincial Councillor', note: 'Councillor for social apostolate.' },
  { id: 'l5', name: 'Fr. Varghese Mundadan CMI', role: 'Provincial Councillor', note: 'Councillor for formation.' },
  { id: 'l6', name: 'Fr. Mathew Manjaly CMI', role: 'Auditor', note: 'Oversees financial accountability.' },
];

// ---------------- Admin: user accounts, audit ----------------
export const userAccounts: UserAccount[] = members.slice(0, 24).map((m, i) => {
  const status = i === 0 ? 'active' : i % 9 === 4 ? 'locked' : i % 7 === 5 ? 'pending' : i % 11 === 8 ? 'inactive' : 'active';
  return {
    id: `u${i + 1}`,
    memberId: m.id,
    name: m.name,
    identifier: m.email,
    role: i === 0 ? 'superadmin' : 'member',
    status: status as UserAccount['status'],
    lastLogin: status === 'pending' ? undefined : `${(i % 28) + 1} Sep 2026, ${8 + (i % 12)}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60}`,
    failedAttempts: status === 'locked' ? 5 : i % 3,
  };
});

export const auditLog: AuditEntry[] = Array.from({ length: 18 }, (_, i) => {
  const actions = ['Signed in', 'Edited member record', 'Published news article', 'Unlocked account', 'Reset password', 'Imported 24 records', 'Created backup', 'Updated security policy', 'Archived member', 'Changed assignment'];
  const users = ['Fr. Thomas Kattady CMI', 'System', 'Fr. Jose Puthenpurayil CMI'];
  return {
    id: `au${i + 1}`,
    user: users[i % users.length],
    action: actions[i % actions.length],
    record: i % 2 === 0 ? members[i % members.length].name : `News #${(i % 11) + 1}`,
    date: `${(28 - (i % 20))} Sep 2026`,
    time: `${9 + (i % 10)}:${(i * 11) % 60 < 10 ? '0' : ''}${(i * 11) % 60}`,
    device: i % 3 === 0 ? 'iPhone · Calicut' : i % 3 === 1 ? 'iPad · Wayanad' : 'Android · Kannur',
  };
});

export const adminStats = {
  activeMembers: userAccounts.filter((u) => u.status === 'active').length,
  pending: userAccounts.filter((u) => u.status === 'pending').length,
  locked: userAccounts.filter((u) => u.status === 'locked').length,
  failed: 7,
  institutions: institutions.length,
  events: events.length,
  changes: 12,
  warnings: 3,
};

export { zones };
