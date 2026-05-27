# Custom domain — wcup26predictor.com

## Done automatically (Vercel + code)

- DNS: `www` → Vercel CNAME, `@` → A `76.76.21.21`
- Production: https://www.wcup26predictor.com
- `NEXT_PUBLIC_SITE_URL` on Vercel (Production + Development)

## Supabase Auth (manual — requires dashboard token)

Open: https://supabase.com/dashboard/project/hmhzeyfuruemdqmdgqxt/auth/url-configuration

| Field | Value |
|-------|--------|
| **Site URL** | `https://www.wcup26predictor.com` |
| **Redirect URLs** | `https://www.wcup26predictor.com/auth/callback` |
| | `https://wcup26predictor.com/auth/callback` |
| | `http://localhost:3000/auth/callback` |

Or add `SUPABASE_ACCESS_TOKEN` to `.env.local` and run:

```bash
npm run update:supabase-auth-urls
```

## Google OAuth — «Continuar para supabase.co»

Por defeito o Google mostra o domínio `*.supabase.co`. Para mostrar o teu domínio (ex. `auth.wcup26predictor.com`), segue:

**[docs/SUPABASE_AUTH_CUSTOM_DOMAIN.md](./SUPABASE_AUTH_CUSTOM_DOMAIN.md)**

Enquanto não ativares custom domain, o callback no Google Cloud mantém-se:

`https://hmhzeyfuruemdqmdgqxt.supabase.co/auth/v1/callback`

## Verify

1. https://www.wcup26predictor.com loads
2. https://wcup26predictor.com redirects to www
3. Login → Continue with Google works after Supabase URLs are saved
