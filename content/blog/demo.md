---
title: Demo
description: AI
date: 2026-08-24
updated: ''
author: Nasrul Hazim
authorTitle: Managing Director
tags:
  - AI
cover: ''
coverAlt: ''
canonical: ''
draft: false
---

# Universal AI Coding Agent Formula (Revised)

## Baca ni dulu sebelum apa-apa

CLAUDE.md \*\*bukan dokumentasi projek\*\*. Ia adalah \*\*context budget\*\*.

Setiap kali session start, fail ni di-load masuk context window — makan token

sama-sama dengan conversation kau. Official guidance: \*\*target bawah 200 baris\*\*.

Fail yang panjang makan lebih banyak context DAN menurunkan adherence.

Maksudnya: makin panjang CLAUDE.md kau, makin \*\*kurang\*\* AI ikut arahan kau.

Formula asal (10 section, semua ditulis penuh) akan jadi 600–1000 baris.

Itu bukan tuning — itu sabotaj.

***

## Rule utama semasa menulis

> Kalau AI boleh baca benda tu dari codebase, \*\*jangan tulis dalam CLAUDE.md\*\*.

Ini bukan pendapat. Claude Code ada checkup (\`/doctor\`) yang akan cadang trim

CLAUDE.md kau — ia potong content yang boleh derive dari codebase (directory

layout, dependency list, architecture overview) dan \*\*kekalkan\*\* pitfalls,

rationale, dan convention yang lain dari default tool.

Guna ayat tu sebagai pisau. Setiap baris kena lulus ujian ni:

| Soalan | Kalau YA |

| AI boleh tahu ni dengan baca 2-3 fail? | Buang |

| Ni general knowledge (OWASP, SOLID, N+1)? | Buang |

| Ni relevan untuk \*setiap\* task? | Kekal |

| Ni boleh diverify (pass/fail)? | Kekal |

| Ni prosedur multi-step? | Pindah jadi Skill |

| Ni hanya untuk satu folder? | Pindah jadi path-scoped rule |

| Ni MESTI jalan setiap kali? | Pindah jadi Hook |

***

## Bahagian 1 — Apa yang MASUK dalam CLAUDE.md

Tujuh section je. Pendek.

### 1. Commands

Paling tinggi nilai. Formula asal langsung tak sebut benda ni.

\`\`\`

- Test: \`php artisan test\`  | single: \`php artisan test --filter=OrderTest\`
- Lint: \`./vendor/bin/pint --dirty\`
- Fresh DB: \`php artisan migrate:fresh --seed\`
- Dev: \`composer dev\`

\`\`\`

### 2. Environment quirks

Benda yang akan buat AI tersadung tapi tak nampak dalam code.

\`\`\`

- PHP 8.3, Laravel 12. Guna Herd, bukan Sail.
- Queue kena jalan manual masa dev: \`php artisan queue:work\`
- Test guna Postgres, bukan SQLite — array/JSON column behaviour lain.

\`\`\`

### 3. Conventions (yang LAIN dari default)

Kunci: tulis yang \*\*menyimpang\*\* dari default framework sahaja. Jangan ajar

Laravel kat AI. Dan tunjuk fail contoh — satu reference file lagi kuat dari

tiga perenggan penerangan.

\`\`\`

- Public ID = UUID, internal ID = auto-increment. Jangan expose internal ID.
- Business logic → invokable Action class.

  Contoh: \`app/Actions/Order/PlaceOrder.php\`

- Side effect → Observer. Jangan letak dalam controller.
- Enum wajib ada \`label()\` dan \`color()\`.

  Contoh: \`app/Enums/OrderStatus.php\`

- Backend yang boleh tukar → driver pattern (contract + manager).

\`\`\`

### 4. Boundaries — apa yang HARAM sentuh

Formula asal tak ada langsung. Ini yang selamatkan kau dari malam yang panjang.

\`\`\`

- Jangan edit migration yang dah merge ke \`main\` — tambah migration baru.
- Jangan ubah \`database/schema/\*.dump\` atau lock files.
- Tanya dulu sebelum tambah composer dependency baru.
- Jangan buang test untuk buat suite pass.

\`\`\`

### 5. Domain vocabulary

Perkataan yang ada makna khusus dalam business kau. AI tak boleh teka ni.

\`\`\`

- "Tenant" = organisasi client, bukan user.
- "Agent" = staff support dalaman. "Member" = user pihak client.
- Source of truth untuk billing = Stripe, bukan table \`subscriptions\`.

\`\`\`

### 6. Definition of done

\`\`\`

Pint clean, \`php artisan test\` hijau, behaviour baru ada Pest test.

\`\`\`

### 7. Do / Don't (pendek je)

Format ni bagus dalam formula asal. Kekalkan — tapi 5-6 baris, bukan 20.

Hati-hati bercanggah: kalau dua rule berlawan, AI mungkin pilih salah satu

secara rawak.

***

## Bahagian 2 — Apa yang KELUAR (dan pergi ke mana)

Section yang kau tulis tu bukan salah. Cuma salah tempat.

| Section asal | Pergi ke mana | Kenapa |

| Workflow (Understand → Explore → Plan → …) | \*\*Skill\*\* atau slash command | Prosedur per-task, bukan fakta per-session. Prosedur multi-step patut jadi skill |

| Change Management checklist | \*\*Skill\*\* / \`/plan\` command | Hanya perlu untuk perubahan besar. Tak payah duduk dalam context 24/7 |

| Documentation rules | \*\*\`.claude/rules/docs.md\`\*\* dengan \`paths: ["docs/\*\*"]\` | Load bila sentuh docs sahaja |

| Security rules (OWASP list) | \*\*Buang 90%\*\* | Model dah tahu SQL injection, XSS, CSRF. Senarai kategori = bakar token, tak ubah behaviour. Simpan yang project-specific je |

| Performance rules | \*\*Buang 80%\*\* | "Jangan optimise membuta" tak boleh diverify. Tukar jadi: "Semua list endpoint wajib paginate. Tiada Eloquent call dalam loop" |

| Known Gotchas | \*\*\`.claude/rules/gotchas.md\`\*\* | Section terbaik kau. Tapi ia membesar tanpa had — asingkan dan prune suku tahunan |

| "Lint sebelum commit" | \*\*Hook\*\* | CLAUDE.md itu context, bukan enforcement. Kalau sesuatu MESTI jalan pada titik tertentu, guna hook |

| Self-Learning rule | \*\*Sebahagian besar dah automatik\*\* | Auto memory sekarang simpan sendiri: preference kau, correction yang kau bagi, approach yang kau sahkan. Kau tak perlu maintain manual |

***

## Bahagian 3 — Scope hierarchy (formula asal terlepas)

Bukan satu fail. Ada empat lapisan, load dari paling luas ke paling spesifik:

| Scope | Lokasi | Untuk apa |

| Managed policy | \`/Library/Application Support/ClaudeCode/CLAUDE.md\` (macOS) | Standard company, deploy via MDM |

| User | \`\~/.claude/CLAUDE.md\` | Preference peribadi, semua projek |

| Project | \`./CLAUDE.md\` atau \`./.claude/CLAUDE.md\` | Team-shared, masuk git |

| Local | \`./CLAUDE.local.md\` | Peribadi untuk projek ni. Masukkan dalam \`.gitignore\` |

Dan untuk projek besar: \`.claude/rules/\` — setiap fail satu topik, boleh

di-scope ke path tertentu guna YAML frontmatter:

\`\`\`markdown

***

paths:

    - "app/Http/Api/\*\*/\*.php"

***

# API Rules

- Semua endpoint wajib Form Request untuk validation.
- Response guna API Resource, jangan return model terus.

\`\`\`

Rule macam ni \*\*hanya\*\* masuk context bila AI sentuh fail yang sepadan.

Inilah jawapan sebenar untuk "rule aku terlalu panjang".

⚠️ Nota penting yang ramai artikel salah: pecah guna \`@path\` import \*\*tidak\*\*

kurangkan context — fail yang di-import tetap load masa launch. Ia bantu

organisation sahaja. Yang betul-betul jimat context ialah path-scoped rules.

***

## Bahagian 4 — Template siap pakai

Ini keseluruhan CLAUDE.md. \~35 baris. Ia akan mengalahkan versi 800 baris.

\`\`\`markdown

# Belian — procurement system untuk SME Malaysia. User: purchasing officer + approver.

## Commands

- Test: \`php artisan test\` | single: \`php artisan test --filter=X\`
- Lint: \`./vendor/bin/pint --dirty\`
- Fresh DB: \`php artisan migrate:fresh --seed\`

## Environment

- PHP 8.3 / Laravel 12 / Herd. Postgres, bukan SQLite.
- Queue kena jalan manual masa dev.

## Conventions (lain dari default Laravel)

- Public ID = UUID, internal ID = auto-increment. Jangan expose internal ID.
- Business logic → invokable Action. Rujuk \`app/Actions/PO/ApprovePO.php\`
- Side effect → Observer, bukan controller.
- Enum wajib \`label()\` + \`color()\`. Rujuk \`app/Enums/POStatus.php\`
- Swappable backend → contract + driver manager.

## Boundaries

- Jangan edit migration yang dah merge ke \`main\`.
- Jangan buang test untuk paksa suite pass.
- Tanya dulu sebelum tambah dependency.

## Vocabulary

- "Requisition" = permohonan sebelum approve. "PO" = selepas approve.
- Source of truth untuk supplier = SSM API, bukan table tempatan.

## Done means

Pint clean, test hijau, behaviour baru ada Pest test.

## Gotchas

@.claude/rules/gotchas.md

\`\`\`

***

## Bahagian 5 — Maintenance loop

| Bila | Buat apa |

| Mula projek | \`/init\` — AI baca codebase, jana draf awal |

| Selepas edit | \`/context\` — sahkan fail betul-betul ter-load |

| Bila fail membengkak | \`/doctor\` — ia cadang apa nak trim |

| Nak semak apa AI ingat | \`/memory\` |

| AI buat silap sama kali kedua | Baru tambah satu baris |

Rule tambah content: \*\*jangan tulis awal-awal\*\*. Tunggu sampai AI buat silap

yang sama dua kali, atau code review tangkap benda yang AI sepatutnya tahu.

Kalau kau taip correction yang sama macam session lepas — itu tanda ia patut

masuk CLAUDE.md.

***

## Silap biasa (ringkasan)

| Silap | Betulkan |

| Tulis semua benda "untuk konteks penuh" | Tulis yang tak boleh derive dari code sahaja |

| Senarai kategori (\`Error handling\`, \`Logging\`) | Tulis arahan yang boleh diverify |

| Ajar general knowledge (OWASP, SOLID) | Model dah tahu. Buang |

| Terangkan pattern dalam 3 perenggan | Tunjuk satu reference file |

| Letak workflow prosedur dalam CLAUDE.md | Jadikan Skill |

| Harap CLAUDE.md sebagai enforcement | CLAUDE.md = context, bukan enforcement. Guna Hook |

| Satu fail gergasi untuk monorepo | \`.claude/rules/\` + path scoping |

***

## Satu ayat penutup

Formula asal jawab soalan \*\*"apa yang AI kena tahu?"\*\*

Soalan sebenar ialah \*\*"apa yang AI tak boleh tahu sendiri?"\*\*

Yang kedua tu 10% dari saiz yang pertama — dan berkesan 10 kali ganda.

***

\*Rujukan: Claude Code memory documentation —

https://code.claude.com/docs/en/memory\*
