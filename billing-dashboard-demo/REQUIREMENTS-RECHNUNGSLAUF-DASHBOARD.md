# Rechnungslauf Dashboard - Anforderungsdokumentation

## 1. Produktübersicht

### 1.1 Zweck
Das **Rechnungslauf Dashboard** ist eine webbasierte Anwendung zur automatisierten Erstellung und Verwaltung monatlicher Kundenrechnungen. Es kombiniert Kundendaten aus der internen Datenbank mit Telefonie-Daten von der Purtel API und generiert PDF-Rechnungen sowie Einzelverbindungsnachweise (EVN).

### 1.2 Zielgruppe
- Mitarbeiter der Buchhaltung / Rechnungsabteilung
- Administratoren mit Zugang zum Abrechnungssystem

### 1.3 Hauptfunktionen
- Monatliche Rechnungsläufe erstellen und verwalten
- Automatische PDF-Rechnungsgenerierung
- Einzelverbindungsnachweise (EVN) für Telefonie-Kunden
- Storno- und Ergänzungsrechnungen erstellen
- Kundenübersicht mit Filterung und Sortierung

---

## 2. Funktionale Anforderungen

### 2.1 Monatsauswahl und Rechnungslauf-Verwaltung

#### REQ-001: Monat und Jahr auswählen
**Als** Benutzer  
**möchte ich** einen Monat und ein Jahr auswählen können  
**damit** ich den Rechnungslauf für diesen Zeitraum bearbeiten kann.

**Akzeptanzkriterien:**
- Dropdown-Menü für Monate (Januar - Dezember)
- Dropdown-Menü für Jahre (aktuelles Jahr und 5 Jahre zurück)
- Button "Monat laden" zum Laden der Ansicht
- Anzeige ob für den ausgewählten Monat bereits ein Rechnungslauf existiert

#### REQ-002: Neuen Rechnungslauf erstellen
**Als** Benutzer  
**möchte ich** einen neuen Rechnungslauf für einen Monat erstellen können  
**damit** alle Kunden für diesen Monat abgerechnet werden können.

**Akzeptanzkriterien:**
- Button "Rechnungslauf erstellen" wenn kein Rechnungslauf existiert
- System lädt automatisch alle Kunden mit gültigem Tarif und Anschlussnummer
- Anzeige der Anzahl geladener Kunden
- Rechnungszeitraum wird automatisch auf den vollen Monat gesetzt (1. bis letzter Tag)

#### REQ-003: Rechnungslauf starten
**Als** Benutzer  
**möchte ich** die Verarbeitung aller Kunden starten können  
**damit** die Rechnungen generiert werden.

**Akzeptanzkriterien:**
- Button "Rechnungslauf starten"
- Fortschrittsanzeige mit Prozentbalken
- Live-Log mit aktuellen Verarbeitungsschritten
- Anzeige des aktuell verarbeiteten Kunden

#### REQ-004: Rechnungslauf fortsetzen
**Als** Benutzer  
**möchte ich** einen unterbrochenen Rechnungslauf fortsetzen können  
**damit** nur die noch nicht verarbeiteten Kunden bearbeitet werden.

**Akzeptanzkriterien:**
- Button "Fortsetzen" bei teilweise verarbeiteten Rechnungsläufen
- Nur Kunden mit Status "wartend" oder "Fehler" werden verarbeitet
- Bereits erfolgreich verarbeitete Kunden werden übersprungen

#### REQ-005: Rechnungslauf abbrechen
**Als** Benutzer  
**möchte ich** einen laufenden Rechnungslauf abbrechen können  
**damit** ich bei Problemen die Verarbeitung stoppen kann.

**Akzeptanzkriterien:**
- Button "Abbrechen" während der Verarbeitung sichtbar
- Bestätigungsdialog vor dem Abbrechen
- Bereits verarbeitete Kunden bleiben erhalten
- Status wird auf "Abgebrochen" gesetzt

#### REQ-006: Alle Kunden neu generieren
**Als** Benutzer  
**möchte ich** alle Kunden eines Rechnungslaufs komplett neu verarbeiten können  
**damit** ich bei Änderungen alle Rechnungen aktualisieren kann.

