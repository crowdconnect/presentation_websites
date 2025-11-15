# Detaillierte Entwicklungs-Kostentabelle

## Übersichtstabelle aller Komponenten

| ID | Kategorie | Komponente | Beschreibung | Aufwand (h) | Kosten (€) | Priorität | Abhängigkeiten |
|----|-----------|------------|--------------|-------------|------------|-----------|----------------|
| **BACKEND** |
| B1 | Backend | Datenbank-Design | ER-Modell, Tabellenstruktur für alle Entitäten | 16 | 1.600 | Hoch | - |
| B2 | Backend | Datenbank-Implementierung | PostgreSQL/MySQL Setup, Migrationen, Indizes | 12 | 1.200 | Hoch | B1 |
| B3 | Backend | API-Architektur | REST/GraphQL API Design, Routing, Middleware | 20 | 2.000 | Hoch | B2 |
| B4 | Backend | Authentifizierung | JWT/OAuth2, RBAC, Session Management | 24 | 2.400 | Hoch | B3 |
| B5 | Backend | User Management | Registrierung, Login, Profil, Passwort-Reset | 16 | 1.600 | Hoch | B4 |
| B6 | Backend | Vertragsverwaltung | CRUD, Tarif-Upgrades, Laufzeiten, Kündigungen | 32 | 3.200 | Hoch | B3 |
| B7 | Backend | Rechnungssystem | Rechnungserstellung, PDF, Zahlungshistorie | 28 | 2.800 | Hoch | B3 |
| B8 | Backend | E-Commerce Backend | Warenkorb, Bestellprozess, Zahlungsintegration | 40 | 4.000 | Hoch | B3, B4 |
| B9 | Backend | Referral-System | Code-Generierung, Tracking, Gutschriften | 32 | 3.200 | Hoch | B3, B5 |
| B10 | Backend | Campaign-Management | CRUD für Aktionen, Zeitplanung, Targeting | 24 | 2.400 | Mittel | B3 |
| B11 | Backend | Notification-System | E-Mail, Push, SMS, Templates | 28 | 2.800 | Mittel | B3 |
| B12 | Backend | Support-System | Ticket-System, Chat, FAQ | 24 | 2.400 | Mittel | B3 |
| B13 | Backend | Reporting & Analytics | Dashboard-Metriken, Reporting-API | 20 | 2.000 | Niedrig | B3 |
| B14 | Backend | Testing & Dokumentation | Unit/Integration Tests, API-Docs | 32 | 3.200 | Hoch | B3-B12 |
| **MOBILE APP** |
| M1 | Mobile | Projekt-Setup | React Native/Flutter Setup, Struktur | 12 | 1.200 | Hoch | - |
| M2 | Mobile | Design-System | UI-Komponenten, Theme, Dark Mode | 24 | 2.400 | Hoch | M1 |
| M3 | Mobile | Navigation | Navigation Stack, Deep Linking, Tabs | 16 | 1.600 | Hoch | M1 |
| M4 | Mobile | Authentifizierung | Login/Logout, Biometrie, Token-Management | 16 | 1.600 | Hoch | M1, B4 |
| M5 | Mobile | Dashboard | Übersichtsseite, Aktionsanzeigen, Widgets | 20 | 2.000 | Hoch | M2, M3, B3 |
| M6 | Mobile | Vertragsverwaltung | Vertragsübersicht, Tarif-Upgrades | 24 | 2.400 | Hoch | M2, M3, B6 |
| M7 | Mobile | TV-Pakete | Paket-Übersicht, Buchungsprozess | 20 | 2.000 | Hoch | M2, M3, B3 |
| M8 | Mobile | Hardware-Shop | Produktkatalog, Warenkorb, Checkout | 32 | 3.200 | Hoch | M2, M3, B8 |
| M9 | Mobile | Referral-System | Code-Anzeige, Teilen, Status, Gutschriften | 24 | 2.400 | Hoch | M2, M3, B9 |
| M10 | Mobile | Rechnungen | Rechnungsliste, Detail, PDF-Download | 20 | 2.000 | Hoch | M2, M3, B7 |
| M11 | Mobile | Support | Kontaktformulare, WhatsApp, Tickets | 16 | 1.600 | Mittel | M2, M3, B12 |
| M12 | Mobile | Push-Notifications | Firebase/APNs, Notification-Handling | 16 | 1.600 | Mittel | M1, B11 |
| M13 | Mobile | Offline-Funktionalität | Offline-Modus, Caching, Sync | 24 | 2.400 | Mittel | M1, B3 |
| M14 | Mobile | App Store Deployment | iOS/Android Store Setup, Optimierung | 16 | 1.600 | Hoch | M1-M13 |
| M15 | Mobile | Testing | Unit/Integration Tests, Device Testing | 24 | 2.400 | Hoch | M1-M13 |
| **REFERRAL-WORKFLOW** |
| R1 | Referral | Referral-Tracking | Code-Validierung, Zuordnung, Status | 16 | 1.600 | Hoch | B9 |
| R2 | Referral | Gutschriften-System | Automatische Berechnung, Verwaltung | 24 | 2.400 | Hoch | B9, B7 |
| R3 | Referral | Reminder-System | E-Mail/Push/SMS-Reminder für Gutschriften | 20 | 2.000 | Hoch | B9, B11 |
| R4 | Referral | Geschenk-Verwaltung | Geschenk-Katalog, Auswahl, Versand | 16 | 1.600 | Mittel | B9 |
| R5 | Referral | Referral-Dashboard | User-Übersicht: Status, Gutschriften, Historie | 16 | 1.600 | Hoch | B9, M9 |
| R6 | Referral | Admin-Panel | Verwaltung, manuelle Gutschriften, Statistiken | 20 | 2.000 | Mittel | B9, B13 |
| **E-COMMERCE** |
| E1 | E-Commerce | Produktkatalog | Hardware, TV-Pakete, Tarif-Upgrades | 16 | 1.600 | Hoch | B3 |
| E2 | E-Commerce | Warenkorb | Warenkorb-Funktionalität, Persistierung | 12 | 1.200 | Hoch | B8 |
| E3 | E-Commerce | Checkout-Prozess | Multi-Step-Checkout, Adressen, Zahlungen | 24 | 2.400 | Hoch | B8 |
| E4 | E-Commerce | Zahlungsintegration | Stripe/PayPal, SEPA, Bestätigung | 32 | 3.200 | Hoch | B8, I2 |
| E5 | E-Commerce | Bestellverwaltung | Bestellstatus, Versand-Tracking, Retouren | 20 | 2.000 | Hoch | B8 |
| E6 | E-Commerce | Tarif-Upgrade-Prozess | Upgrade-Flow, Vertragsänderung | 24 | 2.400 | Hoch | B6, B8 |
| E7 | E-Commerce | TV-Paket-Buchung | Buchungsprozess, Aktivierung, Kündigung | 20 | 2.000 | Hoch | B3, B8 |
| E8 | E-Commerce | Bestellhistorie | Übersicht, Filter, Suche, Export | 12 | 1.200 | Mittel | B8 |
| **CAMPAIGN-MANAGEMENT** |
| C1 | Campaign | Campaign-CRUD | Erstellung, Bearbeitung, Löschung | 16 | 1.600 | Hoch | B10 |
| C2 | Campaign | Zeitplanung | Start/Enddatum, Zeitfenster, Wiederholungen | 12 | 1.200 | Hoch | B10 |
| C3 | Campaign | Targeting | Zielgruppen, Segmentierung, A/B-Testing | 20 | 2.000 | Mittel | B10 |
| C4 | Campaign | Content-Management | Bild-Upload, Text-Editierung, Preview | 16 | 1.600 | Hoch | B10 |
| C5 | Campaign | Campaign-Dashboard | Übersicht, Statistiken, Performance | 16 | 1.600 | Mittel | B10, B13 |
| C6 | Campaign | Analytics & Reporting | Klick-Statistiken, Conversion, ROI | 20 | 2.000 | Mittel | B10, B13 |
| **INTEGRATION** |
| I1 | Integration | Datenbank-Anbindung | Backend-DB-Connection, Pooling | 8 | 800 | Hoch | B2 |
| I2 | Integration | Payment-Provider | Stripe, PayPal, SEPA, Webhooks | 16 | 1.600 | Hoch | B8 |
| I3 | Integration | E-Mail-Service | SendGrid/Mailgun, Templates | 12 | 1.200 | Hoch | B11 |
| I4 | Integration | SMS-Service | Twilio, SMS-Versand, Status | 12 | 1.200 | Mittel | B11 |
| I5 | Integration | Push-Notifications | FCM, APNs Setup | 12 | 1.200 | Hoch | B11 |
| I6 | Integration | WhatsApp Business API | WhatsApp-Integration, Templates | 16 | 1.600 | Mittel | B12 |
| I7 | Integration | PDF-Generierung | Rechnungs-PDF, Bestellbestätigungen | 12 | 1.200 | Hoch | B7, B8 |
| **SICHERHEIT** |
| S1 | Sicherheit | Datenschutz (DSGVO) | Datenschutzerklärung, Cookie-Consent | 16 | 1.600 | Hoch | B3 |
| S2 | Sicherheit | Sicherheits-Audit | Penetration Testing, Vulnerability Scan | 20 | 2.000 | Hoch | Alle |
| S3 | Sicherheit | Verschlüsselung | HTTPS, Datenverschlüsselung, Token | 12 | 1.200 | Hoch | B4 |
| S4 | Sicherheit | Backup & Recovery | Automatische Backups, Disaster Recovery | 12 | 1.200 | Hoch | B2 |
| **DEVOPS** |
| D1 | DevOps | CI/CD Pipeline | GitHub Actions, Tests, Deployment | 16 | 1.600 | Hoch | Alle |
| D2 | DevOps | Server-Setup | Cloud-Infrastruktur, Load Balancing | 20 | 2.000 | Hoch | Alle |
| D3 | DevOps | Monitoring & Logging | Error Tracking, Logging, Performance | 16 | 1.600 | Hoch | Alle |
| D4 | DevOps | Domain & SSL | Domain, SSL-Zertifikate, CDN | 8 | 800 | Hoch | D2 |
| **TESTING** |
| T1 | Testing | Frontend-Testing | Unit, Integration, E2E Tests | 32 | 3.200 | Hoch | M1-M13 |
| T2 | Testing | Backend-Testing | API-Tests, Load Testing, Security | 24 | 2.400 | Hoch | B1-B14 |
| T3 | Testing | Mobile Testing | Device Testing, Beta, Performance | 24 | 2.400 | Hoch | M1-M15 |
| T4 | Testing | User Acceptance Testing | Beta-Testing, Feedback-Sammlung | 16 | 1.600 | Hoch | Alle |
| **PROJEKTMANAGEMENT** |
| P1 | PM | Projektplanung | Roadmap, Sprint-Planning, Ressourcen | 16 | 1.600 | Hoch | - |
| P2 | PM | Technische Dokumentation | API-Docs, Code-Docs, Architektur | 24 | 2.400 | Hoch | Alle |
| P3 | PM | User-Dokumentation | User-Guides, FAQ, Video-Tutorials | 16 | 1.600 | Mittel | Alle |
| P4 | PM | Projektmanagement | Standups, Reviews, Retrospektiven | 40 | 4.000 | Hoch | - |

