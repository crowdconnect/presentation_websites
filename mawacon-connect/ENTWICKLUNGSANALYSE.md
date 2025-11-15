# Entwicklungsanalyse: Mawacon Connect App

## Übersicht

Die vorliegende Click-Dummy-App ist ein Next.js-basiertes Kundenportal für einen Telekommunikationsanbieter (Mawacon) mit folgenden Hauptfunktionen:

- **Dashboard** mit Aktionsanzeigen
- **Vertragsverwaltung** und Tarif-Upgrades
- **TV-Pakete** buchen
- **Hardware-E-Commerce**
- **Referral-Programm** (Freunde werben)
- **Rechnungsübersicht**
- **Support & Hilfe**

---

## Detaillierte Entwicklungsaufstellung

| **Kategorie** | **Komponente** | **Beschreibung** | **Aufwand (Stunden)** | **Kosten (€)** | **Priorität** |
|---------------|----------------|------------------|----------------------|----------------|---------------|
| **1. Backend-Entwicklung** | | | | | |
| | **1.1 Datenbank-Design** | ER-Modell, Tabellenstruktur (User, Contracts, Invoices, Hardware, TV-Packages, Referrals, Campaigns, Orders) | 16 | 1.600 | Hoch |
| | **1.2 Datenbank-Implementierung** | PostgreSQL/MySQL Setup, Migrationen, Indizes, Constraints | 12 | 1.200 | Hoch |
| | **1.3 API-Architektur** | REST/GraphQL API Design, Routing, Middleware, Error Handling | 20 | 2.000 | Hoch |
| | **1.4 Authentifizierung & Autorisierung** | JWT/OAuth2, Role-based Access Control, Session Management | 24 | 2.400 | Hoch |
| | **1.5 User Management** | Registrierung, Login, Profilverwaltung, Passwort-Reset | 16 | 1.600 | Hoch |
| | **1.6 Vertragsverwaltung** | CRUD für Verträge, Tarif-Upgrades, Vertragslaufzeiten, Kündigungen | 32 | 3.200 | Hoch |
| | **1.7 Rechnungssystem** | Rechnungserstellung, PDF-Generierung, Zahlungshistorie, Status-Tracking | 28 | 2.800 | Hoch |
| | **1.8 E-Commerce Backend** | Warenkorb, Bestellprozess, Zahlungsintegration (Stripe/PayPal), Bestellstatus | 40 | 4.000 | Hoch |
| | **1.9 Referral-System** | Referral-Code-Generierung, Tracking, Gutschriften-Verwaltung, Status-Updates | 32 | 3.200 | Hoch |
| | **1.10 Campaign-Management** | CRUD für Aktionen/Kampagnen, Zeitplanung, Targeting, Status-Management | 24 | 2.400 | Mittel |
| | **1.11 Notification-System** | E-Mail, Push-Notifications, SMS-Integration, Template-Management | 28 | 2.800 | Mittel |
| | **1.12 Support-System** | Ticket-System, Chat-Integration (WhatsApp API), FAQ-Management | 24 | 2.400 | Mittel |
| | **1.13 Reporting & Analytics** | Dashboard-Metriken, Reporting-API, Datenaggregation | 20 | 2.000 | Niedrig |
| | **1.14 Testing & Dokumentation** | Unit Tests, Integration Tests, API-Dokumentation (Swagger) | 32 | 3.200 | Hoch |
| | **Backend Subtotal** | | **344** | **34.400** | |
| **2. Mobile App Entwicklung (iOS & Android)** | | | | | |
| | **2.1 Projekt-Setup** | React Native/Flutter Setup, Projektstruktur, Dependencies | 12 | 1.200 | Hoch |
| | **2.2 Design-System** | UI-Komponenten, Theme, Responsive Design, Dark Mode | 24 | 2.400 | Hoch |
| | **2.3 Navigation** | Navigation Stack, Deep Linking, Tab Navigation | 16 | 1.600 | Hoch |
| | **2.4 Authentifizierung** | Login/Logout, Biometrie, Token-Management | 16 | 1.600 | Hoch |
| | **2.5 Dashboard** | Übersichtsseite, Aktionsanzeigen, Widgets | 20 | 2.000 | Hoch |
| | **2.6 Vertragsverwaltung** | Vertragsübersicht, Tarif-Upgrades, Upgrade-Prozess | 24 | 2.400 | Hoch |
| | **2.7 TV-Pakete** | Paket-Übersicht, Buchungsprozess, Bestätigung | 20 | 2.000 | Hoch |
| | **2.8 Hardware-Shop** | Produktkatalog, Warenkorb, Checkout, Bestellhistorie | 32 | 3.200 | Hoch |
| | **2.9 Referral-System** | Code-Anzeige, Teilen-Funktion, Status-Tracking, Gutschriften-Übersicht | 24 | 2.400 | Hoch |
| | **2.10 Rechnungen** | Rechnungsliste, Detailansicht, PDF-Download, Zahlungshistorie | 20 | 2.000 | Hoch |
| | **2.11 Support** | Kontaktformulare, WhatsApp-Integration, Ticket-System | 16 | 1.600 | Mittel |
| | **2.12 Push-Notifications** | Firebase/APNs Setup, Notification-Handling, Badge-Management | 16 | 1.600 | Mittel |
| | **2.13 Offline-Funktionalität** | Offline-Modus, Daten-Caching, Sync-Mechanismus | 24 | 2.400 | Mittel |
| | **2.14 App Store Deployment** | iOS App Store Setup, Google Play Setup, Store-Optimierung | 16 | 1.600 | Hoch |
| | **2.15 Testing** | Unit Tests, Integration Tests, Device Testing, Beta-Testing | 24 | 2.400 | Hoch |
| | **Mobile App Subtotal** | | **304** | **30.400** | |
| **3. Referral-Workflow & Automatisierung** | | | | | |
| | **3.1 Referral-Tracking** | Code-Validierung, Zuordnung, Status-Tracking (Pending/Active/Rewarded) | 16 | 1.600 | Hoch |
| | **3.2 Gutschriften-System** | Automatische Gutschrift-Berechnung, Gutschrift-Verwaltung, Anwendung auf Rechnungen | 24 | 2.400 | Hoch |
| | **3.3 Reminder-System** | E-Mail-Reminder für ausstehende Gutschriften, Push-Notifications, SMS-Reminder | 20 | 2.000 | Hoch |
| | **3.4 Geschenk-Verwaltung** | Geschenk-Katalog, Geschenk-Auswahl, Versand-Tracking | 16 | 1.600 | Mittel |
| | **3.5 Referral-Dashboard** | Übersicht für User: Status, Gutschriften, Geschenke, Historie | 16 | 1.600 | Hoch |
| | **3.6 Admin-Panel für Referrals** | Verwaltung von Referrals, manuelle Gutschriften, Statistiken | 20 | 2.000 | Mittel |
| | **Referral Subtotal** | | **112** | **11.200** | |
| **4. E-Commerce Funktionalität** | | | | | |
| | **4.1 Produktkatalog** | Hardware-Produkte, TV-Pakete, Tarif-Upgrades, Produktvarianten | 16 | 1.600 | Hoch |
| | **4.2 Warenkorb** | Warenkorb-Funktionalität, Persistierung, Cross-Device-Sync | 12 | 1.200 | Hoch |
| | **4.3 Checkout-Prozess** | Multi-Step-Checkout, Adressverwaltung, Zahlungsmethoden | 24 | 2.400 | Hoch |
| | **4.4 Zahlungsintegration** | Stripe/PayPal Integration, SEPA-Lastschrift, Zahlungsbestätigung | 32 | 3.200 | Hoch |
| | **4.5 Bestellverwaltung** | Bestellstatus, Versand-Tracking, Retouren-Management | 20 | 2.000 | Hoch |
| | **4.6 Tarif-Upgrade-Prozess** | Upgrade-Flow, Vertragsänderung, Bestätigung, Aktivierung | 24 | 2.400 | Hoch |
| | **4.7 TV-Paket-Buchung** | Buchungsprozess, Aktivierung, Kündigung, Upgrade-Möglichkeiten | 20 | 2.000 | Hoch |
| | **4.8 Bestellhistorie** | Übersicht aller Bestellungen, Filter, Suche, Export | 12 | 1.200 | Mittel |
| | **E-Commerce Subtotal** | | **160** | **16.000** | |
| **5. Campaign/Aktions-Management** | | | | | |
| | **5.1 Campaign-CRUD** | Erstellung, Bearbeitung, Löschung von Aktionen/Kampagnen | 16 | 1.600 | Hoch |
| | **5.2 Zeitplanung** | Start-/Enddatum, Zeitfenster, Wiederholungen | 12 | 1.200 | Hoch |
| | **5.3 Targeting** | Zielgruppen-Definition, Segmentierung, A/B-Testing | 20 | 2.000 | Mittel |
| | **5.4 Content-Management** | Bild-Upload, Text-Editierung, Preview, Versionierung | 16 | 1.600 | Hoch |
| | **5.5 Campaign-Dashboard** | Übersicht aktiver/geplanter Aktionen, Statistiken, Performance | 16 | 1.600 | Mittel |
| | **5.6 Analytics & Reporting** | Klick-Statistiken, Conversion-Tracking, ROI-Berechnung | 20 | 2.000 | Mittel |
| | **Campaign Subtotal** | | **100** | **10.000** | |
| **6. Integration & Anbindungen** | | | | | |
| | **6.1 Datenbank-Anbindung** | Backend-DB-Connection, Connection Pooling, Migration-Tools | 8 | 800 | Hoch |
| | **6.2 Payment-Provider** | Stripe, PayPal, SEPA-Integration, Webhook-Handling | 16 | 1.600 | Hoch |
| | **6.3 E-Mail-Service** | SendGrid/Mailgun Integration, Template-Management, Bounce-Handling | 12 | 1.200 | Hoch |
| | **6.4 SMS-Service** | SMS-Provider Integration (Twilio), SMS-Versand, Status-Tracking | 12 | 1.200 | Mittel |
| | **6.5 Push-Notification-Service** | Firebase Cloud Messaging, Apple Push Notification Service | 12 | 1.200 | Hoch |
| | **6.6 WhatsApp Business API** | WhatsApp-Integration für Support, Message-Templates | 16 | 1.600 | Mittel |
| | **6.7 PDF-Generierung** | Rechnungs-PDF, Bestellbestätigungen, automatische Generierung | 12 | 1.200 | Hoch |
| | **Integration Subtotal** | | **88** | **8.800** | |
| **7. Sicherheit & Compliance** | | | | | |
| | **7.1 Datenschutz (DSGVO)** | Datenschutzerklärung, Cookie-Consent, Datenexport, Löschung | 16 | 1.600 | Hoch |
| | **7.2 Sicherheits-Audit** | Penetration Testing, Vulnerability Scanning, Security Headers | 20 | 2.000 | Hoch |
| | **7.3 Verschlüsselung** | HTTPS, Datenverschlüsselung, sichere Token-Speicherung | 12 | 1.200 | Hoch |
| | **7.4 Backup & Recovery** | Automatische Backups, Disaster Recovery, Datenwiederherstellung | 12 | 1.200 | Hoch |
| | **Sicherheit Subtotal** | | **60** | **6.000** | |
| **8. DevOps & Deployment** | | | | | |
| | **8.1 CI/CD Pipeline** | GitHub Actions/GitLab CI, Automatische Tests, Deployment | 16 | 1.600 | Hoch |
| | **8.2 Server-Setup** | Cloud-Infrastruktur (AWS/Azure/GCP), Load Balancing, Scaling | 20 | 2.000 | Hoch |
| | **8.3 Monitoring & Logging** | Error Tracking (Sentry), Logging (ELK Stack), Performance Monitoring | 16 | 1.600 | Hoch |
| | **8.4 Domain & SSL** | Domain-Konfiguration, SSL-Zertifikate, CDN-Setup | 8 | 800 | Hoch |
| | **DevOps Subtotal** | | **60** | **6.000** | |
| **9. Qualitätssicherung & Testing** | | | | | |
| | **9.1 Frontend-Testing** | Unit Tests, Integration Tests, E2E Tests (Cypress/Playwright) | 32 | 3.200 | Hoch |
| | **9.2 Backend-Testing** | API-Tests, Load Testing, Security Testing | 24 | 2.400 | Hoch |
| | **9.3 Mobile Testing** | Device Testing, Beta-Testing, Performance Testing | 24 | 2.400 | Hoch |
| | **9.4 User Acceptance Testing** | Beta-Testing mit echten Usern, Feedback-Sammlung | 16 | 1.600 | Hoch |
| | **Testing Subtotal** | | **96** | **9.600** | |
| **10. Projektmanagement & Dokumentation** | | | | | |
| | **10.1 Projektplanung** | Roadmap, Sprint-Planning, Ressourcen-Planung | 16 | 1.600 | Hoch |
| | **10.2 Technische Dokumentation** | API-Dokumentation, Code-Dokumentation, Architektur-Dokumentation | 24 | 2.400 | Hoch |
| | **10.3 User-Dokumentation** | User-Guides, FAQ, Video-Tutorials | 16 | 1.600 | Mittel |
| | **10.4 Projektmanagement** | Daily Standups, Sprint Reviews, Retrospektiven | 40 | 4.000 | Hoch |
| | **PM Subtotal** | | **96** | **9.600** | |

