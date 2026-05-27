# Domínio personalizado no login Google (Supabase Auth)

Por defeito o Google mostra **«Continuar para hmhzeyfuruemdqmdgqxt.supabase.co»**.  
Com um **custom domain** no Supabase passa a mostrar algo como **«Continuar para auth.wcup26predictor.com»**.

## Requisitos

- Plano **Supabase pago** (Pro ou superior) + add-on **Custom Domain**
- Subdomínio no Namecheap (recomendado: `auth.wcup26predictor.com`, não o apex `@`)

O site em `www.wcup26predictor.com` (Vercel) **mantém-se**; só o Auth/API do Supabase usa o subdomínio.

---

## Passo 1 — Namecheap (DNS)

Em **Advanced DNS** para `wcup26predictor.com`:

| Tipo | Host | Valor |
|------|------|--------|
| **CNAME** | `auth` | `hmhzeyfuruemdqmdgqxt.supabase.co.` |

(Alguns painéis acrescentam o domínio ao host — usa só `auth` se for o caso.)

Guarda. A verificação TXT do Supabase aparece no passo 2.

---

## Passo 2 — Supabase Dashboard

1. https://supabase.com/dashboard/project/hmhzeyfuruemdqmdgqxt/settings/general  
2. Secção **Custom Domains** → **Set up custom domain**  
3. Hostname: `auth.wcup26predictor.com`  
4. Copia os registos **TXT** (`_acme-challenge.auth…`) que o dashboard pedir e adiciona no Namecheap  
5. Clica **Verify** / **Activate** e espera o certificado SSL (até ~30 min)

---

## Passo 3 — Google Cloud Console

https://console.cloud.google.com/apis/credentials → o teu OAuth client **Web application**

**Authorized redirect URIs** — mantém o antigo e **adiciona**:

```
https://auth.wcup26predictor.com/auth/v1/callback
```

```
https://hmhzeyfuruemdqmdgqxt.supabase.co/auth/v1/callback
```

**Authorized JavaScript origins** (se ainda não tiveres):

```
https://www.wcup26predictor.com
https://auth.wcup26predictor.com
```

Guarda.

Opcional (branding): **OAuth consent screen** → nome da app **WC26 Predictor**, logo, homepage `https://www.wcup26predictor.com`.

---

## Passo 4 — Vercel (depois do domínio ativo)

Em **Environment Variables** (Production + Development), atualiza:

```
NEXT_PUBLIC_SUPABASE_URL=https://auth.wcup26predictor.com
```

(`NEXT_PUBLIC_SUPABASE_ANON_KEY` mantém-se igual.)

Redeploy.

---

## Passo 5 — Testar

1. Janela anónima → https://www.wcup26predictor.com/login  
2. **Continue with Google**  
3. O ecrã Google deve referir **`auth.wcup26predictor.com`** (ou o hostname que configuraste)  
4. Voltas ao site logado

---

## Alternativa mais barata (ainda mostra supabase.co)

**Vanity subdomain** (ex. `wcup26predictor.supabase.co`) — plano pago, só CLI, continua a dizer `.supabase.co`.  
Não resolve o problema do teu amigo; só o **custom domain** no teu domínio resolve.

---

## Código

Não é obrigatório alterar código: `signInWithOAuth` e `/auth/callback` na app mantêm-se.  
Só mudas `NEXT_PUBLIC_SUPABASE_URL` no Vercel quando o domínio Supabase estiver ativo.
