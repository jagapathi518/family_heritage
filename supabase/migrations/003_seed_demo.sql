-- ============================================================================
-- DIGITAL FAMILY HERITAGE PLATFORM
-- Migration 003: Fictional Sample Genealogy Seed Data (English & Telugu)
-- Family: The Suryanarayana Family Archive (గోదావరి సీమ సూర్యనారాయణ వంశం)
-- ============================================================================

DO $$
DECLARE
  demo_fam_id UUID := 'a0000000-0000-0000-0000-000000000001';
  
  -- Generation 1 (Grandparents / Ancestors)
  p_patriarch UUID := 'b0000000-0000-0000-0000-000000000001';
  p_matriarch UUID := 'b0000000-0000-0000-0000-000000000002';

  -- Generation 2 (Parents / Aunts / Uncles)
  p_son1 UUID := 'b0000000-0000-0000-0000-000000000003';
  p_daughter_in_law1 UUID := 'b0000000-0000-0000-0000-000000000004';
  p_daughter1 UUID := 'b0000000-0000-0000-0000-000000000005';
  p_son_in_law1 UUID := 'b0000000-0000-0000-0000-000000000006';

  -- Generation 3 (Grandchildren)
  p_grandson1 UUID := 'b0000000-0000-0000-0000-000000000007';
  p_granddaughter1 UUID := 'b0000000-0000-0000-0000-000000000008';
  p_grandson2 UUID := 'b0000000-0000-0000-0000-000000000009';

  -- Events
  e_marriage_gen1 UUID := 'c0000000-0000-0000-0000-000000000001';
  e_house_built UUID := 'c0000000-0000-0000-0000-000000000002';
  e_reunion UUID := 'c0000000-0000-0000-0000-000000000003';