---

## Gesamtübersicht

| **Kategorie** | **Stunden** | **Kosten (€)** |
|---------------|-------------|----------------|
| Backend-Entwicklung | 344 | 34.400 |
| Mobile App (iOS & Android) | 304 | 30.400 |
| Referral-Workflow | 112 | 11.200 |
| E-Commerce | 160 | 16.000 |
| Campaign-Management | 100 | 10.000 |
| Integration & Anbindungen | 88 | 8.800 |
| Sicherheit & Compliance | 60 | 6.000 |
| DevOps & Deployment | 60 | 6.000 |
| Qualitätssicherung | 96 | 9.600 |
| Projektmanagement | 96 | 9.600 |
| **GESAMT** | **1.420** | **142.000** |

---

## Preisgestaltung

### Basis-Annahme:
- **Stundensatz**: 100 €/Stunde (durchschnittlicher Entwickler-Stundensatz in Deutschland)
- **Projektlaufzeit**: ca. 8-10 Monate (bei 1-2 Entwicklern)
- **Puffer für unvorhergesehene Aufgaben**: 15% (21.300 €)

### Preisvarianten:

#### **Option 1: Festpreis (Empfohlen)**
- **Basis-Preis**: 142.000 €
- **Puffer (15%)**: 21.300 €
- **Gesamtpreis**: **163.300 €**