**Akzeptanzkriterien:**
- Button "Alle neu generieren"
- Warnung dass alle bestehenden Daten überschrieben werden
- Alle Kunden werden zurückgesetzt und neu verarbeitet

---

### 2.2 Fortschrittsanzeige und Status

#### REQ-007: Fortschrittsanzeige während der Verarbeitung
**Als** Benutzer  
**möchte ich** den aktuellen Fortschritt sehen können  
**damit** ich weiß wie lange die Verarbeitung noch dauert.

**Akzeptanzkriterien:**
- Prozentbalken mit aktuellem Fortschritt
- Anzeige "X von Y Kunden verarbeitet"
- Live-Log mit Einzelergebnissen (Kundenname, Betrag, Status)
- Farbcodierung: Grün = Erfolg, Rot = Fehler, Gelb = Warnung

#### REQ-008: Statusanzeige pro Kunde
**Als** Benutzer  
**möchte ich** den Status jedes Kunden sehen können  
**damit** ich erkenne welche Kunden erfolgreich verarbeitet wurden.

**Status-Typen:**
| Status | Farbe | Bedeutung |
|--------|-------|-----------|
| Wartend | Gelb | Noch nicht verarbeitet |
| Verarbeitung | Gelb | Wird gerade verarbeitet |
| Erfolg | Grün | Erfolgreich abgeschlossen |
| Warnung | Orange | Abgeschlossen mit Hinweis (z.B. Tarif-Abweichung) |
| Fehler | Rot | Verarbeitung fehlgeschlagen |
| Keine Daten | Grau | Keine Anschlussnummer vorhanden |
| Abgebrochen | Rot | Durch Benutzer abgebrochen |

---

### 2.3 Kundenübersicht und Tabelle

#### REQ-009: Kundentabelle anzeigen
**Als** Benutzer  
**möchte ich** alle Kunden eines Rechnungslaufs in einer Tabelle sehen  
**damit** ich einen Überblick über alle Rechnungen habe.

**Spalten der Tabelle:**
| Spalte | Beschreibung |
|--------|-------------|
| Kunden-ID | Interne Kundennummer |
| Name | Vor- und Nachname (klickbar für Dashboard) |
| Firma | Firmenname falls vorhanden |
| Anschluss | Telefon-Anschlussnummer |
| Grundgebühr | Monatliche Tarifgebühr (inkl. MwSt.) |
| Telefonie | Telefoniekosten (inkl. MwSt.) |
| Gesamt | Gesamtbetrag (inkl. MwSt.) |
| Status | Aktueller Verarbeitungsstatus |
| EVN | Einzelverbindungsnachweis aktiv (✓/✗) |
| EVN anonym | Anonymisierter EVN (✓/✗) |
| Rechnung per Post | Post-Versand aktiv (✓/✗) |
| Aktionen | Dropdown mit verfügbaren Aktionen |

#### REQ-010: Tabelle filtern
**Als** Benutzer  
**möchte ich** die Kundentabelle nach verschiedenen Kriterien filtern können  
**damit** ich schnell bestimmte Kunden finde.

**Filterkriterien:**
- Status (Mehrfachauswahl möglich)
- Kundenname (Textsuche)
- Firmenname (Textsuche)
- Kunden-ID (exakte Suche)
- Anschlussnummer (Textsuche)
- Grundgebühr (Min/Max)
- Telefoniekosten (Min/Max)
- Gesamtbetrag (Min/Max)
- EVN aktiv (Ja/Nein/Alle)
- EVN anonym (Ja/Nein/Alle)
- Rechnung per Post (Ja/Nein/Alle)

**Akzeptanzkriterien:**
- Filter werden sofort angewendet
- Anzeige der Anzahl gefilterter Ergebnisse ("X von Y Kunden")
- Button zum Zurücksetzen aller Filter

#### REQ-011: Tabelle sortieren
**Als** Benutzer  
**möchte ich** die Kundentabelle nach verschiedenen Spalten sortieren können  
**damit** ich die Daten nach meinen Bedürfnissen ordnen kann.

**Sortierbare Spalten:**
- Kunden-ID
- Name
- Firma
- Anschluss
- Grundgebühr
- Telefonie
- Gesamt
- Status

