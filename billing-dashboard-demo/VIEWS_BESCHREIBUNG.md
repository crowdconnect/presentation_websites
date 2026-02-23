# Billing Dashboard Demo - Ausführliche Views-Beschreibung

Diese Dokumentation beschreibt alle Views des Billing Dashboard Demo-Programms, um ein vorhandenes Backend daran anzupassen.

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Navigation & Layout](#navigation--layout)
3. [Views im Detail](#views-im-detail)
   - [Startseite (Home)](#startseite-home)
   - [Billing Overview](#billing-overview)
   - [Alle Rechnungsläufe](#alle-rechnungsläufe)
   - [Rechnungslauf Detail](#rechnungslauf-detail)
   - [Kunden Übersicht](#kunden-übersicht)
   - [Kunde Detail](#kunde-detail)
   - [Kunden-Dashboard (Rechnungshistorie)](#kunden-dashboard-rechnungshistorie)
   - [Rechnung Detail](#rechnung-detail)
4. [Gemeinsame Datenstrukturen](#gemeinsame-datenstrukturen)
5. [API-Endpunkt Zusammenfassung](#api-endpunkt-zusammenfassung)
6. [UI-Komponenten Bibliothek](#ui-komponenten-bibliothek)
7. [Styling-Hinweise](#styling-hinweise)
8. [Notizen für Backend-Integration](#notizen-für-backend-integration)

---

## Übersicht

Das Billing Dashboard ist ein System zur Verwaltung von Rechnungsläufen, Kunden und Rechnungen. Es ermöglicht die Überwachung von Rechnungserstellungsprozessen, die Verwaltung von Kundenbeziehungen und die detaillierte Ansicht von Rechnungen.

**Hauptfunktionen:**
- Monatliche Rechnungsläufe erstellen und verwalten
- Automatische PDF-Rechnungsgenerierung
- Einzelverbindungsnachweise (EVN) für Telefonie-Kunden
- Storno- und Ergänzungsrechnungen erstellen
- Kundenübersicht mit erweiterten Filter- und Sortierfunktionen
- Rechnungspositionen verwalten (hinzufügen/entfernen)
- Live-Fortschrittsanzeige während Verarbeitung
- Kunden-Dashboard mit vollständiger Rechnungshistorie

**Technologie-Stack:**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui Komponenten

**Hauptfarbe:** `#274366` (Dunkelblau) als Hintergrundfarbe

**Datenquellen:**
- **Interne Datenbank:** Kundenstammdaten, Tarifinformationen, Anschlussnummern, Vertragsdaten
- **Purtel API:** Telefonie-Buchungen, Einzelverbindungsdaten (CDR) für EVN, Kundeneinstellungen, Vertragsbeginn

---

## Navigation & Layout

### Gemeinsame Header-Komponente

Alle Views (außer Startseite) haben einen gemeinsamen Header:

```typescript
{
  logo: "/mawacon-logo.png", // Link zur Startseite
  userIndicator: "EW" // Benutzeranzeige (rechts oben)
}
```

**Styling:**
- Hintergrund: `bg-white/95 backdrop-blur-sm`
- Padding: `p-6`
- Flexbox-Layout mit Logo links und User-Indikator rechts

---

## Views im Detail

### Startseite (Home)

**Route:** `/`  
**Datei:** `app/page.tsx`

#### Zweck
Hauptnavigationseite mit Zugriff auf alle Hauptbereiche des Systems.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Welcome Card**
   - Titel: "Willkommen bei NetOffice 2025"
   - Zwei Spalten-Layout (Desktop)

3. **Navigation Buttons**

   **Verwaltung:**
   - Fuhrpark (Link: `/fuhrpark`) - Icon: Car
   - Rechnungslauf (Link: `/billing-overview`) - Icon: FileText

   **Administration:**
   - Users (Link: `/users`) - Icon: UserCheck
   - Kunden (Link: `/customers`) - Icon: Users

4. **Uhr & Datum Anzeige** (unten links)
   - Format: `HH:MM` (z.B. "12:35")
   - Datum: `DD/MM/YYYY` (z.B. "26/08/2025")

#### Styling
- Hintergrund: `#274366`
- Buttons: `bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700`

---

### Billing Overview

**Route:** `/billing-overview`  
**Datei:** `app/billing-overview/page.tsx`

#### Zweck
Übersichtsseite für aktuelle und vergangene Rechnungsläufe mit Status-Informationen. Hauptansicht für die Verwaltung monatlicher Rechnungsläufe.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/`
   - Text: "Zurück zur Übersicht"
   - Icon: ArrowLeft

3. **Rechnungslauf-Erstellung** (immer verfügbar)

   **Monatsauswahl** (REQ-001, REQ-002):
   - **Monat ComboBox:** Januar - Dezember
   - **Jahr ComboBox:** Aktuelles Jahr und 5 Jahre zurück
   - **Button "Rechnungslauf erstellen"**
     - **Validierung:** Nur im Folgemonat möglich (z.B. für Oktober kann erst ab 1. November erstellt werden)
       - Wenn aktueller Monat ausgewählt wird: Fehlermeldung "Rechnungslauf kann nur im Folgemonat erstellt werden"
       - Wenn zukünftiger Monat ausgewählt wird: Fehlermeldung "Rechnungslauf kann nur für vergangene Monate erstellt werden"
     - **Hinweis:** Wird normalerweise automatisch per Cron Job ausgeführt, sobald PDF-Rechnungserstellung und EVN-Erstellung möglich sind
     - Lädt automatisch alle Kunden mit gültigem Tarif und Anschlussnummer
     - Zeigt Anzahl geladener Kunden
     - Rechnungszeitraum wird automatisch auf den vollen Monat gesetzt (1. bis letzter Tag)
   - **Status-Anzeige:** 
     - Zeigt an, ob für den ausgewählten Monat bereits ein Rechnungslauf existiert
     - Wenn Rechnungslauf existiert: "✓ Rechnungslauf vorhanden für {Monat} {Jahr}"
     - Wenn kein Rechnungslauf: "Kein Rechnungslauf für {Monat} {Jahr}"

4. **Bedingte Anzeige:**

   **Wenn Rechnungsläufe existieren:**
   - Zeigt Tabelle mit allen Rechnungsläufen
   - Monatsauswahl bleibt verfügbar für Erstellung neuer Rechnungsläufe

   **Monatsauswahl** (REQ-001, REQ-002):
   - **Monat ComboBox:** Januar - Dezember
   - **Jahr ComboBox:** Aktuelles Jahr und 5 Jahre zurück
   - **Button "Rechnungslauf erstellen"**
     - **Validierung:** Nur im Folgemonat möglich (z.B. für Oktober kann erst ab 1. November erstellt werden)
       - Wenn aktueller Monat ausgewählt wird: Fehlermeldung "Rechnungslauf kann nur im Folgemonat erstellt werden"
       - Wenn zukünftiger Monat ausgewählt wird: Fehlermeldung "Rechnungslauf kann nur für vergangene Monate erstellt werden"
     - **Hinweis:** Wird normalerweise automatisch per Cron Job ausgeführt, sobald PDF-Rechnungserstellung und EVN-Erstellung möglich sind
     - Lädt automatisch alle Kunden mit gültigem Tarif und Anschlussnummer
     - Zeigt Anzahl geladener Kunden
     - Rechnungszeitraum wird automatisch auf den vollen Monat gesetzt (1. bis letzter Tag)
   - **Status-Anzeige:** 
     - Zeigt an, ob für den ausgewählten Monat bereits ein Rechnungslauf existiert
     - Wenn Rechnungslauf existiert: "✓ Rechnungslauf vorhanden für {Monat} {Jahr}"
     - Wenn kein Rechnungslauf: "Kein Rechnungslauf für {Monat} {Jahr}"

4. **Rechnungslauf-Übersicht** (wenn Rechnungsläufe existieren)
   - Alle Rechnungsläufe werden in einer Tabelle aufgelistet (alle Monate)
   - Tabelle kann nach Monat/Jahr gefiltert werden
   - Jeder Rechnungslauf zeigt:
     - Monat/Jahr
     - Status
     - Anzahl Kunden
     - Zeitraum (Startdatum - Enddatum)

5. **Rechnungslauf-Aktionen** (pro Rechnungslauf in der Übersicht)
   - **Button "Rechnungslauf starten"** (REQ-003): 
     - Startet den Versand an alle Kunden (E-Mail-Versand)
     - PDF-Rechnungen und EVN müssen bereits erstellt sein
   - **Button "Fortsetzen"** (REQ-004): Nur bei teilweise verarbeiteten Rechnungsläufen
     - Verarbeitet nur Kunden mit Status "wartend" oder "Fehler"
   - **Button "Abbrechen"** (REQ-005): Während der Verarbeitung sichtbar
     - Bestätigungsdialog vor dem Abbrechen
     - Status wird auf "Abgebrochen" gesetzt
   - **Button "Alle neu generieren"** (REQ-006): Komplette Neuverarbeitung
     - Warnung dass alle bestehenden Daten überschrieben werden
   - **Button "Alle PDFs regenerieren"**: Regeneriert alle PDF-Rechnungen

6. **Statistik-Karten** (6 Spalten Grid) (REQ-028)
   - Nur sichtbar wenn Rechnungsläufe existieren

   **Gesamt Kunden:**
   ```typescript
   {
     total: number // Anzahl aller Kunden im Rechnungslauf
   }
   ```

   **Erfolgreich:**
   ```typescript
   {
     count: number // Anzahl erfolgreich verarbeiteter Kunden
   }
   ```
   - Farbe: Grün

   **Fehler:**
   ```typescript
   {
     count: number // Anzahl fehlgeschlagener Verarbeitungen
   }
   ```
   - Farbe: Rot

   **Grundgebühr gesamt:**
   ```typescript
   {
     total: number // Summe aller Grundgebühren (brutto) in EUR
   }
   ```
   - Format: "X.XXX,XX €"

   **Telefonie gesamt:**
   ```typescript
   {
     total: number // Summe aller Telefoniekosten (brutto) in EUR
   }
   ```
   - Format: "X.XXX,XX €"

   **Gesamtbetrag:**
   ```typescript
   {
     total: number // Summe aller Rechnungsbeträge (brutto) in EUR
   }
   ```
   - Format: "X.XXX,XX €"
   - Aktualisierung während der Verarbeitung in Echtzeit

7. **Fortschrittsanzeige während Verarbeitung** (REQ-007)
   - Nur sichtbar während aktiver Verarbeitung
   - **Prozentbalken** mit aktuellem Fortschritt
   - **Anzeige:** "X von Y Kunden verarbeitet"
   - **Live-Log** mit Einzelergebnissen:
     - Kundenname
     - Betrag
     - Status (farbcodiert: Grün = Erfolg, Rot = Fehler, Gelb = Warnung)
   - Scrollbares Log-Fenster

8. **Rechnungslauf-Tabelle** (alle Monate)
   - Nur sichtbar wenn Rechnungsläufe existieren

   **Spalten:**
   - Monat/Jahr (Format: "MMM YYYY", z.B. "Okt 2025")
   - Status (Badge mit Icon)
   - Anzahl Kunden (Format: "X/Y" - verarbeitet/gesamt)
   - Zeitraum (Format: "DD.MM.YYYY - DD.MM.YYYY")
   - Grundgebühr gesamt (Format: "X.XXX,XX €")
   - Telefonie gesamt (Format: "X.XXX,XX €")
   - Gesamtbetrag (Format: "X.XXX,XX €")
   - Aktionen (Dropdown oder Buttons)

   **Filter:**
   - Monat/Jahr Filter (Dropdown)
   - Status Filter (Mehrfachauswahl)
   - Suchfeld für Rechnungslauf ID

   **Aktionen pro Rechnungslauf:**
   - "Rechnungslauf erstellen" (nur wenn nicht vorhanden, nur im Folgemonat)
   - "Rechnungslauf starten" (Versand starten)
   - "Details anzeigen" → `/billing-run/{id}`
   - "Fortsetzen"
   - "Abbrechen"
   - "Alle neu generieren"

9. **Kundentabelle** (REQ-009, REQ-010, REQ-011)
   - Nur sichtbar wenn Rechnungsläufe existieren

   **Filter-Bereich** (REQ-010):
   - Filter-Felder direkt in der Tabellen-Header-Zeile unter jeder Spaltenüberschrift
   - **Kunden-ID:** Textsuche (Input-Feld)
   - **Name:** Textsuche (Input-Feld)
   - **Firma:** Textsuche (Input-Feld)
   - **Anschluss:** Textsuche (Input-Feld)
   - **Grundgebühr:** Textsuche (Input-Feld)
   - **Telefonie:** Textsuche (Input-Feld)
   - **Gesamt:** Textsuche (Input-Feld)
   - **Status:** Dropdown (Alle/Erfolg/Warnung/Fehler/Keine Daten)
   - **EVN aktiv:** Dropdown (Alle/Ja/Nein)
   - **EVN anonym:** Dropdown (Alle/Ja/Nein)
   - **Rechnung per Post:** Dropdown (Alle/Ja/Nein)
   - Filter werden in Echtzeit angewendet
   - Anzeige: Gefilterte Ergebnisse werden direkt in der Tabelle angezeigt

   **Tabelle Spalten:**
   - **Kunden-ID:** Interne Kundennummer (klickbar für Dashboard)
   - **Name:** Vor- und Nachname (klickbar für Dashboard)
   - **Firma:** Firmenname falls vorhanden
   - **Anschluss:** Telefon-Anschlussnummer
   - **Grundgebühr:** Monatliche Tarifgebühr (inkl. MwSt., Format: "X,XX €")
   - **Telefonie:** Telefoniekosten (inkl. MwSt., Format: "X,XX €")
   - **Gesamt:** Gesamtbetrag (inkl. MwSt., Format: "X,XX €")
   - **Status:** Aktueller Verarbeitungsstatus (Badge mit Icon)
   - **EVN:** Einzelverbindungsnachweis aktiv (✓/✗)
   - **EVN anonym:** Anonymisierter EVN (✓/✗)
   - **Rechnung per Post:** Post-Versand aktiv (✓/✗)
   - **Aktionen:** Button "Details" (Link zu Kunden-Detail)

   **Sortierung** (REQ-011):
   - Klick auf Spaltenüberschrift sortiert aufsteigend
   - Erneuter Klick sortiert absteigend
   - Sortierrichtung wird durch Pfeil-Icon angezeigt (↑/↓) neben Spaltenüberschrift
   - Sortier-Icon (↕) wird angezeigt wenn Spalte nicht sortiert ist
   - **Sortierbare Spalten:** Alle Spalten sind sortierbar:
     - Kunden-ID (alphabetisch)
     - Name (alphabetisch)
     - Firma (alphabetisch)
     - Anschluss (alphabetisch)
     - Grundgebühr (numerisch)
     - Telefonie (numerisch)
     - Gesamt (numerisch)
     - Status (alphabetisch)
     - EVN (boolean: Ja=1, Nein=0)
     - EVN anonym (boolean: Ja=1, Nein=0)
     - Rechnung per Post (boolean: Ja=1, Nein=0)

   **Aktionen-Dropdown pro Kunde:**
   - "Kunden-Details anzeigen" → Öffnet Modal
   - "PDF anzeigen" (nur wenn PDF vorhanden)
   - "PDF-Rechnung generieren" (Download)
   - "EVN anzeigen" (nur wenn EVN vorhanden)
   - "EVN neu generieren"
   - "Erneut verarbeiten"
   - "Positionen verwalten"
   - "Storno erstellen"
   - "Kunden-Dashboard" → Öffnet Rechnungshistorie

#### Status-Typen und Farben (REQ-008)

**Kunden-Verarbeitungsstatus:**

| Status | Farbe | Icon | Bedeutung |
|--------|-------|------|-----------|
| Wartend | Gelb (`bg-yellow-100 text-yellow-800`) | Clock | Noch nicht verarbeitet |
| Verarbeitung | Gelb (`bg-yellow-100 text-yellow-800`) | RefreshCw (spinning) | Wird gerade verarbeitet |
| Erfolg | Grün (`bg-green-100 text-green-800`) | CheckCircle | Erfolgreich abgeschlossen |
| Warnung | Orange (`bg-orange-100 text-orange-800`) | AlertTriangle | Abgeschlossen mit Hinweis (z.B. Tarif-Abweichung) |
| Fehler | Rot (`bg-red-100 text-red-800`) | AlertCircle | Verarbeitung fehlgeschlagen |
| Keine Daten | Grau (`bg-gray-100 text-gray-800`) | XCircle | Keine Anschlussnummer vorhanden |
| Abgebrochen | Rot (`bg-red-100 text-red-800`) | X | Durch Benutzer abgebrochen |

**Rechnungslauf Status:**

```typescript
{
  "Bereit": "bg-blue-100 text-blue-800", // Icon: Play
  "Erstellung" | "Verarbeitung": "bg-orange-100 text-orange-800", // Icon: Clock/RefreshCw
  "Abgeschlossen" | "Erfolgreich": "bg-green-100 text-green-800", // Icon: CheckCircle
  "Fehler": "bg-red-100 text-red-800", // Icon: AlertCircle
  "Wartend": "bg-gray-100 text-gray-800", // Icon: Clock
  "Abgebrochen": "bg-red-100 text-red-800" // Icon: X
}
```

#### Backend-API Anforderungen

**GET `/api/billing-runs?month={month}&year={year}`**
```typescript
{
  exists: boolean, // Ob Rechnungslauf für Monat existiert
  billingRun: {
    id: string | null,
    status: string | null,
    completed: number,
    total: number,
    errors: number
  } | null
}
```
- Prüft ob für den angegebenen Monat/Jahr ein Rechnungslauf existiert
- Wird verwendet um zu entscheiden, ob Monatsauswahl oder Tabelle angezeigt wird

**GET `/api/billing-runs`** (alle Rechnungsläufe)
```typescript
Array<{
  id: string,
  month: number,      // 1-12
  year: number,
  status: string,
  customerCount: { completed: number, total: number },
  period: { from: string, to: string }, // ISO 8601
  totalBaseFee: number,
  totalTelephony: number,
  totalAmount: number
}>
```
- Gibt alle Rechnungsläufe zurück (für Tabelle)

**POST `/api/billing-runs/create`** (REQ-002)
```typescript
Request: {
  month: number, // 1-12
  year: number,
  startDate: string, // ISO 8601 (1. Tag des Monats)
  endDate: string    // ISO 8601 (letzter Tag des Monats)
}
Response: {
  id: string,
  customerCount: number,
  status: "Bereit"
}
Error Response (400): {
  error: string,
  code: "INVALID_MONTH" | "ALREADY_EXISTS" | "FUTURE_MONTH"
}
```
- **Validierung:** 
  - Kann nur im Folgemonat erstellt werden (z.B. Oktober-Rechnungslauf kann erst ab 1. November erstellt werden)
  - Prüft ob Rechnungslauf für diesen Monat bereits existiert
  - Prüft ob Monat in der Zukunft liegt (nicht erlaubt)
- **Hinweis:** Wird normalerweise automatisch per Cron Job ausgeführt, sobald PDF-Rechnungserstellung und EVN-Erstellung möglich sind
- Lädt automatisch alle Kunden mit gültigem Tarif und Anschlussnummer

**POST `/api/billing-runs/{id}/start`** (REQ-003)
- Startet den Versand an alle Kunden (E-Mail-Versand)
- PDF-Rechnungen und EVN müssen bereits erstellt sein
- Response: Updated billing run object
- WebSocket/SSE für Live-Updates empfohlen

**POST `/api/billing-runs/{id}/continue`** (REQ-004)
- Setzt unterbrochenen Rechnungslauf fort
- Verarbeitet nur Kunden mit Status "wartend" oder "Fehler"
- Response: Updated billing run object

**POST `/api/billing-runs/{id}/cancel`** (REQ-005)
- Bricht laufenden Rechnungslauf ab
- Response: Updated billing run object (status: "Abgebrochen")

**POST `/api/billing-runs/{id}/regenerate-all`** (REQ-006)
- Generiert alle Kunden komplett neu
- Response: Updated billing run object

**GET `/api/billing-runs/{id}/statistics`** (REQ-028)
```typescript
{
  totalCustomers: number,
  successful: number,
  errors: number,
  totalBaseFee: number,    // Grundgebühr gesamt (brutto)
  totalTelephony: number,   // Telefonie gesamt (brutto)
  totalAmount: number       // Gesamtbetrag (brutto)
}
```

**GET `/api/billing-runs/{id}/customers?filters={...}&sort={field}&order={asc|desc}`** (REQ-009, REQ-010, REQ-011)
```typescript
{
  total: number,
  filtered: number,
  customers: Array<{
    id: string,
    customerId: string,
    name: string,
    company: string | null,
    connectionNumber: string | null,
    baseFee: number,        // Grundgebühr brutto
    telephony: number,      // Telefonie brutto
    total: number,          // Gesamt brutto
    status: "Wartend" | "Verarbeitung" | "Erfolg" | "Warnung" | "Fehler" | "Keine Daten" | "Abgebrochen",
    evnActive: boolean,
    evnAnonymous: boolean,
    invoicePerMail: boolean
  }>
}
```

**GET `/api/billing-runs/{id}/live-log`** (REQ-007)
- WebSocket oder Server-Sent Events (SSE) für Live-Log
- Streamt: `{ customer: string, amount: number, status: string, timestamp: string }`

---

### Alle Rechnungsläufe

**Route:** `/billing-runs`  
**Datei:** `app/billing-runs/page.tsx`  
**Client Component:** Ja (`"use client"`)

#### Zweck
Vollständige Übersicht aller Rechnungsläufe mit Filter- und Sortierfunktionen.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/billing-overview`
   - Text: "Zurück zur Übersicht"

3. **Titel:** "Alle Rechnungsläufe"

4. **Filter & Suche**

   **Suchfeld:**
   - Placeholder: "Rechnungslauf ID suchen..."
   - Icon: Search (links)
   - Filtert nach ID

   **Status-Filter (Dropdown):**
   - Optionen: "Alle Status", "Abgeschlossen", "Fehler", "Erstellung", "Bereit"

   **Sortierung (Dropdown):**
   - Optionen:
     - "Datum (Neueste zuerst)" - `date-desc`
     - "Datum (Älteste zuerst)" - `date-asc`
     - "Status (A-Z)" - `status-asc`
     - "Rechnungen (Höchste zuerst)" - `invoices-desc`
     - "Fehler (Meiste zuerst)" - `errors-desc`

5. **Rechnungslauf Tabelle**

   **Spalten:**
   - Rechnungslauf ID
   - Datum & Zeit (zweizeilig: Datum oben, Zeit unten)
   - Status (Badge)
   - Rechnungen (Anzahl)
   - Fehler (mit AlertTriangle Icon wenn > 0)
   - Dauer (Format: "X Min" oder "-")
   - Aktionen:
     - Button "Details" → `/billing-run/{id}`
     - Button "Starten" (nur wenn Status = "Bereit")

#### Datenstruktur

```typescript
interface BillingRun {
  id: string,              // z.B. "RUN-2025-001"
  date: string,            // Format: "DD.MM.YYYY"
  time: string,            // Format: "HH:MM"
  status: "Abgeschlossen" | "Fehler" | "Erstellung" | "Bereit",
  invoiceCount: number,
  errorCount: number,
  duration: string         // z.B. "23 Min" oder "-"
}
```

#### Backend-API Anforderungen

**GET `/api/billing-runs?search={term}&status={status}&sort={field}&order={asc|desc}`**
```typescript
Array<{
  id: string,
  date: string,        // ISO 8601 Date
  time: string,        // ISO 8601 Time
  status: string,
  invoiceCount: number,
  errorCount: number,
  duration: number | null // Minuten oder null
}>
```

**POST `/api/billing-runs/{id}/start`**
- Startet einen Rechnungslauf mit Status "Bereit"
- Response: Updated billing run object

---

### Rechnungslauf Detail

**Route:** `/billing-run/[id]`  
**Datei:** `app/billing-run/[id]/page.tsx`  
**Parameter:** `id` (z.B. "RUN-2025-001")

#### Zweck
Detaillierte Ansicht eines einzelnen Rechnungslaufs mit Rechnungsübersicht und Fehlerprotokoll.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/billing-overview`
   - Text: "Zurück zur Übersicht"

3. **Seiten-Header**
   - Titel: "Rechnungslauf {id}"
   - Untertitel: "{date} um {time}" (Monat/Jahr)
   - Aktionen:
     - Button "Export" (Icon: Download)
     - Button "Rechnungslauf starten" (nur wenn Status = "Bereit", Icon: Play)
       - Startet den Versand an alle Kunden (E-Mail-Versand)
       - PDF-Rechnungen und EVN müssen bereits erstellt sein
     - Button "Fortsetzen" (nur wenn teilweise verarbeitet, Icon: Play)
     - Button "Abbrechen" (während Verarbeitung, Icon: X)
     - Button "Alle neu generieren" (Icon: RefreshCw)

4. **Status-Übersicht Karten** (5 Spalten)

   **Status:**
   ```typescript
   {
     status: string,
     icon: CheckCircle (grün)
   }
   ```

   **Dauer:**
   ```typescript
   {
     duration: string, // z.B. "23 Minuten"
     icon: Clock (blau)
   }
   ```

   **Erfolgreich:**
   ```typescript
   {
     completedInvoices: number,
     icon: CheckCircle (grün)
   }
   ```

   **Fehler:**
   ```typescript
   {
     errorCount: number,
     icon: XCircle (rot)
   }
   ```

   **Einnahmen:**
   ```typescript
   {
     revenue: number, // Gesamteinnahmen in EUR
     icon: DollarSign (grün)
   }
   ```

5. **Fortschritt Card**
   - Progress Bar
   - Text: "Rechnungen erstellt: {completed}/{total}"
   - Prozentanzeige

6. **Tabs**

   **Tab 1: Rechnungsübersicht**

   **Filter-Bereich:**
   - Filter-Felder direkt in der Tabellen-Header-Zeile unter jeder Spaltenüberschrift
   - **Kunden-ID:** Textsuche (Input-Feld)
   - **Name:** Textsuche (Input-Feld)
   - **Firma:** Textsuche (Input-Feld)
   - **Anschluss:** Textsuche (Input-Feld)
   - **Grundgebühr:** Textsuche (Input-Feld)
   - **Telefonie:** Textsuche (Input-Feld)
   - **Gesamt:** Textsuche (Input-Feld)
   - **Status:** Dropdown (Alle/Erfolg/Warnung/Fehler)
   - **EVN aktiv:** Dropdown (Alle/Ja/Nein)
   - **EVN anonym:** Dropdown (Alle/Ja/Nein)
   - **Rechnung per Post:** Dropdown (Alle/Ja/Nein)
   - Filter werden in Echtzeit angewendet

   **Tabelle:**
   - Kunden-ID (sortierbar, filterbar)
   - Name (sortierbar, filterbar)
   - Firma (sortierbar, filterbar)
   - Anschluss (sortierbar, filterbar)
   - Grundgebühr (sortierbar, filterbar)
   - Telefonie (sortierbar, filterbar)
   - Gesamt (sortierbar, filterbar)
   - Status (sortierbar, filterbar, Badge)
   - EVN (sortierbar, filterbar, ✓/✗)
   - EVN anonym (sortierbar, filterbar, ✓/✗)
   - Rechnung per Post (sortierbar, filterbar, ✓/✗)
   - Aktionen (Button "Details" → `/customer/{id}`)

   **Sortierung:**
   - Klick auf Spaltenüberschrift sortiert aufsteigend/absteigend
   - Sortierrichtung wird durch Pfeil-Icon angezeigt (↑/↓) neben Spaltenüberschrift
   - Sortier-Icon (↕) wird angezeigt wenn Spalte nicht sortiert ist
   - Alle Spalten sind sortierbar
   
   **Lazy Loading:**
   - Scrollbare Tabelle mit automatischem Laden weiterer Kunden beim Scrollen
   - Lädt 50 Kunden pro Seite
   - Zeigt "Lädt..." während des Ladens

   **Tab 2: Fehlerprotokoll**

   **Fehlerliste:**
   ```typescript
   Array<{
     id: number,
     customer: string,
     message: string,
     timestamp: string, // ISO 8601
     level: "ERROR" | "WARNING"
   }>
   ```

   **Anzeige:**
   - Tabelle mit Spalten: Zeitstempel, Level, Kunde, Nachricht
   - Nur ERROR und WARNING (keine Schwere/severity)
   - Sortierung möglich nach: Zeitstempel, Level, Kunde
   - Sortierrichtung: Aufsteigend/Absteigend

#### Datenstruktur

```typescript
interface BillingRunDetail {
  id: string,
  date: string,              // Format: "DD.MM.YYYY"
  time: string,              // Format: "HH:MM"
  status: "Bereit" | "Erstellung" | "Abgeschlossen" | "Fehler",
  totalCustomers: number,
  completedInvoices: number,
  errorCount: number,
  revenue: number,           // Einnahmen gesamt
  duration: string,          // z.B. "23 Minuten"
  startedBy: string
}

interface Invoice {
  id: string,
  customerId: string,
  name: string,
  company: string | null,
  connectionNumber: string | null,
  baseFee: number,
  telephony: number,
  total: number,
  status: "Erfolg" | "Fehler" | "Warnung",
  evnActive: boolean,
  evnAnonymous: boolean,
  invoicePerMail: boolean,
  date: string              // Format: "DD.MM.YYYY"
}

interface ErrorLog {
  id: number,
  customer: string,
  message: string,
  timestamp: string,         // ISO 8601
  level: "ERROR" | "WARNING"
}
```

#### Backend-API Anforderungen

**GET `/api/billing-runs/{id}`**
```typescript
{
  id: string,
  date: string,              // ISO 8601
  time: string,             // ISO 8601
  status: string,
  totalCustomers: number,
  completedInvoices: number,
  errorCount: number,
  revenue: number,           // Einnahmen gesamt
  duration: number | null,   // Minuten
  startedBy: string
}
```

**GET `/api/billing-runs/{id}/invoices?customerId={term}&name={term}&company={term}&connectionNumber={term}&baseFee={term}&telephony={term}&total={term}&status={status}&evnActive={yes|no|all}&evnAnonymous={yes|no|all}&invoicePerMail={yes|no|all}&sortBy={column}&sortOrder={asc|desc}&page={page}&pageSize={pageSize}`**
```typescript
Array<{
  id: string,
  customerId: string,
  name: string,
  company: string | null,
  connectionNumber: string | null,
  baseFee: number,
  telephony: number,
  total: number,
  status: "Erfolg" | "Fehler" | "Warnung",
  evnActive: boolean,
  evnAnonymous: boolean,
  invoicePerMail: boolean,
  date: string             // ISO 8601
}>
```

**GET `/api/billing-runs/{id}/errors`**
```typescript
Array<{
  id: number,
  customer: string,
  error: string,
  timestamp: string,        // ISO 8601
  severity: string
}>
```

**POST `/api/billing-runs/{id}/start`**
- Startet den Rechnungslauf
- Response: Updated billing run object

**GET `/api/billing-runs/{id}/export`**
- Exportiert Daten des Rechnungslaufs (Format: CSV/Excel)

---

### Kunden Übersicht

**Route:** `/customers`  
**Datei:** `app/customers/page.tsx`  
**Client Component:** Ja (`"use client"`)

#### Zweck
Vollständige Übersicht aller Kunden mit ihren Rechnungsinformationen.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/billing-overview`
   - Text: "Zurück"

3. **Titel:** "Kunden Rechnungsübersicht"

4. **Statistik-Karten** (1 Spalte)

   **Gesamt Kunden:**
   ```typescript
   {
     total: number
   }
   ```

5. **Kunden Tabelle**

   **Filter-Bereich:**
   - Filter-Felder direkt in der Tabellen-Header-Zeile unter jeder Spaltenüberschrift
   - **Kundennummer:** Textsuche (Input-Feld)
   - **Vorname:** Textsuche (Input-Feld)
   - **Name:** Textsuche (Input-Feld)
   - **Firma:** Textsuche (Input-Feld)
   - **E-Mail:** Textsuche (Input-Feld)
   - **Letzte Rechnung:** Textsuche (Input-Feld)
   - **Letzter Betrag:** Textsuche (Input-Feld)
   - **Gesamt Rechnungen:** Textsuche (Input-Feld)
   - **Gesamt Betrag:** Textsuche (Input-Feld)
   - Filter werden in Echtzeit angewendet

   **Spalten:**
   - Kundennummer (sortierbar, filterbar)
   - Vorname (sortierbar, filterbar)
   - Name (sortierbar, filterbar)
   - Firma (sortierbar, filterbar, "-" wenn nicht vorhanden)
   - E-Mail (sortierbar, filterbar)
   - Letzte Rechnung (sortierbar, filterbar, Format: "DD.MM.YYYY, HH:MM")
   - Letzter Betrag (sortierbar, filterbar, Format: "X.XXX,XX €")
   - Gesamt Rechnungen (sortierbar, filterbar, Anzahl)
   - Gesamt Betrag (sortierbar, filterbar, Format: "X.XXX,XX €")
   - Aktionen (Button "Ansehen" → `/customer/{id}`)

   **Sortierung:**
   - Klick auf Spaltenüberschrift sortiert aufsteigend/absteigend
   - Sortierrichtung wird durch Pfeil-Icon angezeigt (↑/↓) neben Spaltenüberschrift
   - Sortier-Icon (↕) wird angezeigt wenn Spalte nicht sortiert ist
   - Alle Spalten sind sortierbar

#### Datenstruktur

```typescript
interface Customer {
  id: string,                    // z.B. "CUST-001"
  firstName: string,             // Vorname
  lastName: string,              // Nachname
  company: string | null,         // Firma (optional)
  email: string,
  customerNumber: string,         // z.B. "K-001"
  lastInvoiceDate: string,       // ISO 8601
  amount: number,                // Letzter Rechnungsbetrag
  invoiceNumber?: string,         // Letzte Rechnungsnummer
  totalInvoices: number,
  totalAmount: number
}
```

#### Backend-API Anforderungen

**GET `/api/customers?customerNumber={term}&firstName={term}&lastName={term}&company={term}&email={term}&lastInvoiceDate={term}&amount={term}&totalInvoices={term}&totalAmount={term}&sortBy={column}&sortOrder={asc|desc}`**
```typescript
{
  total: number,
  customers: Array<{
    id: string,
    firstName: string,
    lastName: string,
    company: string | null,
    email: string,
    customerNumber: string,
    lastInvoiceDate: string,     // ISO 8601
    amount: number,
    invoiceNumber: string | null,
    totalInvoices: number,
    totalAmount: number
  }>
}
```

---

### Kunde Detail

**Route:** `/customer/[id]`  
**Datei:** `app/customer/[id]/page.tsx`  
**Parameter:** `id` (z.B. "CUST-001")  
**Client Component:** Ja (`"use client"`)

#### Zweck
Detaillierte Ansicht eines einzelnen Kunden mit allen Rechnungen und Fehlerprotokoll.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/customers`
   - Text: "Zurück"

3. **Seiten-Header**
   - Avatar (Initiale des Kunden)
   - Titel: Kundenname

4. **Kundeninformationen Card** (REQ-012)

   **Kundendaten:**
   - Name, Firma, Adresse
   - E-Mail, Telefon
   - Kunden-ID
   - Anschlussnummer

   **Tarif-Informationen:**
   - Tarifname
   - Monatliche Grundgebühr
   - Download-/Upload-Rate
   - Mindestvertragslaufzeit
   - Vertragsbeginn
   - Kündigungsfrist

   **Purtel-Einstellungen:**
   - EVN aktiviert (Ja/Nein)
   - EVN anonymisiert (Ja/Nein)
   - Rechnung per E-Mail (Ja/Nein)
   - Vertragsbeginn laut Purtel
   - Weitere Purtel-Attribute (aufklappbarer Bereich)

   **Rechnungsdaten:**
   - Rechnungsnummer
   - Grundgebühr (netto/brutto)
   - Telefoniekosten (netto/brutto)
   - Gesamtbetrag (netto/brutto)
   - Verarbeitungsstatus
   - Fehlermeldung (falls vorhanden)

   **Rechte Spalte (2 Karten):**
   - Gesamt Rechnungen (Anzahl)
   - Gesamt Betrag (Format: "X.XXX,XX €")

5. **Statistik-Karten** (4 Spalten)

   **Gesamt Rechnungen:**
   ```typescript
   {
     total: number
   }
   ```

   **Zugestellt:**
   ```typescript
   {
     count: number // Status = "delivered"
   }
   ```

   **Fehler:**
   ```typescript
   {
     count: number // Status = "failed"
   }
   ```

   **Wartend:**
   ```typescript
   {
     count: number // Status = "pending"
   }
   ```

6. **Tabs für Rechnungsübersicht und Log**

   **Tab 1: Rechnungsübersicht**

   **Rechnungsübersicht Tabelle:**
   - Rechnungsnummer
   - Rechnungstyp (Normal, Storno, Ergänzend) (REQ-026)
   - Zeitraum (von - bis) (REQ-026)
   - Grundgebühr (brutto)
   - Telefonie (brutto)
   - Gesamt (brutto)
   - Datum (Format: "DD.MM.YYYY, HH:MM")
   - Status (Icon + Badge)
   - Aktionen:
     - Button "Ansehen" → `/invoice/{id}`
     - Button "PDF anzeigen" (REQ-014)
     - Button "Storno" (nur bei Normal-Rechnungen)
     - Button "Wiederholen" (nur bei fehlgeschlagenen Rechnungen)

   **Button "Individuelle Rechnung erstellen":**
   - Öffnet Dialog zum Erstellen einer individuellen Rechnung

   **Tab 2: Aktivitätslog**

   **Filter-Bereich:**
   - Suchfeld: Suche nach Beschreibung, Ziel oder Benutzer
   - Aktion-Filter (Dropdown): Alle Aktionen, Angelegt, Geändert, Gelöscht, Datenbankabfrage, Dateigenerierung, Rechnung erstellt, Rechnung versendet
   - Status-Filter (Dropdown): Alle Status, Erfolg, Fehler, Warnung

   **Log-Tabelle:**
   - Zeitstempel (sortierbar, Format: "DD.MM.YYYY, HH:MM")
   - Aktion (sortierbar, mit Icon):
     - Angelegt (UserPlus Icon)
     - Geändert (Edit Icon)
     - Gelöscht (UserMinus Icon)
     - Datenbankabfrage (Database Icon)
     - Dateigenerierung (FileCheck Icon)
     - Rechnung erstellt (FileText Icon)
     - Rechnung versendet (FileText Icon)
   - Beschreibung: Detaillierte Beschreibung der Aktion
   - Dauer (sortierbar): in Millisekunden (nur bei Datenbankabfragen und Dateigenerierungen)
   - Status (sortierbar, Badge): Erfolg (grün), Fehler (rot), Warnung (orange)
   - Ziel/Benutzer: Ziel der Aktion (z.B. Rechnungsnummer, "Rechnungsdaten", "Telefoniedaten") und Benutzer (falls vorhanden)
     - Details werden angezeigt, falls vorhanden

   **Protokollierte Aktivitäten:**
   - Kunde angelegt, geändert, gelöscht
   - Abfragen an externe Datenbanken (Rechnungsdaten, Telefoniedaten) mit Dauer
   - Dateigenerierungen (PDF-Rechnung, EVN-PDF) mit Dauer
   - Rechnung erstellt, versendet
   - System-Aktivitäten

   **Sortierung:**
   - Alle Spalten sind sortierbar (Zeitstempel, Aktion, Dauer, Status)
   - Standard-Sortierung: Zeitstempel absteigend (neueste zuerst)
     - Button "PDF-Rechnung generieren" (Download) (REQ-015)
     - Button "EVN anzeigen" (nur wenn EVN vorhanden) (REQ-016)
     - Button "EVN neu generieren" (REQ-017)
     - Button "Wiederholen" (nur wenn Status = "failed")
     - Button "Storno erstellen" (REQ-024)
     - Button "Ergänzende Rechnung erstellen" (REQ-027)

7. **Positionen** (REQ-019)
   - Kategorisierte Auflistung:
     - Telefonie
     - TV
     - Router-Miete
     - Sonstiges
   - Beschreibung und Betrag pro Position
   - Unterscheidung zwischen automatischen (aus Purtel) und manuellen Positionen

8. **Verarbeitungs-Log** (REQ-012)
   - Chronologische Liste aller Verarbeitungsschritte
   - Zeitstempel (Format: "HH:MM:SS")
   - Level: Info/Warnung/Fehler
   - Nachricht
   - Verarbeitungsdauer pro Schritt

#### Datenstruktur

```typescript
interface CustomerDetail {
  id: string,
  name: string,
  company: string | null,
  email: string,
  phone: string,
  address: string,
  customerNumber: string,
  connectionNumber: string | null,
  // Tarif-Informationen
  tariff: {
    name: string,
    monthlyFee: number,        // Grundgebühr
    downloadRate: string,       // z.B. "100 Mbit/s"
    uploadRate: string,         // z.B. "50 Mbit/s"
    minContractDuration: number, // Monate
    contractStart: string,     // ISO 8601
    cancellationPeriod: number  // Monate
  },
  // Purtel-Einstellungen
  purtel: {
    evnActive: boolean,
    evnAnonymous: boolean,
    invoicePerMail: boolean,
    contractStart: string,     // ISO 8601
    additionalAttributes: Record<string, any> // Aufklappbar
  },
  // Rechnungsdaten (aktueller Rechnungslauf)
  invoice: {
    invoiceNumber: string | null,
    baseFee: { netto: number, brutto: number },
    telephony: { netto: number, brutto: number },
    total: { netto: number, brutto: number },
    status: string,
    errorMessage: string | null
  },
  totalInvoices: number,
  totalAmount: number,
  lastInvoiceDate: string  // ISO 8601
}

interface Invoice {
  id: string,
  invoiceNumber: string,
  type: "Normal" | "Storno" | "Ergänzend", // REQ-026
  period: { from: string, to: string },     // REQ-026 (ISO 8601)
  date: string,            // ISO 8601
  amount: number,
  baseFee: number,         // brutto
  telephony: number,       // brutto
  status: "delivered" | "failed" | "pending",
  dueDate: string,         // ISO 8601
  description: string
}

interface InvoiceLineItem {
  id: number,
  description: string,
  category: "Telefonie" | "TV" | "Router-Miete" | "Sonstiges",
  quantity: number,
  unit: string | null,
  unitPrice: number,       // netto
  taxRate: number,         // z.B. 19
  total: number,           // netto
  isManual: boolean        // true = manuell hinzugefügt
}

interface ProcessingLog {
  id: string,
  timestamp: string,       // ISO 8601
  level: "INFO" | "WARNING" | "ERROR",
  message: string,
  duration?: number        // Millisekunden
}

interface ErrorLog {
  id: string,
  timestamp: string,       // ISO 8601
  type: "error" | "warning" | "info",
  message: string,
  details?: string
}
```

#### Backend-API Anforderungen

**GET `/api/customers/{id}`** (REQ-012)
```typescript
{
  id: string,
  name: string,
  company: string | null,
  email: string,
  phone: string,
  address: string,
  customerNumber: string,
  connectionNumber: string | null,
  tariff: {
    name: string,
    monthlyFee: number,
    downloadRate: string,
    uploadRate: string,
    minContractDuration: number,
    contractStart: string,
    cancellationPeriod: number
  },
  purtel: {
    evnActive: boolean,
    evnAnonymous: boolean,
    invoicePerMail: boolean,
    contractStart: string,
    additionalAttributes: Record<string, any>
  },
  invoice: {
    invoiceNumber: string | null,
    baseFee: { netto: number, brutto: number },
    telephony: { netto: number, brutto: number },
    total: { netto: number, brutto: number },
    status: string,
    errorMessage: string | null
  },
  totalInvoices: number,
  totalAmount: number,
  lastInvoiceDate: string
}
```

**GET `/api/customers/{id}/invoices`** (REQ-025, REQ-026)
```typescript
Array<{
  id: string,
  invoiceNumber: string,
  type: "Normal" | "Storno" | "Ergänzend",
  period: { from: string, to: string }, // ISO 8601
  baseFee: number,        // Grundgebühr brutto
  telephony: number,      // Telefonie brutto
  total: number,          // Gesamt brutto
  date: string,           // ISO 8601
  amount: number,         // Alias für total (Kompatibilität)
  status: "delivered" | "failed" | "pending",
  dueDate: string,        // ISO 8601
  description: string,
  createdAt: string       // ISO 8601
}>
```

**GET `/api/customers/{id}/line-items`** (REQ-019)
```typescript
Array<{
  id: number,
  description: string,
  category: string,
  quantity: number,
  unit: string | null,
  unitPrice: number,
  taxRate: number,
  total: number,
  isManual: boolean
}>
```

**GET `/api/customers/{id}/processing-log`** (REQ-012)
```typescript
Array<{
  id: string,
  timestamp: string,       // ISO 8601
  level: "INFO" | "WARNING" | "ERROR",
  message: string,
  duration: number | null
}>
```

**GET `/api/customers/{id}/error-logs`**
```typescript
Array<{
  id: string,
  timestamp: string,       // ISO 8601
  type: string,
  message: string,
  details: string | null
}>
```

**GET `/api/customers/{id}/activity-log?action={action}&status={status}&search={term}&sortBy={column}&sortOrder={asc|desc}`**
```typescript
Array<{
  id: string,
  timestamp: string,       // ISO 8601
  action: "create" | "update" | "delete" | "database_query" | "file_generation" | "invoice_created" | "invoice_sent",
  description: string,
  duration?: number,       // in milliseconds (nur bei database_query und file_generation)
  status: "success" | "error" | "warning",
  details?: string,        // Zusätzliche Details (z.B. Fehlermeldungen)
  user?: string,           // Benutzer, der die Aktion durchgeführt hat
  target?: string          // Ziel der Aktion (z.B. Rechnungsnummer, "Rechnungsdaten", "Telefoniedaten")
}>
```

**GET `/api/invoices/{id}/pdf`** (REQ-014, REQ-015)
- Anzeige: `Content-Type: application/pdf` (öffnet in neuem Tab)
- Download: `Content-Disposition: attachment`

**GET `/api/invoices/{id}/evn`** (REQ-016)
- EVN PDF anzeigen
- Response: PDF-Datei

**POST `/api/invoices/{id}/evn/regenerate`** (REQ-017)
- Generiert EVN neu
- Response: Updated invoice object

**POST `/api/invoices/{id}/retry`** (REQ-018)
- Wiederholt fehlgeschlagene Rechnung
- Response: Updated invoice object

**POST `/api/invoices/{id}/reprocess`** (REQ-018)
- Verarbeitet Kunde erneut
- Alle Daten werden zurückgesetzt
- Response: Updated invoice object

**POST `/api/customers/{id}/individual-invoice`**
```typescript
Request: {
  lineItems: Array<{
    description: string,
    category: "Vertrag" | "Telefonie" | "Miete" | "Sonstiges",
    quantity: number,
    unitPrice: number,     // netto
    taxRate: number        // in %
  }>
}
Response: {
  id: string,
  invoiceNumber: string,   // beginnt mit "RG-IND-" oder "RG-ERG-"
  ...
}
```
- Erstellt individuelle Rechnung mit eigenen Positionen
- Alle Positionen haben konfigurierbare MwSt.

---

### Kunden-Dashboard (Rechnungshistorie)

**Route:** `/customer/[id]` (integriert in Kunde Detail)  
**Zugriff:** Über Klick auf Kundennamen in Tabelle oder Link "Kundendashboard" von Rechnung Detail (REQ-025)

#### Zweck
Vollständige Übersicht aller Rechnungen eines Kunden mit Rechnungshistorie und Möglichkeit zur Erstellung von Storno- und Ergänzungsrechnungen. Integriert in die Kunde Detail-Seite.

#### UI-Komponenten

1. **Seiten-Header**
   - Titel: Kundenname
   - Zurück-Button zu `/customers`

2. **Kundeninformationen Card**
   - Kundendaten (Nummer, E-Mail, Telefon, Adresse)
   - Statistik-Karten (Gesamt Rechnungen, Gesamt Betrag)

3. **Statistik-Karten** (4 Spalten)
   - Gesamt Rechnungen
   - Zugestellt
   - Fehler
   - Wartend

4. **Rechnungshistorie Tabelle** (REQ-026)

   **Spalten:**
   - Rechnungsnummer
   - Rechnungstyp (Normal, Storno, Ergänzend) (Badge)
   - Zeitraum (von - bis) (Format: "DD.MM.YYYY - DD.MM.YYYY")
   - Grundgebühr (brutto, Format: "X,XX €")
   - Telefonie (brutto, Format: "X,XX €")
   - Gesamt (brutto, Format: "X,XX €")
   - Status (Icon + Badge)
   - Erstellungsdatum (Format: "DD.MM.YYYY, HH:MM")

   **Aktionen pro Rechnung:**
   - "PDF anzeigen" (REQ-014)
   - "EVN anzeigen" (wenn vorhanden) (REQ-016)
   - "Details anzeigen" → `/invoice/{id}`
   - "Storno erstellen" (REQ-024)

3. **Individuelle Rechnung erstellen**

   **Button:** "Individuelle Rechnung erstellen"
   - Öffnet Dialog mit Formular
   - Eingabefelder pro Position:
     - Beschreibung (Pflichtfeld)
     - Kategorie: "Vertrag", "Telefonie", "Miete", "Sonstiges" (Dropdown)
     - Menge (Standard: 1)
     - Einzelpreis (netto)
     - MwSt.-Satz in % (Standard: 19%, konfigurierbar pro Position)
   - Mehrere Positionen hinzufügbar
   - Positionen können entfernt werden
   - Berechnung:
     - Gesamt (netto) = Menge × Einzelpreis
     - MwSt. gesamt = Summe aller (Gesamt × MwSt.-Satz / 100)
     - Gesamtbetrag (brutto) = Zwischensumme (netto) + MwSt. gesamt
   - Vorschau des Gesamtbetrags
   - Button "Rechnung erstellen"
   - Rechnungsnummer beginnt mit "RG-IND-" oder "RG-ERG-"
   - PDF wird automatisch generiert
   - Erscheint in der Rechnungsübersicht

#### Datenstruktur

```typescript
interface CustomerDashboard {
  customer: {
    id: string,
    name: string,
    customerNumber: string
  },
  invoices: Array<{
    id: string,
    invoiceNumber: string,
    type: "Normal" | "Storno" | "Ergänzend",
    period: { from: string, to: string }, // ISO 8601
    baseFee: number,      // brutto
    telephony: number,    // brutto
    total: number,        // brutto
    status: string,
    createdAt: string      // ISO 8601
  }>
}
```

#### Backend-API Anforderungen

**GET `/api/customers/{id}/invoices`** (REQ-025, REQ-026)
```typescript
{
  customer: {
    id: string,
    name: string,
    customerNumber: string
  },
  invoices: Array<{
    id: string,
    invoiceNumber: string,
    type: string,
    period: { from: string, to: string },
    baseFee: number,
    telephony: number,
    total: number,
    status: string,
    createdAt: string
  }>
}
```

---

### Rechnung Detail

**Route:** `/invoice/[id]`  
**Datei:** `app/invoice/[id]/page.tsx`  
**Parameter:** `id` (z.B. "2025-001-001")

#### Zweck
Detaillierte Ansicht einer einzelnen Rechnung mit allen Positionen und Fehlerprotokoll.

#### UI-Komponenten

1. **Header** (wie oben beschrieben)

2. **Zurück-Button**
   - Link: `/billing-run/RUN-2025-001` (oder relevanter Rechnungslauf)
   - Text: "Zurück zum Rechnungslauf"

3. **Seiten-Header**
   - Titel: "Rechnung {id}"
   - Untertitel: Kundename
   - Status-Badge: Zeigt Verarbeitungsstatus (wie in Übersicht: "Erfolg", "Fehler", "Warnung", etc.)
   - Link "Kundendashboard" → `/customer/{customerId}/dashboard`
   - Aktionen:
     - Button "PDF anzeigen" (REQ-014) - Öffnet PDF in neuem Tab
     - Button "PDF-Rechnung generieren" (REQ-015) - Download
     - Button "EVN neu generieren" (REQ-017)
     - Button "Neu erstellen" (Icon: RefreshCw)
     - Button "Versenden" (Icon: Send, grün)
     - Button "Storno erstellen" (REQ-024) - Öffnet Dialog zum Erstellen neuer Rechnung
     - Button "Positionen verwalten" (REQ-019)

4. **Rechnungsübersicht Karten** (3 Spalten)

   **Rechnungsdetails:**
   ```typescript
   {
     status: "Erfolgreich" | "Fehler" | "Ausstehend",
     date: string,          // Format: "DD.MM.YYYY"
     dueDate: string,       // Format: "DD.MM.YYYY"
     type: "Monatlich" | "Quartalsweise" | "Jährlich",
     billingPeriod: string  // z.B. "August 2025"
   }
   ```

   **Kunde:**
   ```typescript
   {
     customer: string,
     customerAddress: string // Mehrzeilig, Format: "Straße\nPLZ Ort\nLand"
   }
   ```

   **Rechnungsbetrag:**
   ```typescript
   {
     amount: string,        // Format: "€X.XXX,XX"
     billingPeriod: string
   }
   ```

5. **Tabs** (Tab-Navigation)

   **Tab 1: Rechnungspositionen**

   **Tabelle:**
   - Beschreibung
   - Kategorie (Badge)
   - Menge (mit Einheit, z.B. "245 Minuten" oder "1 Stk.")
   - Einzelpreis (Format: "€X,XX")
   - Gesamt (Format: "€X,XX", rechtsbündig)

   **Zusammenfassung:**
   - Zwischensumme
   - MwSt. (19%)
   - Gesamtbetrag (fett, größer)

   **Tab 2: EVN (Einzelverbindungsnachweis)** (REQ-016)

   **Anzeige:**
   - Daten werden direkt in einer Tabelle angezeigt (kein Button zum Anzeigen nötig)
   - Button "EVN PDF herunterladen" - Download des EVN als PDF
   - Button "EVN neu generieren" (REQ-017)
   - Tabelle mit Spalten:
     - Datum
     - Uhrzeit
     - Von (Rufnummer oder "***" wenn anonymisiert)
     - Nach (Rufnummer oder "***" wenn anonymisiert)
     - Dauer
     - Richtung
     - Kosten (nur wenn nicht anonymisiert)
   - Beispieldaten werden direkt angezeigt

   **Tab 3: Log**

   **Tabelle:**
   - Zeitstempel (monospace, klein, Format: "DD.MM.YYYY, HH:MM:SS")
   - Level (Badge: ERROR=rot, WARNING=gelb, INFO=grau)
   - Komponente
   - Nachricht
   - Keine Status-Spalte (nur Log-Einträge)
   - Erfolgreiche Generierung wird als INFO geloggt

#### Datenstruktur

```typescript
interface InvoiceDetail {
  id: string,
  customer: string,
  customerAddress: string,  // Mehrzeilig
  amount: number,
  status: string,
  date: string,             // ISO 8601
  dueDate: string,          // ISO 8601
  type: string,
  billingPeriod: string
}

interface InvoiceLineItem {
  id: number,
  description: string,
  category: "Vertrag" | "Telefonie" | "Miete" | "Sonstiges",
  quantity: number,
  unit?: string | null,     // z.B. "Minuten", "GB", "SMS" oder null für "Stk."
  unitPrice: number,        // netto
  taxRate: number,          // Mehrwertsteuersatz in % (z.B. 19)
  total: number             // netto
}

interface ErrorLog {
  id: number,
  timestamp: string,        // Format: "DD.MM.YYYY, HH:MM:SS"
  level: "ERROR" | "WARNING" | "INFO",
  message: string,
  component: string,        // z.B. "PDF Generator", "Mail Service", "Billing Engine"
  resolved: boolean
}
```

7. **Positionen verwalten Modal** (REQ-019, REQ-020, REQ-021)

   **Anzeige:**
   - Liste aller Positionen (automatisch + manuell)
   - Spalten: Beschreibung, Menge, Einzelpreis, MwSt., Gesamtpreis
   - Kennzeichnung: Automatische Positionen (aus Purtel) vs. manuelle Positionen

   **Position hinzufügen** (REQ-020):
   - Formular mit Feldern:
     - Beschreibung (Pflichtfeld)
     - Menge (Standard: 1)
     - Einzelpreis in EUR (netto)
     - MwSt.-Satz in % (Standard: 19%)
   - Gesamtbetrag wird automatisch aktualisiert
   - Button "Hinzufügen"
   - PDF muss neu generiert werden für Aktualisierung

   **Position entfernen** (REQ-021):
   - Button "Entfernen" pro manueller Position
   - Bestätigungsdialog vor dem Löschen
   - Automatische Positionen können nicht gelöscht werden
   - Gesamtbetrag wird automatisch aktualisiert

8. **Storno-Rechnung Dialog** (REQ-022, REQ-023, REQ-024)

   **Zugriff:**
   - Button "Storno erstellen" in der Rechnungsdetailansicht
   - Öffnet Dialog zum Erstellen einer neuen Rechnung

   **Dialog-Funktionalität:**
   - **Vorausgefüllte Storno-Positionen:**
     - Alle Positionen der Original-Rechnung werden vorausgefüllt
     - Alle Beträge sind negativ (Storno)
     - Positionen sind einzeln auswählbar (Checkboxen zum Einschließen/Ausschließen)
   
   **Bearbeitungsmöglichkeiten** (REQ-023):
   - Alle Felder sind bearbeitbar:
     - Beschreibung
     - Kategorie: "Vertrag", "Telefonie", "Miete", "Sonstiges" (Dropdown)
     - Menge
     - Einzelpreis (netto, automatisch negativ)
     - MwSt.-Satz in % (konfigurierbar pro Position)
   - Positionen können entfernt werden (Checkbox deaktivieren)
   - **Neue Positionen können hinzugefügt werden**
   - Gesamtbetrag aktualisiert sich automatisch
   - Vorschau des Storno-Gesamtbetrags (negativ)

   **Storno erstellen** (REQ-024):
   - Eingabefeld: Storno-Grund (optional)
   - Button "Storno-Rechnung erstellen"
   - Storno-Rechnungsnummer beginnt mit "ST-"
   - PDF wird automatisch generiert
   - Storno-Rechnung erscheint im Kunden-Dashboard

9. **Ergänzende Rechnung Modal** (REQ-027)

   **Formular:**
   - Beschreibung
   - Menge
   - Einzelpreis (netto)
   - MwSt.-Satz
   - Mehrere Positionen hinzufügbar
   - Vorschau des Gesamtbetrags
   - Button "Ergänzende Rechnung erstellen"
   - Rechnungsnummer beginnt mit "RG-ERG-"
   - PDF wird automatisch generiert
   - Erscheint in der Rechnungsübersicht

#### Berechnungen

```typescript
subtotal = sum(lineItems.total)
tax = subtotal * 0.19
total = subtotal + tax
```

#### Backend-API Anforderungen

**GET `/api/invoices/{id}`**
```typescript
{
  id: string,
  customer: string,
  customerAddress: string,
  amount: number,
  status: string,
  date: string,             // ISO 8601
  dueDate: string,         // ISO 8601
  type: string,
  billingPeriod: string,
  lineItems: Array<{
    id: number,
    description: string,
    category: string,
    quantity: number,
    unit: string | null,
    unitPrice: number,
    total: number
  }>,
  subtotal: number,
  tax: number,
  total: number
}
```

**GET `/api/invoices/{id}/error-logs`**
```typescript
Array<{
  id: number,
  timestamp: string,       // ISO 8601
  level: string,
  message: string,
  component: string,
  resolved: boolean
}>
```

**GET `/api/invoices/{id}/pdf`**
- Download PDF der Rechnung

**POST `/api/invoices/{id}/recreate`**
- Erstellt Rechnung neu
- Response: Updated invoice object

**POST `/api/invoices/{id}/send`**
- Versendet Rechnung per E-Mail
- Response: Updated invoice object

**GET `/api/invoices/{id}/line-items`** (REQ-019)
```typescript
Array<{
  id: number,
  description: string,
  category: string,
  quantity: number,
  unit: string | null,
  unitPrice: number,
  taxRate: number,
  total: number,
  isManual: boolean
}>
```

**POST `/api/invoices/{id}/line-items`** (REQ-020)
```typescript
Request: {
  description: string,
  quantity: number,
  unitPrice: number,
  taxRate: number
}
Response: {
  id: number,
  ...lineItem
}
```

**DELETE `/api/invoices/{id}/line-items/{itemId}`** (REQ-021)
- Löscht manuelle Position
- Response: Success

**GET `/api/invoices/{id}/storno-preview`** (REQ-022)
```typescript
{
  originalInvoice: {
    id: string,
    lineItems: Array<InvoiceLineItem> // Alle Positionen der Original-Rechnung
  }
}
```
- Gibt alle Positionen der Original-Rechnung zurück (für Vorausfüllung)

**POST `/api/invoices/{id}/storno`** (REQ-024)
```typescript
Request: {
  lineItems: Array<{
    id?: number,              // Original-Position ID (optional, wenn neue Position)
    description: string,
    quantity: number,
    unitPrice: number,         // Negativ für Storno
    taxRate: number,
    isIncluded: boolean        // Ob Position in Storno enthalten ist
  }>,
  reason?: string
}
Response: {
  id: string,
  invoiceNumber: string, // beginnt mit "ST-"
  lineItems: Array<InvoiceLineItem>,
  total: number,        // Negativ
  ...
}
```
- Erstellt neue Storno-Rechnung
- Alle Beträge werden negativ gespeichert
- Neue Positionen können hinzugefügt werden

**POST `/api/invoices/{id}/supplementary`** (REQ-027)
```typescript
Request: {
  lineItems: Array<{
    description: string,
    quantity: number,
    unitPrice: number,
    taxRate: number
  }>
}
Response: {
  id: string,
  invoiceNumber: string, // beginnt mit "RG-ERG-"
  ...
}
```

---

## Gemeinsame Datenstrukturen

### Status-Typen

**Rechnungslauf Status:**
```typescript
type BillingRunStatus = 
  | "Bereit"           // Bereit zum Starten
  | "Erstellung"       // Läuft gerade
  | "Abgeschlossen"    // Erfolgreich beendet
  | "Fehler"           // Mit Fehlern beendet
  | "Wartend"          // Wartet auf Start
```

**Kunden-Verarbeitungsstatus:**
```typescript
type CustomerProcessingStatus = 
  | "Wartend"          // Noch nicht verarbeitet
  | "Verarbeitung"      // Wird gerade verarbeitet
  | "Erfolg"           // Erfolgreich abgeschlossen
  | "Warnung"          // Abgeschlossen mit Hinweis (z.B. Tarif-Abweichung)
  | "Fehler"           // Verarbeitung fehlgeschlagen
  | "Keine Daten"      // Keine Anschlussnummer vorhanden
  | "Abgebrochen"      // Durch Benutzer abgebrochen
```

**Rechnungs Status:**
```typescript
type InvoiceStatus = 
  | "Erfolgreich"      // Erfolgreich erstellt und versendet
  | "Fehler"           // Fehler beim Erstellen/Versenden
  | "Ausstehend"       // Noch nicht verarbeitet
  | "Zugestellt"       // Erfolgreich zugestellt (Kundenansicht)
  | "delivered"        // Technischer Status (Kundenansicht)
  | "failed"           // Technischer Status (Kundenansicht)
  | "pending"          // Technischer Status (Kundenansicht)
```

**Rechnungstyp:**
```typescript
type InvoiceType = 
  | "Normal"           // Standard-Rechnung
  | "Storno"           // Storno-Rechnung (beginnt mit "ST-")
  | "Ergänzend"        // Ergänzende Rechnung (beginnt mit "RG-ERG-")
```

### Datumsformate

**Anzeige:**
- Datum: `DD.MM.YYYY` (z.B. "26.08.2025")
- Zeit: `HH:MM` (z.B. "14:30")
- Datum & Zeit: `DD.MM.YYYY, HH:MM` (z.B. "26.08.2025, 14:30")
- Zeitstempel: `DD.MM.YYYY, HH:MM:SS` (z.B. "26.08.2025, 14:32:15")

**API (ISO 8601):**
- Datum: `YYYY-MM-DD` (z.B. "2025-08-26")
- Datum & Zeit: `YYYY-MM-DDTHH:MM:SS` (z.B. "2025-08-26T14:30:00")

### Währungsformate

**Anzeige:**
- Format: `X.XXX,XX €` (z.B. "1.234,56 €")
- Locale: `de-DE`
- Currency: `EUR`

**API:**
- Format: `number` (z.B. 1234.56)

### Badge-Farben

```typescript
{
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800" | "bg-orange-100 text-orange-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800"
}
```

---

## API-Endpunkt Zusammenfassung

### Rechnungsläufe

- `GET /api/billing-runs/current?month={month}&year={year}` - Aktueller Lauf für Monat
- `GET /api/billing-runs/latest` - Letzter Lauf
- `GET /api/billing-runs/history?limit={n}` - Historie
- `GET /api/billing-runs` - Alle Läufe (mit Filter/Sortierung)
- `GET /api/billing-runs/{id}` - Lauf Details
- `GET /api/billing-runs/{id}/statistics` - Statistiken (Gesamtbeträge)
- `GET /api/billing-runs/{id}/customers` - Kunden eines Laufs (mit Filter/Sortierung)
- `GET /api/billing-runs/{id}/invoices` - Rechnungen eines Laufs
- `GET /api/billing-runs/{id}/errors` - Fehler eines Laufs
- `GET /api/billing-runs/{id}/live-log` - Live-Log (WebSocket/SSE)
- `POST /api/billing-runs/create` - Neuen Rechnungslauf erstellen
- `POST /api/billing-runs/{id}/start` - Versand an alle Kunden starten (E-Mail-Versand)
- `POST /api/billing-runs/{id}/continue` - Lauf fortsetzen
- `POST /api/billing-runs/{id}/cancel` - Lauf abbrechen
- `POST /api/billing-runs/{id}/regenerate-all` - Alle neu generieren
- `GET /api/billing-runs/{id}/export` - Export

### Kunden

- `GET /api/customers?search={term}&status={status}` - Alle Kunden
- `GET /api/customers/overview?limit={n}` - Kunden-Übersicht
- `GET /api/customers/{id}` - Kunde Details (inkl. Tarif, Purtel)
- `GET /api/customers/{id}/invoices` - Alle Rechnungen eines Kunden (inkl. Rechnungshistorie mit Typ, Zeitraum, etc.)
- `GET /api/customers/{id}/line-items` - Rechnungspositionen
- `GET /api/customers/{id}/activity-log` - Aktivitätslog (Anlegen, Ändern, Löschen, Datenbankabfragen, Dateigenerierungen mit Dauer)
- `GET /api/customers/{id}/error-logs` - Fehlerprotokoll eines Kunden

### Rechnungen

- `GET /api/invoices/{id}` - Rechnung Details
- `GET /api/invoices/{id}/pdf` - PDF anzeigen/downloaden
- `GET /api/invoices/{id}/evn` - EVN anzeigen
- `GET /api/invoices/{id}/line-items` - Rechnungspositionen
- `GET /api/invoices/{id}/error-logs` - Fehlerprotokoll
- `GET /api/invoices/{id}/storno-preview` - Storno-Vorschau
- `POST /api/invoices/{id}/line-items` - Position hinzufügen
- `DELETE /api/invoices/{id}/line-items/{itemId}` - Position entfernen
- `POST /api/invoices/{id}/recreate` - Neu erstellen
- `POST /api/invoices/{id}/send` - Versenden
- `POST /api/invoices/{id}/retry` - Wiederholen
- `POST /api/invoices/{id}/reprocess` - Erneut verarbeiten
- `POST /api/invoices/{id}/storno` - Storno-Rechnung erstellen
- `POST /api/invoices/{id}/supplementary` - Ergänzende Rechnung erstellen
- `POST /api/invoices/{id}/evn/regenerate` - EVN neu generieren

---

## UI-Komponenten Bibliothek

Das Projekt verwendet **shadcn/ui** Komponenten:

- `Button` - Buttons mit verschiedenen Varianten
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - Karten
- `Badge` - Status-Badges
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead` - Tabellen
- `Progress` - Fortschrittsbalken
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Tabs
- `Input` - Eingabefelder
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` - Dropdowns
- `Separator` - Trennlinien

**Icons:** Lucide React (`lucide-react`)

---

## Styling-Hinweise

- **Hauptfarbe:** `#274366` (Dunkelblau) als Hintergrund
- **Weißer Header:** `bg-white/95 backdrop-blur-sm`
- **Karten:** Weißer Hintergrund mit grauen Borders
- **Buttons:** Verschiedene Varianten (outline, default, ghost)
- **Responsive:** Grid-Layouts mit `md:` und `lg:` Breakpoints
- **Text-Farben:** Grau-Skala für verschiedene Hierarchien

---

## Notizen für Backend-Integration

1. **Status-Mapping:** Die Frontend-Status-Werte müssen mit Backend-Status-Werten gemappt werden
   - Kunden-Verarbeitungsstatus: "Wartend", "Verarbeitung", "Erfolg", "Warnung", "Fehler", "Keine Daten", "Abgebrochen"
   - Rechnungslauf-Status: "Bereit", "Erstellung", "Abgeschlossen", "Fehler", "Wartend", "Abgebrochen"

2. **Datum-Konvertierung:** API sollte ISO 8601 verwenden, Frontend konvertiert zur Anzeige
   - Rechnungszeitraum: Automatisch 1. bis letzter Tag des Monats

3. **Währung:** API sollte Zahlen verwenden, Frontend formatiert zur Anzeige
   - Alle Beträge in EUR
   - Netto/Brutto-Unterscheidung bei Rechnungsdaten

4. **Pagination:** Aktuell nicht implementiert, sollte für große Datenmengen hinzugefügt werden

5. **Real-time Updates:** Für laufende Rechnungsläufe könnten WebSockets oder Server-Sent Events (SSE) nützlich sein
   - Live-Log während Verarbeitung
   - Fortschrittsanzeige in Echtzeit
   - Status-Updates pro Kunde

6. **Fehlerbehandlung:** API sollte strukturierte Fehlerantworten liefern
   - Bei API-Fehlern wird der Kunde als "Fehler" markiert, nicht die gesamte Verarbeitung
   - Fehlermeldungen werden im Log gespeichert
   - Unterbrochene Verarbeitungen können fortgesetzt werden

7. **Authentifizierung:** Aktuell nicht implementiert, sollte hinzugefügt werden
   - Zugang nur für autorisierte Benutzer
   - API-Zugangsdaten sicher in Umgebungsvariablen speichern

8. **Datenquellen:**
   - **Interne Datenbank:** Kundenstammdaten, Tarifinformationen, Anschlussnummern, Vertragsdaten
   - **Purtel API:** Telefonie-Buchungen, Einzelverbindungsdaten (CDR) für EVN, Kundeneinstellungen, Vertragsbeginn

9. **PDF-Generierung:**
   - Format: PDF/A (archivierbar)
   - Enthält: ZUGFeRD XML für elektronische Verarbeitung
   - Sprache: Deutsch
   - Währung: EUR

10. **EVN (Einzelverbindungsnachweis):**
    - Format: PDF
    - Spalten: Datum, Uhrzeit, Von, Nach, Dauer, Richtung
    - Optional: Kosten (wenn nicht anonymisiert)
    - Anonymisierung: Rufnummern können anonymisiert werden

11. **Rechnungsnummern-Konventionen:**
    - Normal: Standard-Format (z.B. "RG-2025-001")
    - Storno: Beginnt mit "ST-" (z.B. "ST-2025-001")
    - Ergänzend: Beginnt mit "RG-ERG-" (z.B. "RG-ERG-2025-001")

12. **Kunden-Laden beim Erstellen:**
    - System lädt automatisch alle Kunden mit gültigem Tarif und Anschlussnummer
    - Anzeige der Anzahl geladener Kunden

16. **Cron Job für automatische Rechnungslauf-Erstellung:**
    - Rechnungslauf wird automatisch per Cron Job erstellt, sobald:
      - PDF-Rechnungserstellung möglich ist
      - EVN-Erstellung möglich ist
      - Folgemonat erreicht ist (z.B. Oktober-Rechnungslauf wird automatisch ab 1. November erstellt)
    - Manuelle Erstellung ist weiterhin möglich, aber normalerweise nicht nötig

17. **Rechnungslauf starten:**
    - Startet den E-Mail-Versand an alle Kunden
    - PDF-Rechnungen und EVN müssen bereits erstellt sein
    - Unterscheidet sich von der Rechnungserstellung (die automatisch per Cron Job erfolgt)

13. **Positionen:**
    - Unterscheidung zwischen automatischen (aus Purtel) und manuellen Positionen
    - Automatische Positionen können nicht gelöscht werden
    - Manuelle Positionen können hinzugefügt/entfernt werden

14. **Storno-Rechnungen:**
    - Alle Beträge werden negativ dargestellt
    - Verknüpfung mit Original-Rechnung erforderlich
    - Teilstornierungen möglich

15. **MwSt.:**
    - Standard: 19%
    - Konfigurierbar pro Position

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Rechnungslauf** | Monatlicher Prozess zur Erstellung aller Kundenrechnungen |
| **EVN** | Einzelverbindungsnachweis - Detaillierte Auflistung aller Telefonverbindungen |
| **Purtel** | Externer Telefonie-Provider mit API für Verbindungsdaten |
| **CDR** | Call Detail Records - Rohdaten der Telefonverbindungen |
| **Grundgebühr** | Monatlicher Festbetrag des Tarifs |
| **Storno-Rechnung** | Gutschrift zur Korrektur einer fehlerhaften Rechnung |
| **Ergänzende Rechnung** | Zusätzliche Rechnung für nachträgliche Leistungen |
| **ZUGFeRD** | Standard für elektronische Rechnungen (PDF/A mit XML) |

---

*Erstellt: 2025*  
*Version: 2.0*  
*Erweitert basierend auf REQUIREMENTS-RECHNUNGSLAUF-DASHBOARD.md*