---

## Zusammenfassung nach Kategorien

| Kategorie | Anzahl Komponenten | Gesamt-Stunden | Gesamt-Kosten (€) |
|-----------|-------------------|----------------|-------------------|
| Backend | 14 | 344 | 34.400 |
| Mobile App | 15 | 304 | 30.400 |
| Referral-Workflow | 6 | 112 | 11.200 |
| E-Commerce | 8 | 160 | 16.000 |
| Campaign-Management | 6 | 100 | 10.000 |
| Integration | 7 | 88 | 8.800 |
| Sicherheit | 4 | 60 | 6.000 |
| DevOps | 4 | 60 | 6.000 |
| Testing | 4 | 96 | 9.600 |
| Projektmanagement | 4 | 96 | 9.600 |
| **GESAMT** | **72** | **1.420** | **142.000** |

---

## Zeitplan (geschätzt)

### Phase 1: Backend & Basis (Monate 1-3)
- Datenbank, API, Authentifizierung
- User Management, Vertragsverwaltung
- Basis-E-Commerce
- **Kosten**: ~60.000 €

### Phase 2: Mobile Apps (Monate 3-5)
- iOS & Android Apps
- Alle Hauptfunktionen
- App Store Deployment
- **Kosten**: ~40.000 €

### Phase 3: E-Commerce & Referrals (Monate 5-7)
- Vollständiger E-Commerce
- Referral-System mit Automatisierung
- Zahlungsintegration
- **Kosten**: ~35.000 €