**Akzeptanzkriterien:**
- Klick auf Spaltenüberschrift sortiert aufsteigend
- Erneuter Klick sortiert absteigend
- Sortierrichtung wird durch Pfeil angezeigt (↑/↓)

---

### 2.4 Kunden-Details

#### REQ-012: Kunden-Details anzeigen
**Als** Benutzer  
**möchte ich** detaillierte Informationen zu einem Kunden sehen können  
**damit** ich alle relevanten Daten auf einen Blick habe.

**Anzuzeigende Informationen:**

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
- EVN aktiviert
- EVN anonymisiert
- Rechnung per E-Mail
- Vertragsbeginn laut Purtel
- Weitere Purtel-Attribute (aufklappbar)

**Rechnungsdaten:**
- Rechnungsnummer
- Grundgebühr (netto/brutto)
- Telefoniekosten (netto/brutto)
- Gesamtbetrag (netto/brutto)
- Verarbeitungsstatus
- Fehlermeldung (falls vorhanden)

**Positionen:**
- Kategorisierte Auflistung (Telefonie, TV, Router-Miete, Sonstiges)
- Beschreibung und Betrag pro Position

**Verarbeitungs-Log:**
- Chronologische Liste aller Verarbeitungsschritte
- Zeitstempel, Level (Info/Warnung/Fehler), Nachricht
- Verarbeitungsdauer pro Schritt

#### REQ-013: Kunden-Details Modal
**Als** Benutzer  
**möchte ich** die Kunden-Details in einem Modal sehen  
**damit** ich schnell zwischen Übersicht und Details wechseln kann.

**Akzeptanzkriterien:**
- Modal öffnet sich über Tabelle
- Schließen per X-Button oder Klick außerhalb
- Alle Informationen aus REQ-012 enthalten

---

### 2.5 PDF-Rechnungen und EVN

#### REQ-014: PDF-Rechnung anzeigen
**Als** Benutzer  
**möchte ich** die PDF-Rechnung eines Kunden anzeigen können  
**damit** ich das generierte Dokument prüfen kann.

**Akzeptanzkriterien:**
- Dropdown-Option "PDF anzeigen" (nur wenn PDF vorhanden)
- PDF öffnet in neuem Browser-Tab
- Inline-Anzeige (nicht Download)

#### REQ-015: PDF-Rechnung herunterladen
**Als** Benutzer  
**möchte ich** die PDF-Rechnung herunterladen können  
**damit** ich sie lokal speichern oder versenden kann.

**Akzeptanzkriterien:**
- Dropdown-Option "PDF-Rechnung generieren"
- Download startet automatisch
- Dateiname enthält Rechnungsnummer und Datum

#### REQ-016: EVN anzeigen
**Als** Benutzer  
**möchte ich** den Einzelverbindungsnachweis (EVN) anzeigen können  
**damit** ich die Telefonverbindungen des Kunden prüfen kann.

**Akzeptanzkriterien:**
- Dropdown-Option "EVN anzeigen" (nur wenn EVN vorhanden)
- PDF öffnet in neuem Browser-Tab
- EVN enthält alle Verbindungen des Monats mit Datum, Uhrzeit, Rufnummern, Dauer

#### REQ-017: EVN neu generieren
**Als** Benutzer  
**möchte ich** den EVN eines Kunden neu generieren können  
**damit** ich bei Änderungen ein aktuelles Dokument erhalte.

**Akzeptanzkriterien:**
- Dropdown-Option "EVN neu generieren"
- Bestätigungsmeldung nach erfolgreicher Generierung
- Fehlermeldung wenn keine Verbindungsdaten verfügbar

---

### 2.6 Kunden neu verarbeiten

#### REQ-018: Einzelnen Kunden erneut verarbeiten
**Als** Benutzer  
**möchte ich** einen einzelnen Kunden erneut verarbeiten können  
**damit** ich bei Fehlern oder Änderungen die Rechnung aktualisieren kann.

**Akzeptanzkriterien:**
- Dropdown-Option "Erneut verarbeiten"
- Alle Daten werden zurückgesetzt (Telefonie-Positionen, EVN-Verbindungen)
- Verarbeitung startet sofort
- Status wird in Tabelle aktualisiert
- Erfolgs-/Fehlermeldung wird angezeigt

