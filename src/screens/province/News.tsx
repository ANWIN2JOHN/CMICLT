import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Newspaper, Share2 } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { SearchField } from '../../components/ui/Input';
import { FilterChip } from '../../components/ui/primitives';
import { NewsCard } from '../../components/patterns/cards';
import { Button, IconButton } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/states';
import { useToast } from '../../components/ui/overlays';
import { news } from '../../data/content';
import { useLocale } from '../../contexts/LocaleContext';

export function News() {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set(news.map((n) => n.category))), []);
  const featured = news.find((n) => n.featured) ?? news[0];

  const results = useMemo(() => news.filter((n) => {
    if (query && !`${n.headline} ${n.summary} ${n.category}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (cat && n.category !== cat) return false;
    return true;
  }), [query, cat]);

  return (
    <Screen title={t('news.title')} back>
      <SearchField value={query} placeholder="Search news…" onChange={(e) => setQuery(e.target.value)} />
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
        {categories.map((c) => <FilterChip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</FilterChip>)}
      </div>

      {!query && !cat && (
        <div className="mt-5">
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink2">{t('news.featured')}</p>
          <NewsCard article={featured} />
        </div>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {results.filter((n) => query || cat || n.id !== featured.id).map((a) => <NewsCard key={a.id} article={a} compact />)}
      </div>
      {results.length === 0 && <EmptyState icon={<Newspaper size={26} />} title={t('news.empty')} />}
    </Screen>
  );
}

export function NewsArticle() {
  const { t } = useLocale();
  const { id } = useParams();
  const nav = useNavigate();
  const { notify } = useToast();
  const a = news.find((n) => n.id === id);
  if (!a) return <Screen title={t('news.title')} back><EmptyState title="Not found" /></Screen>;
  const related = news.filter((n) => n.category === a.category && n.id !== a.id).slice(0, 3);

  return (
    <Screen back title={a.category} right={<IconButton label={t('common.share')} onClick={() => notify('Link copied')}><Share2 size={20} /></IconButton>}>
      <img src={a.image} alt="" className="h-52 w-full rounded-[var(--r-card)] object-cover" />
      <span className="mt-4 inline-block text-[13px] font-semibold text-primary">{a.category}</span>
      <h1 className="mt-1 font-head text-[26px] font-bold leading-tight text-ink">{a.headline}</h1>
      <p className="mt-2 text-[13px] text-ink2">
        {new Date(a.date).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}{a.author ? ` · ${a.author}` : ''}
      </p>
      <div className="mt-5 space-y-4">
        {a.body.map((p, i) => <p key={i} className="text-[16px] leading-[1.7] text-ink">{p}</p>)}
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-[17px] font-semibold text-ink">{t('news.related')}</h2>
          <div className="space-y-2.5">{related.map((r) => <NewsCard key={r.id} article={r} compact />)}</div>
        </div>
      )}
      <Button variant="outline" fullWidth className="mt-6" leftIcon={<Share2 size={18} />} onClick={() => notify('Link copied')}>{t('common.share')}</Button>
    </Screen>
  );
}