### Phase 4: Campaigns & Finalisierung (Monate 7-9)
- Campaign-Management
- Testing & QA
- Dokumentation
- Go-Live Vorbereitung
- **Kosten**: ~28.300 €

---

## Preisempfehlung

### Basis-Preis: **142.000 €**
### Puffer (15%): **21.300 €**
### **GESAMTPREIS: 163.300 €**

### Alternative Preisgestaltung:

**Option A: Festpreis**
- **163.300 €** (inkl. 15% Puffer)

**Option B: Stundensatz**
- 1.420 Stunden × 100 € = 142.000 €
- + 15% Puffer = **163.300 €** (mit Obergrenze)

**Option C: Phasenweise**
- Phase 1: 60.000 €
- Phase 2: 40.000 €
- Phase 3: 35.000 €
- Phase 4: 28.300 €
- **Gesamt: 163.300 €**

---

## Zusätzliche monatliche Betriebskosten

| Service | Monatlich (€) | Jährlich (€) |
|---------|---------------|--------------|
| Hosting & Infrastruktur | 200-500 | 2.400-6.000 |
| Datenbank-Hosting | 100-300 | 1.200-3.600 |
| CDN & Storage | 50-150 | 600-1.800 |
| E-Mail-Service | 15-80 | 180-960 |
| SMS-Service | variabel | variabel |
| Push-Notifications | 0-50 | 0-600 |
| Monitoring | 50-200 | 600-2.400 |
| App Store Gebühren | ~10 | 124 |
| **GESAMT** | **~500-1.500** | **~6.000-18.000** |

---

**Hinweis**: Diese Schätzungen basieren auf durchschnittlichen Marktpreisen in Deutschland. Die tatsächlichen Kosten können je nach Team, Technologie-Stack und spezifischen Anforderungen variieren.