#### **Option 2: Stundensatz-basiert**
- **Basis**: 1.420 Stunden × 100 € = 142.000 €
- **Puffer**: 15% = 21.300 €
- **Gesamt**: **163.300 €** (mit Obergrenze)

#### **Option 3: Phasenweise Abrechnung**
- **Phase 1 (Backend + Basis-Features)**: 60.000 €
- **Phase 2 (Mobile Apps)**: 40.000 €
- **Phase 3 (E-Commerce + Referrals)**: 35.000 €
- **Phase 4 (Campaigns + Finalisierung)**: 28.300 €
- **Gesamt**: **163.300 €**

---

## Zusätzliche Kosten (nicht in Hauptpreis enthalten)

| **Item** | **Kosten (monatlich)** | **Kosten (jährlich)** |
|----------|------------------------|----------------------|
| **Hosting & Infrastruktur** | 200-500 € | 2.400-6.000 € |
| **Datenbank-Hosting** | 100-300 € | 1.200-3.600 € |
| **CDN & Storage** | 50-150 € | 600-1.800 € |
| **Payment-Provider Gebühren** | 0,3-2% pro Transaktion | - |
| **E-Mail-Service (SendGrid)** | 15-80 € | 180-960 € |
| **SMS-Service (Twilio)** | 0,01-0,05 €/SMS | - |
| **Push-Notification-Service** | 0-50 € | 0-600 € |
| **Monitoring & Analytics** | 50-200 € | 600-2.400 € |
| **App Store Gebühren** | 99 €/Jahr (iOS) + 25 € (Android) | 124 € |
| **SSL-Zertifikate** | 0-100 € | 0-1.200 € |
| **Domain** | 10-50 €/Jahr | 10-50 € |

