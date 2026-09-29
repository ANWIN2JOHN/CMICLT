-- CMICLT St. Thomas Province Administration Seed
-- This migration idempotently inserts the 6 administration members into the existing member_assignments structure.
-- It matches existing members by name and avoids duplicating member records.

DO $$ 
DECLARE
  v_biju UUID;
  v_peter UUID;
  v_sanish UUID;
  v_jose UUID;
  v_siby UUID;
  v_binesh UUID;
BEGIN
  -- 1. Locate the six existing members
  SELECT id INTO v_biju FROM public.members WHERE name ILIKE '%Biju John Vellakada%' AND archived_at IS NULL LIMIT 1;
  SELECT id INTO v_peter FROM public.members WHERE name ILIKE '%Peter Marottikkathadam%' AND archived_at IS NULL LIMIT 1;
  SELECT id INTO v_sanish FROM public.members WHERE name ILIKE '%Sanish Chuzhanayil%' AND archived_at IS NULL LIMIT 1;
  SELECT id INTO v_jose FROM public.members WHERE name ILIKE '%Jose Prakash Chelackal%' AND archived_at IS NULL LIMIT 1;
  SELECT id INTO v_siby FROM public.members WHERE name ILIKE '%Siby Pulickal%' AND archived_at IS NULL LIMIT 1;
  SELECT id INTO v_binesh FROM public.members WHERE name ILIKE '%Binesh Kizhakkepurackal%' AND archived_at IS NULL LIMIT 1;

  -- 2. Insert assignments idempotently (ensuring we don't duplicate the same assignment)
  IF v_biju IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_biju AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_biju, 'Provincial', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;

  IF v_peter IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_peter AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_peter, 'Vicar Provincial, Councillor for Evangelization & Pastoral Ministry', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;
  
  IF v_sanish IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_sanish AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_sanish, 'Councillor for Education & Communication Media', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;

  IF v_jose IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_jose AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_jose, 'Councillor for Social Apostolate & Healthcare', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;

  IF v_siby IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_siby AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_siby, 'Councillor for Finance and Agriculture', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;

  IF v_binesh IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.member_assignments WHERE member_id = v_binesh AND place = 'St. Thomas Province Administration' AND to_date IS NULL) THEN
      INSERT INTO public.member_assignments (member_id, role, place, from_date, to_date)
      VALUES (v_binesh, 'Auditor', 'St. Thomas Province Administration', '2026-01-01', NULL);
    END IF;
  END IF;
END $$;
