export const getSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !anonKey.includes('placeholder') &&
    !anonKey.includes('your-anon-key')
  );

  return {
    url,
    anonKey,
    isConfigured,
  };
};

export const SUPABASE_SETUP_INSTRUCTIONS = `
### Supabase Configuration Required
To connect your production or local database:
1. Create a project at https://supabase.com
2. Copy your Project URL and Anon API key from Project Settings > API.
3. Create a \`.env.local\` file in the root folder with:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
4. Run the SQL migrations from \`supabase/migrations/\` in the Supabase SQL Editor.
5. In the meantime, you can explore the fully interactive **Live Demonstration** using fictional multi-generational data.
`;