---

### 2.7 Rechnungspositionen verwalten

#### REQ-019: Positionen anzeigen
**Als** Benutzer  
**möchte ich** alle Rechnungspositionen eines Kunden sehen können  
**damit** ich die Zusammensetzung der Rechnung prüfen kann.

**Akzeptanzkriterien:**
- Dropdown-Option "Positionen verwalten"
- Modal mit Liste aller Positionen
- Anzeige von: Beschreibung, Menge, Einzelpreis, MwSt., Gesamtpreis
- Unterscheidung zwischen automatischen und manuellen Positionen

#### REQ-020: Position hinzufügen
**Als** Benutzer  
**möchte ich** manuelle Positionen zu einer Rechnung hinzufügen können  
**damit** ich Sonderleistungen oder Anpassungen abrechnen kann.

**Eingabefelder:**
- Beschreibung (Pflichtfeld)
- Menge (Standard: 1)
- Einzelpreis in EUR (netto)
- MwSt.-Satz in % (Standard: 19%)

**Akzeptanzkriterien:**
- Formular mit Validierung
- Gesamtbetrag wird automatisch aktualisiert
- Position erscheint in der Liste
- PDF muss neu generiert werden für Aktualisierung

#### REQ-021: Position entfernen
**Als** Benutzer  
**möchte ich** manuelle Positionen entfernen können  
**damit** ich fehlerhafte Einträge korrigieren kann.

**Akzeptanzkriterien:**
- Button "Entfernen" pro manueller Position
- Bestätigungsdialog vor dem Löschen
- Gesamtbetrag wird automatisch aktualisiert
- Automatische Positionen (aus Purtel) können nicht gelöscht werden

---

### 2.8 Storno-Rechnungen

#### REQ-022: Storno-Vorschau anzeigen
**Als** Benutzer  
**möchte ich** eine Vorschau der zu stornierenden Positionen sehen  
**damit** ich die Storno-Rechnung vor der Erstellung prüfen kann.

**Akzeptanzkriterien:**
- Öffnen über Kunden-Dashboard oder Dropdown
- Anzeige aller Positionen der Original-Rechnung
- Positionen sind einzeln auswählbar
- Anzeige des Storno-Gesamtbetrags

#### REQ-023: Storno-Positionen bearbeiten
**Als** Benutzer  
**möchte ich** die Storno-Positionen anpassen können  
**damit** ich Teilstornierungen durchführen kann.

**Akzeptanzkriterien:**
- Checkbox zum Einschließen/Ausschließen pro Position
- Bearbeitbare Felder: Beschreibung, Menge, Einzelpreis, MwSt.
- Gesamtbetrag aktualisiert sich automatisch
- Positionen können als neue hinzugefügt werden

#### REQ-024: Storno-Rechnung erstellen
**Als** Benutzer  
**möchte ich** eine Storno-Rechnung erstellen können  
**damit** ich fehlerhafte Rechnungen korrigieren kann.

**Akzeptanzkriterien:**
- Button "Storno erstellen"
- Eingabe eines Storno-Grundes (optional)
- Storno-Rechnungsnummer beginnt mit "ST-"
- Alle Beträge werden negativ dargestellt
- PDF wird automatisch generiert
- Storno-Rechnung erscheint im Kunden-Dashboard

---

### 2.9 Kunden-Dashboard (Rechnungsübersicht)

#### REQ-025: Kunden-Dashboard öffnen
**Als** Benutzer  
**möchte ich** alle Rechnungen eines Kunden auf einen Blick sehen  
**damit** ich die Rechnungshistorie prüfen kann.

**Akzeptanzkriterien:**
- Klick auf Kundennamen öffnet Dashboard
- Oder über Dropdown "Kunden-Dashboard"
- Modal mit allen Rechnungen des Kunden

#### REQ-026: Rechnungshistorie anzeigen
**Als** Benutzer  
**möchte ich** alle bisherigen Rechnungen eines Kunden sehen  
**damit** ich die Abrechnungshistorie nachvollziehen kann.

