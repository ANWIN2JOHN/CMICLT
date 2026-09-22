import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Compass, HandHeart, Sparkles, X } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, SectionHeader, StatusChip } from '../../components/ui/primitives';
import { TextInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SuccessState } from '../../components/ui/states';
import { useToast } from '../../components/ui/overlays';
import { albums, reflections } from '../../data/content';
import { useLocale } from '../../contexts/LocaleContext';
import { whatsappLink } from '../../lib/contact';
import { cn } from '../../lib/cn';

/* ---------------- Gallery ---------------- */
export function Gallery() {
  const { t } = useLocale();
  const [album, setAlbum] = useState<string | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const current = albums.find((a) => a.id === album);

  if (current) {
    return (
      <Screen back title={current.title}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {current.photos.map((p, i) => (
            <button key={i} onClick={() => setViewer(i)} className="press overflow-hidden rounded-[16px]">
              <img src={p} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
        {viewer !== null && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black">
            <button aria-label="Close" onClick={() => setViewer(null)} className="absolute right-3 top-[calc(12px+var(--safe-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"><X size={24} /></button>
            <div className="flex flex-1 items-center justify-center">
              <img src={current.photos[viewer]} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-between px-4 pb-[calc(20px+var(--safe-bottom))] text-white">
              <button aria-label="Previous" disabled={viewer === 0} onClick={() => setViewer((v) => (v! > 0 ? v! - 1 : v))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 disabled:opacity-30"><ChevronLeft size={24} /></button>
              <span className="text-[14px]">{viewer + 1} / {current.photos.length}</span>
              <button aria-label="Next" disabled={viewer === current.photos.length - 1} onClick={() => setViewer((v) => (v! < current.photos.length - 1 ? v! + 1 : v))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 disabled:opacity-30"><ChevronRight size={24} /></button>
            </div>
          </div>
        )}
      </Screen>
    );
  }

  return (
    <Screen back title={t('gallery.title')}>
      <SectionHeader title={t('gallery.albums')} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {albums.map((a) => (
          <button key={a.id} onClick={() => setAlbum(a.id)} className="press overflow-hidden rounded-[var(--r-card)] border border-line bg-card text-left">
            <img src={a.cover} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-3">
              <p className="line-clamp-1 text-[14px] font-medium text-ink">{a.title}</p>
              <p className="text-[12px] text-ink2">{a.count} photos</p>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

/* ---------------- Vocation ---------------- */
export function Vocation() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [sent, setSent] = useState(false);
  const pillars = [
    { icon: Compass, key: 'vocation.discern', body: 'Explore whether God may be calling you to religious life through prayer and reflection.' },
    { icon: HandHeart, key: 'vocation.connect', body: 'Reach out to our vocation team to share your questions and journey.' },
    { icon: Sparkles, key: 'vocation.begin', body: 'Take the first steps into formation with the guidance of experienced mentors.' },
  ];
  const stages = ['Aspirancy', 'Postulancy', 'Novitiate', 'Philosophy', 'Regency', 'Theology', 'Ordination'];

  return (
    <Screen back title={t('vocation.title')}>
      <div className="overflow-hidden rounded-[var(--r-card)]">
        <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=60" alt="" className="h-40 w-full object-cover" />
      </div>
      <p className="mt-5 text-[16px] leading-relaxed text-ink">Is God calling you to a life of prayer, community and service? We would love to walk with you.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.key} className="p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emeraldl text-emerald"><p.icon size={22} /></span>
            <h3 className="mt-3 font-head text-[18px] font-semibold text-ink">{t(p.key as any)}</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-ink2">{p.body}</p>
          </Card>
        ))}
      </div>

      <SectionHeader title={t('vocation.stages')} />
      <Card className="mb-6 p-4">
        <ol className="relative ml-1 border-l-2 border-line pl-5">
          {stages.map((s, i) => (
            <li key={s} className="relative pb-4 last:pb-0">
              <span className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-gold" />
              <p className="text-[15px] font-medium text-ink">{s}</p>
            </li>
          ))}
        </ol>
      </Card>

      <SectionHeader title={t('vocation.enquiry')} />
      {sent ? (
        <Card className="p-2"><SuccessState title="Thank you" body="Our vocation team will be in touch with you soon." /></Card>
      ) : (
        <Card className="space-y-3 p-4">
          <TextInput label={t('contact.name')} placeholder="Your name" />
          <TextInput label={t('common.email')} placeholder="you@example.com" inputMode="email" />
          <TextInput label={t('contact.message')} placeholder="Tell us a little about yourself" />
          <Button fullWidth onClick={() => { setSent(true); notify('Enquiry sent'); }}>{t('contact.send')}</Button>
        </Card>
      )}
    </Screen>
  );
}

/* ---------------- Chavarul ---------------- */
export function Chavarul() {
  const { t } = useLocale();
  const { id } = useParams();
  const { notify } = useToast();
  if (id) {
    const r = reflections.find((x) => x.id === id);
    if (!r) return <Screen back title={t('chavarul.title')} />;
    return (
      <Screen back title={t('chavarul.title')} right={
        <button aria-label={t('chavarul.bookmark')} onClick={() => notify('Bookmarked')} className="press mr-1 flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-card2"><Bookmark size={20} /></button>
      }>
        <div className="mx-auto max-w-[640px]">
          <StatusChip tone="gold">{r.category}</StatusChip>
          <h1 className="mt-3 font-head text-[27px] font-bold leading-tight text-ink">{r.title}</h1>
          <div className="mt-5 space-y-5">
            {r.body.map((p, i) => <p key={i} className="font-head text-[18px] leading-[1.85] text-ink">{p}</p>)}
          </div>
          <p className="mt-8 border-t border-line pt-4 text-[13px] text-ink2">— St. Kuriakose Elias Chavara</p>
        </div>
      </Screen>
    );
  }
  const featured = reflections[0];
  return (
    <Screen back title={t('chavarul.title')}>
      <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-ink2">{t('chavarul.featured')}</p>
      <Card onClick={() => (window.location.href = `#/chavarul/${featured.id}`)} className="border-gold/30 bg-goldl p-5">
        <StatusChip tone="gold">{featured.category}</StatusChip>
        <h2 className="mt-2.5 font-head text-[22px] font-semibold leading-snug text-ink">{featured.title}</h2>
        <p className="mt-2 font-head text-[16px] italic leading-relaxed text-ink2">{featured.excerpt}</p>
      </Card>
      <div className="mt-6 space-y-2.5">
        {reflections.slice(1).map((r) => (
          <Card key={r.id} onClick={() => (window.location.href = `#/chavarul/${r.id}`)} className="p-4">
            <StatusChip tone="primary">{r.category}</StatusChip>
            <h3 className="mt-2 font-head text-[18px] font-semibold text-ink">{r.title}</h3>
            <p className="mt-1 line-clamp-2 text-[14px] text-ink2">{r.excerpt}</p>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [sent, setSent] = useState(false);
  const addr = 'CMI Provincial House, Mananchira, Calicut, Kerala 673001';
  return (
    <Screen back title={t('contact.title')}>
      <Card className="p-5">
        <h2 className="font-head text-[19px] font-semibold text-ink">Provincial House</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink2">{addr}</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Button variant="secondary" onClick={() => (window.location.href = 'tel:+914952701234')}>{t('common.call')}</Button>
          <Button variant="secondary" onClick={() => window.open(whatsappLink('+914952701234'), '_blank')}>{t('common.whatsapp')}</Button>
          <Button variant="secondary" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(addr)}`)}>{t('common.openMap')}</Button>
        </div>
        <p className="mt-4 text-[13px] text-ink2"><span className="font-medium text-ink">{t('contact.officeHours')}:</span> Mon–Sat, 9:00 AM – 5:00 PM</p>
      </Card>

      <div className="mt-6">
        <SectionHeader title={t('contact.title')} />
        {sent ? (
          <Card className="p-2"><SuccessState title={t('state.success')} body={t('contact.success')} actionLabel={t('common.done')} onAction={() => setSent(false)} /></Card>
        ) : (
          <Card className="space-y-3 p-4">
            <TextInput label={t('contact.name')} placeholder="Your name" />
            <TextInput label={t('common.email')} placeholder="you@example.com" inputMode="email" />
            <TextInput label={t('contact.subject')} placeholder="Subject" />
            <TextInput label={t('contact.message')} placeholder="How can we help?" />
            <Button fullWidth onClick={() => { setSent(true); notify('Message sent'); }}>{t('contact.send')}</Button>
          </Card>
        )}
      </div>
    </Screen>
  );
}