BEGIN
  -- Insert Demo Family Workspace
  INSERT INTO public.families (id, name, description, is_public_preview)
  VALUES (
    demo_fam_id,
    'Suryanarayana Heritage Archive',
    'Preserving three generations of ancestral roots from Rajahmundry on the Godavari River.',
    TRUE
  ) ON CONFLICT (id) DO NOTHING;

  -- Generation 1
  INSERT INTO public.people (
    id, family_id, first_name, last_name, telugu_name, nickname, gender,
    date_of_birth, is_birth_date_approximate, date_of_death, is_deceased,
    birthplace, native_village, occupation, biography, biography_telugu,
    education, ancestral_home, favorite_memories, confidence_status
  ) VALUES
  (
    p_patriarch, demo_fam_id, 'Suryanarayana', 'Rao', 'రావు సూర్యనారాయణ', 'Peddayana (పెద్దాయన)', 'male',
    '1932-04-15', FALSE, '2012-08-20', TRUE,
    'Rajahmundry', 'Kotipalli', 'School Principal & Sanskrit Scholar',
    'Suryanarayana was a revered Sanskrit scholar and teacher in East Godavari who educated generations of students. Known for his discipline, storytelling under the banyan tree, and deep devotion.',
    'తూర్పు గోదావరి జిల్లా కోటిపల్లి గ్రామ వాస్తవ్యులు. సంస్కృత పండితులు మరియు ప్రధానోపాధ్యాయులుగా అనేక తరాల విద్యార్థులకు మార్గదర్శనం చేశారు.',
    'M.A. Sanskrit, Andhra University', 'Kotipalli Agraharam, East Godavari',
    'Reciting Mahabharata verses during evening gatherings on the house verandah.', 'verified'
  ),
  (
    p_matriarch, demo_fam_id, 'Annapurna', 'Rao', 'రావు అన్నపూర్ణమ్మ', 'Amma (అమ్మ)', 'female',
    '1936-09-10', FALSE, '2018-03-14', TRUE,
    'Kakinada', 'Kotipalli', 'Homemaker & Classical Vocalist',
    'Annapurna was the heart of the joint family. Her recipes for mango pickles and evening bhajans brought warmth to everyone visiting the ancestral house.',
    'ఆప్యాయతకు మారుపేరు. సాంప్రదాయ వంటలు, గోదావరి రుచులు మరియు సంగీతంలో ప్రవీణురాలు.',
    'Traditional music training under Guru Sitaramayya', 'Kotipalli Agraharam',
    'Hosting 40+ relatives during Sankranti festival feasts every winter.', 'verified'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Generation 2
  INSERT INTO public.people (
    id, family_id, first_name, last_name, telugu_name, nickname, gender,
    date_of_birth, is_birth_date_approximate, is_deceased,
    birthplace, native_village, occupation, biography, biography_telugu,
    education, ancestral_home, confidence_status
  ) VALUES
  (
    p_son1, demo_fam_id, 'Venkateswara', 'Rao', 'రావు వెంకటేశ్వరరావు', 'Venkat', 'male',
    '1960-06-22', FALSE, FALSE,
    'Kotipalli', 'Kotipalli', 'Irrigation Engineer',
    'Built irrigation canals across Andhra Pradesh. Preserved all ancestral land records and documents in brass boxes.',
    'నీటిపారుదల శాఖలో ఇంజనీరుగా పనిచేశారు. కుటుంబ చరిత్ర పత్రాలను భద్రపరిచారు.',
    'B.Tech Civil Engineering, JNTU Kakinada', 'Kotipalli', 'verified'
  ),
  (
    p_daughter_in_law1, demo_fam_id, 'Sujatha', 'Rao', 'రావు సుజాత', 'Sujatha', 'female',
    '1965-02-18', FALSE, FALSE,
    'Vijayawada', 'Kotipalli', 'Botanist & Organic Farmer',
    'Nurtured the family coconut and mango orchards along the river canal.',
    'వృక్షశాస్త్రవేత్త మరియు ప్రకృతి వ్యవసాయదారురాలు.',
    'M.Sc Botany, Acharya Nagarjuna University', 'Kotipalli', 'verified'
  ),
  (
    p_daughter1, demo_fam_id, 'Lakshmi', 'Sharma', 'శర్మ లక్ష్మి', 'Chitti', 'female',
    '1963-11-05', FALSE, FALSE,
    'Kotipalli', 'Kotipalli', 'High School Teacher',
    'Beloved mathematics teacher who inspired hundreds of rural girls to pursue STEM careers.',
    'గణిత శాస్త్ర ఉపాధ్యాయురాలు. ఎందరో గ్రామీణ విద్యార్థినులకు ఉన్నత విద్యను అందించారు.',
    'M.Sc, B.Ed, Osmania University', 'Hyderabad', 'verified'
  ),
  (
    p_son_in_law1, demo_fam_id, 'Ramana', 'Sharma', 'శర్మ రమణ', 'Ramana Murthy', 'male',
    '1958-08-12', FALSE, FALSE,
    'Visakhapatnam', 'Kotipalli', 'Bank Manager (Retd)',
    'Served in Andhra Bank for 35 years across various coastal towns.',
    'ఆంధ్రా బ్యాంకులో 35 సంవత్సరాలు మేనేజరుగా పనిచేశారు.',
    'B.Com, CAIIB', 'Visakhapatnam', 'verified'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Generation 3
  INSERT INTO public.people (
    id, family_id, first_name, last_name, telugu_name, nickname, gender,
    date_of_birth, is_birth_date_approximate, is_deceased,
    birthplace, native_village, occupation, biography, biography_telugu,
    education, ancestral_home, confidence_status
  ) VALUES
  (
    p_grandson1, demo_fam_id, 'Aditya', 'Rao', 'రావు ఆదిత్య', 'Aadi', 'male',
    '1992-05-14', FALSE, FALSE,
    'Hyderabad', 'Kotipalli', 'Software Architect & Historian',
    'Passionate about digitizing family folklore and oral oral genealogies.',
    'సాఫ్ట్‌వేర్ ఆర్కిటెక్ట్ మరియు కుటుంబ చరిత్ర పరిశోధకులు.',
    'M.S. Computer Science', 'Hyderabad / San Jose', 'verified'
  ),
  (
    p_granddaughter1, demo_fam_id, 'Ananya', 'Rao', 'రావు అనన్య', 'Anu', 'female',
    '1996-10-28', FALSE, FALSE,
    'Hyderabad', 'Kotipalli', 'Doctor (Pediatrician)',
    'Serving children in healthcare; loves painting Godavari river landscapes.',
    'చిన్నపిల్లల వైద్యురాలు. చిత్రలేఖనం పట్ల మక్కువ.',
    'M.B.B.S, M.D. Pediatrics', 'Hyderabad', 'verified'
  ),
  (
    p_grandson2, demo_fam_id, 'Karthik', 'Sharma', 'శర్మ కార్తీక్', 'Kittu', 'male',
    '1994-03-19', FALSE, FALSE,
    'Visakhapatnam', 'Kotipalli', 'Civil Architect',
    'Designs sustainable houses influenced by traditional South Indian courtyards.',
    'ఆర్కిటెక్ట్ - సాంప్రదాయ వాస్తు శిల్ప కళాకారులు.',
    'B.Arch, SPA Vijayawada', 'Bengaluru', 'verified'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Relationships
  -- Generation 1 Spouse
  INSERT INTO public.relationships (family_id, person1_id, person2_id, relationship_type, marriage_date)
  VALUES (demo_fam_id, p_patriarch, p_matriarch, 'spouse', '1955-05-12')
  ON CONFLICT DO NOTHING;

  -- Generation 1 -> Gen 2 Parent-Child
  INSERT INTO public.relationships (family_id, person1_id, person2_id, relationship_type)
  VALUES
    (demo_fam_id, p_patriarch, p_son1, 'parent_child'),
    (demo_fam_id, p_matriarch, p_son1, 'parent_child'),
    (demo_fam_id, p_patriarch, p_daughter1, 'parent_child'),
    (demo_fam_id, p_matriarch, p_daughter1, 'parent_child')
  ON CONFLICT DO NOTHING;

  -- Generation 2 Spouses
  INSERT INTO public.relationships (family_id, person1_id, person2_id, relationship_type, marriage_date)
  VALUES
    (demo_fam_id, p_son1, p_daughter_in_law1, 'spouse', '1989-08-24'),
    (demo_fam_id, p_daughter1, p_son_in_law1, 'spouse', '1988-12-10')
  ON CONFLICT DO NOTHING;

  -- Generation 2 -> Gen 3 Parent-Child
  INSERT INTO public.relationships (family_id, person1_id, person2_id, relationship_type)
  VALUES
    (demo_fam_id, p_son1, p_grandson1, 'parent_child'),
    (demo_fam_id, p_daughter_in_law1, p_grandson1, 'parent_child'),
    (demo_fam_id, p_son1, p_granddaughter1, 'parent_child'),
    (demo_fam_id, p_daughter_in_law1, p_granddaughter1, 'parent_child'),
    (demo_fam_id, p_daughter1, p_grandson2, 'parent_child'),
    (demo_fam_id, p_son_in_law1, p_grandson2, 'parent_child')
  ON CONFLICT DO NOTHING;

  -- Timeline Events
  INSERT INTO public.events (id, family_id, title, title_telugu, event_type, event_date, description, location)
  VALUES
    (e_marriage_gen1, demo_fam_id, 'Ancestral Wedding at Kakinada', 'కాకినాడలో పెద్దల వివాహ మహోత్సవం', 'marriage', '1955-05-12', 'Grand wedding celebrated with classical nadaswaram on the banks of the canal.', 'Kakinada'),
    (e_house_built, demo_fam_id, 'Construction of Ancestral Courtyard House', 'కోటిపల్లి ప్రాచీన గృహ నిర్మాణం', 'home_built', '1968-02-15', 'Traditional Manduva house built with red teak pillars and central sky courtyard.', 'Kotipalli'),
    (e_reunion, demo_fam_id, 'Centennial Heritage Family Reunion', 'శత వసంతాల కుటుంబ సమ్మేళనం', 'reunion', '2010-01-14', 'Over 70 descendants and relatives gathered for Sankranti at the ancestral house.', 'Kotipalli')
  ON CONFLICT (id) DO NOTHING;

  -- Memories
  INSERT INTO public.memories (family_id, title, content, content_telugu, memory_date, person_id, contributor_name)
  VALUES
    (demo_fam_id, 'Grandmother Annapurnas Sankranti Sweets', 'Every January, Amma would awaken before dawn to make ariselu and sunnundalu in giant brass pans.', 'ప్రతి సంక్రాంతికి తెల్లవారుజామునే లేచి పిండివంటలు తయారు చేసే మధుర జ్ఞాపకం.', '2005-01-14', p_matriarch, 'Aditya Rao'),
    (demo_fam_id, 'The Evening Story Hours on the Verandah', 'Tataiah would gather all the grandchildren under the lantern and narrate historical stories from Vijayanagara history.', 'సాయంత్రం దీపం వెలుగులో తాతయ్య చెప్పిన విజయనగర సామ్రాజ్య చారిత్రక కథలు.', '2002-06-10', p_patriarch, 'Ananya Rao')
  ON CONFLICT DO NOTHING;

END $$;
