-- CMICLT province event seed
-- This migration idempotently inserts the approved 2026 province events using the existing events schema.
-- It is intentionally data-only and does not change the application UI or router architecture.

INSERT INTO public.events (title, category, event_date, location, description)
SELECT v.title, v.category, v.event_date, v.location, v.description
FROM (
    VALUES
        (
            'Jubilee Celebration',
            'jubilee',
            DATE '2026-10-10',
            'Provincial House',
            'Jubilee Celebration at the Provincial House'
        ),
        (
            'Province level Annual Retreat',
            'province',
            DATE '2026-10-18',
            'Shatidhara Retreat Centre, Valavayal, Wayanad',
            'Province level Annual Retreat at Shatidhara Retreat Centre, Valavayal, Wayanad.'
        ),
        (
            'Major Superiors meeting',
            'province',
            DATE '2026-10-30',
            'Dharmaram College',
            'Major Superiors meeting at Dharmaram College.'
        ),
        (
            'Whole Province Gathering',
            'province',
            DATE '2026-11-14',
            'Amalapuri',
            'Whole Province Gathering at Amalapuri.'
        ),
        (
            'Canonical Visitation',
            'province',
            DATE '2026-11-01',
            'Details will be given',
            'Canonical Visitation. Details will be given.'
        ),
        (
            'Priestly Ordination: Dn Thomson Painapallil',
            'province',
            DATE '2026-12-28',
            'Nenmeni, Perinthalmanna',
            'Priestly Ordination of Dn Thomson Painapallil at Nenmeni, Perinthalmanna.'
        ),
        (
            'Priestly Ordination: Dn Jibin Otharakunnel',
            'province',
            DATE '2026-12-29',
            'Mampoyil, Kannur',
            'Priestly Ordination of Dn Jibin Otharakunnel at Mampoyil, Kannur.'
        ),
        (
            'Priestly Ordination: Dn Praveen Karedan',
            'province',
            DATE '2026-12-31',
            'Kalenja, Karnataka',
            'Priestly Ordination of Dn Praveen Karedan at Kalenja, Karnataka.'
        )
) AS v(title, category, event_date, location, description)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.events e
    WHERE e.title = v.title
      AND e.event_date = v.event_date
      AND e.location = v.location
);
