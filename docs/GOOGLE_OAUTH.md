# Google OAuth — WC26 Predictor

O código já suporta **Continue with Google** em `/login` e `/register`. Falta ativar no **Google Cloud** e no **Supabase** (não se faz só no código).

## URLs do teu projeto

| Onde | URL |
|------|-----|
| Supabase Auth callback (Google Cloud) | `https://hmhzeyfuruemdqmdgqxt.supabase.co/auth/v1/callback` |
| App callback (Supabase → URL Configuration) | `https://www.wcup26predictor.com/auth/callback` |
| Local dev | `http://localhost:3000/auth/callback` |
| Site URL (Supabase) | `https://www.wcup26predictor.com` |

---

## Passo 1 — Google Cloud Console

1. Abre https://console.cloud.google.com/apis/credentials  
2. Cria ou escolhe um projeto  
3. **+ Create Credentials** → **OAuth client ID**  
4. Tipo: **Web application**  
5. Nome: `WC26 Predictor`  
6. **Authorized redirect URIs** — adiciona **exatamente**:
   ```
   https://hmhzeyfuruemdqmdgqxt.supabase.co/auth/v1/callback
   ```
7. Guarda e copia **Client ID** e **Client Secret**

Se a app estiver em modo **Testing**, adiciona os teus emails em **OAuth consent screen → Test users**.

---

## Passo 2 — Supabase Dashboard

1. Abre https://supabase.com/dashboard/project/hmhzeyfuruemdqmdgqxt/auth/providers  
2. **Google** → liga **Enable**  
3. Cola **Client ID** e **Client Secret** → **Save**

### URL Configuration

https://supabase.com/dashboard/project/hmhzeyfuruemdqmdgqxt/auth/url-configuration

| Campo | Valor |
|-------|--------|
| Site URL | `https://www.wcup26predictor.com` |
| Redirect URLs (uma por linha) | `https://www.wcup26predictor.com/auth/callback` |
| | `https://wcup26predictor.com/auth/callback` |
| | `https://mundial-predictor.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

---

## Passo 3 — Vercel (opcional mas recomendado)

Em **Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://www.wcup26predictor.com
```

Redeploy após guardar.

---

## Testar

1. Produção: https://www.wcup26predictor.com/login → **Continue with Google**  
2. Local: `npm run dev` → http://localhost:3000/login  

Fluxo esperado: Google → Supabase → `/auth/callback` → home (ou `?next=` se vinhas de uma página protegida).

---

## Erros comuns

| Sintoma | Solução |
|---------|---------|
| `provider is not enabled` | Ativar Google no Supabase (Passo 2) |
| `redirect_uri_mismatch` | URI no Google Cloud deve ser a do Supabase (`.../auth/v1/callback`), não a da app |
| Volta ao login com `?error=auth` | Redirect URL em falta no Supabase URL Configuration |
| Nome no ranking estranho | Normal na 1.ª vez; o trigger `handle_new_user` usa nome Google ou email |

---

## Código relevante

- `app/login/page.tsx` — botão Google  
- `app/register/page.tsx` — botão Google  
- `app/auth/callback/route.ts` — troca `code` por sessão  
- `lib/auth-oauth.ts` — URLs de redirect  
- `lib/auth-errors.ts` — mensagens amigáveis  