**Angezeigte Informationen pro Rechnung:**
- Rechnungsnummer
- Rechnungstyp (Normal, Storno, Ergänzend)
- Zeitraum (von - bis)
- Grundgebühr, Telefonie, Gesamt (jeweils brutto)
- Status
- Erstellungsdatum

**Aktionen pro Rechnung:**
- PDF anzeigen
- EVN anzeigen (wenn vorhanden)
- Details anzeigen
- Storno erstellen

#### REQ-027: Ergänzende Rechnung erstellen
**Als** Benutzer  
**möchte ich** eine ergänzende Rechnung für einen Kunden erstellen können  
**damit** ich nachträgliche Leistungen abrechnen kann.

**Eingabefelder:**
- Beschreibung
- Menge
- Einzelpreis (netto)
- MwSt.-Satz

**Akzeptanzkriterien:**
- Formular für neue Positionen
- Mehrere Positionen hinzufügbar
- Vorschau des Gesamtbetrags
- Rechnungsnummer beginnt mit "RG-ERG-"
- PDF wird automatisch generiert
- Erscheint in der Rechnungsübersicht

---

### 2.10 Statistiken und Übersicht

#### REQ-028: Monatsstatistiken anzeigen
**Als** Benutzer  
**möchte ich** eine Zusammenfassung des Rechnungslaufs sehen  
**damit** ich die Gesamtzahlen auf einen Blick erfasse.

**Angezeigte Statistiken:**
| Statistik | Beschreibung |
|-----------|-------------|
| Gesamt Kunden | Anzahl aller Kunden im Rechnungslauf |
| Erfolgreich | Anzahl erfolgreich verarbeiteter Kunden |
| Fehler | Anzahl fehlgeschlagener Verarbeitungen |
| Grundgebühr gesamt | Summe aller Grundgebühren (brutto) |
| Telefonie gesamt | Summe aller Telefoniekosten (brutto) |
| Gesamtbetrag | Summe aller Rechnungsbeträge (brutto) |

**Akzeptanzkriterien:**
- Statistik-Karten am oberen Seitenrand
- Farbcodierung: Erfolg = Grün, Fehler = Rot
- Aktualisierung während der Verarbeitung in Echtzeit

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Benutzerfreundlichkeit

#### NFR-001: Responsives Design
Die Anwendung soll auf Desktop-Bildschirmen (ab 1024px Breite) optimal dargestellt werden.

#### NFR-002: Ladezeiten
- Seitenaufbau: < 3 Sekunden
- Kundenverarbeitung: < 10 Sekunden pro Kunde
- PDF-Generierung: < 5 Sekunden

#### NFR-003: Feedback
- Alle Aktionen zeigen sofortiges visuelles Feedback
- Fehler werden verständlich in deutscher Sprache angezeigt
- Erfolgsmeldungen bestätigen abgeschlossene Aktionen

### 3.2 Zuverlässigkeit

#### NFR-004: Fehlerbehandlung
- Bei API-Fehlern wird der Kunde als "Fehler" markiert, nicht die gesamte Verarbeitung
- Fehlermeldungen werden im Log gespeichert
- Unterbrochene Verarbeitungen können fortgesetzt werden

#### NFR-005: Datenintegrität
- Alle Rechnungsdaten werden in der Datenbank gespeichert
- PDF-Dateien werden versioniert
- Storno-Rechnungen sind mit Original-Rechnungen verknüpft

### 3.3 Sicherheit

#### NFR-006: Authentifizierung
- Zugang nur für autorisierte Benutzer (separate Login-Funktion erforderlich)
- API-Zugangsdaten werden sicher in Umgebungsvariablen gespeichert

---

## 4. Datenquellen

### 4.1 Interne Datenbank
- Kundenstammdaten (Name, Adresse, Kontakt)
- Tarifinformationen (Preis, Laufzeit, Geschwindigkeit)
- Anschlussnummern
- Vertragsdaten

### 4.2 Purtel API
- Telefonie-Buchungen (Kosten pro Monat)
- Einzelverbindungsdaten (CDR) für EVN
- Kundeneinstellungen (EVN aktiv, Rechnung per Post)
- Vertragsbeginn

---

