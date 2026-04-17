# MonteKristo Onboarding Portal

Interni command center za MK tim. Cist CRUD nad Supabase tabelama — podaci se unose u formu i cuvaju "as-is" u bazi. **Bez AI zavisnosti, bez externih API key-eva.**

**Samo za interno koriscenje.** Deploy-uje se kao ruta `/onboarding/*` na `montekristobelgrade.com`.

---

## Feature set

- 15 pre-seeded klijenata + "Dodaj klijenta" flow
- 11 tabova po klijentu: Overview, Biznis & Marketing, Web presence, Integracije, Deliverables (Kanban sa skill launchers), Brand voice, Kontakti, Dokumenti, Performance (Recharts), Otvorena pitanja, Activity
- Dashboard: 4 KPI stat-a, mini portfolio heatmap, global activity feed, client grid sa Health scores i sparkline-ima
- Portfolio heatmap: client × service matrix sortiran po health score-u
- Client Health Score: 0-100, deriviran iz blokera, otvorenih pitanja, dana bez ship-a, data completeness
- Global CMD+K command palette (cmdk)
- Dark "command center" dizajn sa glass cards, framer-motion transitions
- Debounced save na svim poljima (600ms) sa saving/saved/error badge-om
- Inline audit log (per-klijent + globalni)
- Skill launchers na deliverables: copy Claude Code prompt u clipboard za `/blog write`, `/montekristo-website`, `/retell-agent-builder`, `/meta-ads`, `/seo-audit`, itd.
- Auto-enrichment Web presence polja iz URL-a (PageSpeed + OG + CMS detection) — bez AI, bez API key-a

---

## Arhitektura

```
src/pages/onboarding/
├── theme.ts                      ← design tokens + health/status/service helpers
├── components/
│   ├── primitives.tsx            ← Surface, Section, StatBlock, Pill, HealthRing, Sparkline, Skeleton, EmptyState, Kbd
│   ├── Layout.tsx                ← sidebar + topbar + breadcrumbs
│   └── CommandPalette.tsx        ← cmdk-powered CMD+K palette
├── Dashboard.tsx                 ← KPI stats + heatmap + activity feed + client grid
├── Portfolio.tsx                 ← full portfolio heatmap
├── ActivityAll.tsx               ← global activity audit log
├── ClientDetail.tsx              ← hero + 11 tabs
├── OnboardingLogin.tsx
├── NewClient.tsx
├── OnboardingRoutes.tsx
└── tabs/                         ← 11 tabs, dark theme, inline debounced save
    ├── OverviewTab.tsx
    ├── BusinessTab.tsx
    ├── WebPresenceTab.tsx        ← + auto-enrichment button
    ├── IntegrationsTab.tsx       ← categorized + secret-masking
    ├── DeliverablesTab.tsx       ← Kanban + skill launchers
    ├── BrandVoiceTab.tsx
    ├── ContactsTab.tsx
    ├── DocumentsTab.tsx
    ├── PerformanceTab.tsx        ← Recharts
    ├── OpenQuestionsTab.tsx
    └── ActivityTab.tsx

src/lib/mk-onboarding/
├── supabase.ts                   ← dedicated Supabase client (mk-onboarding project)
├── useAuth.ts                    ← session hook
├── useClientData.ts              ← aggregate signals via react-query
├── useSavedField.tsx             ← debounced save + status badge
├── healthScore.ts                ← derived 0-100 health metric
├── buildClientContext.ts         ← edgeFnUrl + EDGE_FN_ANON helpers
└── skillLauncher.ts              ← deliverable type → Claude Code prompt

supabase/functions/
└── mk-enrich-web/index.ts        ← PageSpeed + OG scraper + CMS fingerprint (no external API key)
```

---

## Deploy edge fn

Jedna edge funkcija je u upotrebi (`mk-enrich-web`), koristi free-tier PageSpeed Insights i HTML scraping. Ne zahteva nikakve API key-eve.

```bash
cd supabase/functions
./deploy-edge-fns.sh
```

Opcionalno: `supabase secrets set PAGESPEED_API_KEY=AIza... --project-ref tydafqhnzxmrpnclaxnl` ako ti treba veci PSI quota.

---

## Vault sync

Hourly LaunchAgent + `_internal/scripts/sync-vault.ts` (u MK AI repo-u). Auto-commit-uje u `MonteKristo Vault/context/clients/`.

---

## Lokalni razvoj

```bash
cd /Users/milanmandic/Desktop/montekristo-web-forge
npm install
npm run dev  # http://localhost:8080/onboarding/login
```

---

## Data model

12 Supabase tabela pod `mk_` prefixom u projektu `tydafqhnzxmrpnclaxnl`:

- `mk_team_members` — whitelist kolega sa pristupom
- `mk_clients` — osnovni profil
- `mk_client_contacts` — vise kontakata po klijentu
- `mk_client_integrations` — GHL/Retell/n8n/CF/Stripe IDs sa secret flag-om
- `mk_client_deliverables` — Kanban po statusu
- `mk_client_brand_voice` — tone, banned vocab, required phrases, persona, ICP
- `mk_client_marketing_audit` — positioning, channels, offers, bottlenecks, growth ideas
- `mk_client_web_presence` — domain, CWV, Lighthouse, keywords, social profiles
- `mk_client_performance_snapshots` — weekly metrike
- `mk_client_documents` — linkovi ka assets-ima
- `mk_client_open_questions` — queue pitanja za poziv
- `mk_client_update_log` — immutable audit trail (trigger-ovan)

Sve tabele RLS-enabled preko `mk_is_team_member()` policy helper-a.

---

## Keyboard

| Sta | Gde |
|---|---|
| `⌘K` / `Ctrl+K` | CMD+K command palette (globalni) |
| `ESC` | Zatvori palette |

---

_MonteKristo Internal Onboarding — 100% CRUD nad Supabase, bez AI zavisnosti._