**Geschätzte monatliche Betriebskosten**: 500-1.500 €
**Geschätzte jährliche Betriebskosten**: 6.000-18.000 €

---

## Risiken & Herausforderungen

1. **Komplexität des Referral-Systems**: Automatisierung von Gutschriften und Remindern erfordert sorgfältige Planung
2. **Payment-Integration**: Verschiedene Zahlungsmethoden und Compliance-Anforderungen
3. **Mobile App Store Approval**: iOS und Android haben unterschiedliche Anforderungen
4. **Skalierbarkeit**: System muss für Wachstum vorbereitet sein
5. **DSGVO-Compliance**: Strikte Datenschutzanforderungen müssen erfüllt werden

---

## Empfehlungen

1. **MVP-Ansatz**: Start mit Kernfunktionen (Backend, Mobile Apps, Basis-E-Commerce)
2. **Iterative Entwicklung**: Schrittweise Erweiterung um Referrals, Campaigns, etc.
3. **Cloud-First**: Nutzung von Cloud-Services für Skalierbarkeit
4. **Agile Methodik**: Scrum/Kanban für flexible Anpassungen
5. **Regelmäßige Reviews**: Wöchentliche Demos und Feedback-Loops

---

## Nächste Schritte

1. **Kickoff-Meeting**: Anforderungen finalisieren, Prioritäten setzen
2. **Technologie-Stack finalisieren**: React Native vs. Flutter, Backend-Framework
3. **Design-System**: UI/UX-Design finalisieren
4. **Projektplan**: Detaillierter Zeitplan mit Meilensteinen
5. **Team-Aufbau**: Entwickler, Designer, QA, Projektmanager

---

**Erstellt am**: $(date)
**Version**: 1.0
**Status**: Vorläufige Schätzung - kann nach detaillierter Anforderungsanalyse angepasst werden