## 5. Benutzeroberfläche (Wireframe-Beschreibung)

### 5.1 Hauptansicht
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  RECHNUNGSLAUF DASHBOARD                                │
├─────────────────────────────────────────────────────────────────┤
│  Monat: [Dropdown] Jahr: [Dropdown] [Monat laden]               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ✓ Rechnungslauf vorhanden für Oktober 2025             │    │
│  │    Zeitraum: 01.10.2025 - 31.10.2025                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Fortsetzen] [Alle neu generieren] [Alle PDFs regenerieren]    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────┐  │
│  │ 150  │ │ 145  │ │  5   │ │ 5.250 €  │ │   320 €  │ │5.570€│  │
│  │Kunden│ │Erfolg│ │Fehler│ │Grundgeb. │ │Telefonie │ │Gesamt│  │
│  └──────┘ └──────┘ └──────┘ └──────────┘ └──────────┘ └──────┘  │
├─────────────────────────────────────────────────────────────────┤
│  FILTER: Status [▼] Name [____] Firma [____] [Anwenden] [Reset] │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ID │ Name      │ Firma │ Anschl. │ Grund. │ Tel. │ Ges. │ │  │
│  ├────┼───────────┼───────┼─────────┼────────┼──────┼──────┼─┤  │
│  │ 1  │ Max Muster│ ABC   │ 1234567 │ 35,00€ │ 2,50€│37,50€│▼│  │
│  │ 2  │ Eva Test  │ -     │ 2345678 │ 29,00€ │ 0,00€│29,00€│▼│  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Kunden-Details Modal
```
┌─────────────────────────────────────────────────────────────────┐
│  KUNDEN-DETAILS: Max Mustermann                             [X] │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│  │ Kunden-ID: 1    │ │ Anschluss: 123  │ │ Status: Erfolg  │    │
│  │ E-Mail: max@... │ │ Tarif: Standard │ │ Rg-Nr: RG-...   │    │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                 │
│  BETRÄGE                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Grundgebühr:     29,41 € netto  │  35,00 € brutto       │    │
│  │ Telefonie:        2,10 € netto  │   2,50 € brutto       │    │
│  │ GESAMT:          31,51 € netto  │  37,50 € brutto       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  POSITIONEN                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Beschreibung          │ Menge │ Preis  │ MwSt │ Gesamt  │    │
│  │ Standard-Tarif        │   1   │ 29,41€ │ 19%  │ 35,00€  │    │
│  │ Telefonate national   │   1   │  2,10€ │ 19%  │  2,50€  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  VERARBEITUNGS-LOG                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [10:15:32] INFO  - Verarbeitung gestartet               │    │
│  │ [10:15:33] INFO  - Purtel API erfolgreich               │    │
│  │ [10:15:35] INFO  - PDF generiert                        │    │
│  │ [10:15:36] OK    - Verarbeitung abgeschlossen           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [PDF anzeigen] [EVN anzeigen] [Neu verarbeiten] [Storno]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Rechnungslauf** | Monatlicher Prozess zur Erstellung aller Kundenrechnungen |
| **EVN** | Einzelverbindungsnachweis - Detaillierte Auflistung aller Telefonverbindungen |
| **Purtel** | Externer Telefonie-Provider mit API für Verbindungsdaten |
| **CDR** | Call Detail Records - Rohdaten der Telefonverbindungen |
| **Grundgebühr** | Monatlicher Festbetrag des Tarifs |
| **Storno-Rechnung** | Gutschrift zur Korrektur einer fehlerhaften Rechnung |
| **Ergänzende Rechnung** | Zusätzliche Rechnung für nachträgliche Leistungen |

---

## 7. Anhang

### 7.1 Rechnungsformat
- Format: PDF/A (archivierbar)
- Enthält: ZUGFeRD XML für elektronische Verarbeitung
- Sprache: Deutsch
- Währung: EUR

### 7.2 EVN-Format
- Format: PDF
- Spalten: Datum, Uhrzeit, Von, Nach, Dauer, Richtung
- Optional: Kosten (wenn nicht anonymisiert)

---

*Dokumentversion: 1.0*  
*Letzte Aktualisierung: Januar 2026*

