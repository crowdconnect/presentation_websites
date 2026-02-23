# Testplan: Mawacon Connect App

## Übersicht

Dieser Testplan beschreibt die systematische Prüfung der App mit **3 Test-Kunden** und validiert den kompletten Datenfluss:
- **Intranet** → **Public API (via Mirror)** → **Mobile App**
- **Admin Panel** → **Public API** → **Mobile App**

---

## Test-Setup

### Test-Kunden anlegen

**Kunde 1: Max Mustermann**
- Customer ID: `KD-11111111`
- Vertrag: Standard (500 MBit/s)
- TV-Paket: Keines
- Hardware: Keine Bestellungen
- Rechnungen: 3 Rechnungen (2 bezahlt, 1 offen)

**Kunde 2: Anna Schmidt**
- Customer ID: `KD-22222222`
- Vertrag: Premium (700 MBit/s)
- TV-Paket: Comfort waipu.tv
- Hardware: 1 Router bestellt
- Rechnungen: 5 Rechnungen (alle bezahlt)

**Kunde 3: Peter Müller**
- Customer ID: `KD-33333333`
- Vertrag: Basic (300 MBit/s)
- TV-Paket: Perfect Plus waipu.tv
- Hardware: WiFi Booster + TV Stick
- Rechnungen: 2 Rechnungen (1 bezahlt, 1 offen)

---

## Test-Phase 1: Daten-Mirror (Intranet → Public API)

### Test 1.1: Initialer Daten-Mirror
**Ziel:** Prüfen, ob Daten vom Intranet korrekt in die Public API gespiegelt werden.

**Schritte:**
1. Im Intranet für alle 3 Kunden Daten anlegen:
   - Kundenstammdaten (Name, Customer ID, E-Mail)
   - Vertragsdaten (Tarif, Geschwindigkeit, Preis)
   - Rechnungsdaten (Nummer, Datum, Betrag, Status)
   - TV-Paket (falls vorhanden)
   - Hardware-Bestellungen (falls vorhanden)

2. Mirror-API aufrufen (vom Intranet aus):
   ```
   POST /mirror/customer
   POST /mirror/contract
   POST /mirror/invoice
   POST /mirror/tv-package
   POST /mirror/hardware-order
   ```

3. **Erwartetes Ergebnis:**
   - Alle Daten werden in Public API DB gespeichert
   - Keine Fehler in Mirror-Logs
   - Daten sind via Public API abrufbar

**Checkliste:**
- [ ] Kunde 1: Alle Daten gespiegelt
- [ ] Kunde 2: Alle Daten gespiegelt
- [ ] Kunde 3: Alle Daten gespiegelt
- [ ] Public API gibt Daten korrekt zurück

---

### Test 1.2: Daten-Updates via Mirror
**Ziel:** Prüfen, ob Änderungen im Intranet korrekt aktualisiert werden.

**Schritte:**
1. **Kunde 1: Vertrag ändern**
   - Im Intranet: Tarif von "Standard" auf "Premium" ändern
   - Mirror-API aufrufen mit neuen Vertragsdaten
   - In App prüfen: Vertrag sollte "Premium" anzeigen

2. **Kunde 2: Neue Rechnung hinzufügen**
   - Im Intranet: Neue Rechnung anlegen (RE-2024-006, 50€, offen)
   - Mirror-API aufrufen
   - In App prüfen: Neue Rechnung sollte in Liste erscheinen

3. **Kunde 3: TV-Paket kündigen**
   - Im Intranet: TV-Paket auf "null" setzen
   - Mirror-API aufrufen
   - In App prüfen: Dashboard sollte "Kein TV-Paket" anzeigen

**Checkliste:**
- [ ] Vertragsänderung wird gespiegelt
- [ ] Neue Rechnung wird gespiegelt
- [ ] TV-Paket-Kündigung wird gespiegelt
- [ ] App zeigt aktualisierte Daten (nach Mirror-Sync)

---

### Test 1.3: PDF-Mirror für Rechnungen
**Ziel:** Prüfen, ob Rechnungs-PDFs korrekt übertragen werden.

**Schritte:**
1. Im Intranet: PDF für Rechnung RE-2024-001 (Kunde 1) generieren
2. Mirror-API mit PDF-Daten aufrufen
3. In App: Rechnung herunterladen
4. Prüfen: PDF ist vollständig und korrekt

**Checkliste:**
- [ ] PDF wird via Mirror übertragen
- [ ] PDF wird in Public API gespeichert
- [ ] Download-Link funktioniert in App
- [ ] PDF-Inhalt ist korrekt

---

## Test-Phase 2: Mobile App - Datenanzeige

### Test 2.1: Login & Dashboard
**Ziel:** Prüfen, ob Kunden sich einloggen können und korrekte Daten sehen.

**Schritte:**
1. **Kunde 1 einloggen:**
   - Login mit Customer ID + Passwort
   - Dashboard prüfen:
     - Name wird korrekt angezeigt
     - Vertrag: "Standard" mit 500 MBit/s
     - TV-Paket: "Kein TV-Paket"
     - Aktionsbanner wird angezeigt

2. **Kunde 2 einloggen:**
   - Dashboard prüfen:
     - Vertrag: "Premium" mit 700 MBit/s
     - TV-Paket: "Comfort waipu.tv"
     - Hardware: Router angezeigt

3. **Kunde 3 einloggen:**
   - Dashboard prüfen:
     - Vertrag: "Basic" mit 300 MBit/s
     - TV-Paket: "Perfect Plus waipu.tv"
     - Hardware: WiFi Booster + TV Stick

**Checkliste:**
- [ ] Login funktioniert für alle 3 Kunden
- [ ] Dashboard zeigt korrekte Vertragsdaten
- [ ] Dashboard zeigt korrekte TV-Paket-Daten
- [ ] Dashboard zeigt korrekte Hardware-Daten
- [ ] Aktionsbanner wird angezeigt

---

### Test 2.2: Rechnungen anzeigen
**Ziel:** Prüfen, ob Rechnungen korrekt angezeigt werden.

**Schritte:**
1. **Kunde 1:**
   - Rechnungen-Seite öffnen
   - Prüfen: 3 Rechnungen sichtbar
   - Status prüfen: 2x "Bezahlt", 1x "Offen"
   - PDF-Download testen (eine Rechnung)

2. **Kunde 2:**
   - Rechnungen-Seite öffnen
   - Prüfen: 5 Rechnungen sichtbar
   - Alle Status: "Bezahlt"
   - PDF-Download testen

3. **Kunde 3:**
   - Rechnungen-Seite öffnen
   - Prüfen: 2 Rechnungen sichtbar
   - Status prüfen: 1x "Bezahlt", 1x "Offen"

**Checkliste:**
- [ ] Alle Rechnungen werden angezeigt
- [ ] Status ist korrekt
- [ ] PDF-Download funktioniert
- [ ] Download-Links sind zeitlich limitiert (Security)

---

### Test 2.3: Vertragsverwaltung
**Ziel:** Prüfen, ob Vertragsdaten korrekt angezeigt werden.

**Schritte:**
1. **Kunde 1:**
   - Verträge-Seite öffnen
   - Prüfen: Aktueller Tarif "Standard" wird angezeigt
   - Prüfen: Upgrade-Optionen werden angezeigt (Premium, Gigabit)
   - Upgrade-Prozess starten (siehe Test 3.1)

2. **Kunde 2:**
   - Verträge-Seite öffnen
   - Prüfen: Aktueller Tarif "Premium" wird angezeigt
   - Prüfen: Upgrade-Option "Gigabit" wird angezeigt

3. **Kunde 3:**
   - Verträge-Seite öffnen
   - Prüfen: Aktueller Tarif "Basic" wird angezeigt
   - Prüfen: Alle Upgrade-Optionen werden angezeigt

**Checkliste:**
- [ ] Aktueller Vertrag wird korrekt angezeigt
- [ ] Upgrade-Optionen werden korrekt gefiltert (nur höhere Tarife)
- [ ] Vertragsdetails (Geschwindigkeit, Preis) sind korrekt

---

### Test 2.4: Hardware & TV-Pakete
**Ziel:** Prüfen, ob Produktkatalog korrekt angezeigt wird.

**Schritte:**
1. **Hardware-Seite:**
   - Alle 3 Kunden: Hardware-Seite öffnen
   - Prüfen: Alle Produkte werden angezeigt (Router, WiFi Booster, TV Stick)
   - Prüfen: Preise sind korrekt
   - Prüfen: Bilder werden geladen

2. **TV-Pakete-Seite:**
   - Alle 3 Kunden: TV-Pakete-Seite öffnen
   - Prüfen: Beide Pakete werden angezeigt (Comfort, Perfect Plus)
   - Prüfen: Bereits gebuchte Pakete sind markiert
   - Kunde 1: Prüfen, dass "Kein Paket gebucht" angezeigt wird

**Checkliste:**
- [ ] Hardware-Katalog wird korrekt angezeigt
- [ ] TV-Pakete werden korrekt angezeigt
- [ ] Bereits gebuchte Pakete sind markiert
- [ ] Produktdetails sind vollständig

---

### Test 2.5: Referral-System
**Ziel:** Prüfen, ob Referral-Funktionen korrekt funktionieren.

**Schritte:**
1. **Kunde 1:**
   - Referral-Seite öffnen
   - Prüfen: Persönlicher Code wird angezeigt (basierend auf Customer ID)
   - Prüfen: Geschenk wird angezeigt (aus Admin-Panel)
   - Code teilen testen (WhatsApp/E-Mail)

2. **Kunde 2 & 3:**
   - Gleiche Tests durchführen
   - Prüfen: Jeder Kunde hat eigenen Code

**Checkliste:**
- [ ] Referral-Code wird korrekt generiert
- [ ] Code ist eindeutig pro Kunde
- [ ] Geschenk wird aus Admin-Panel angezeigt
- [ ] Teilen-Funktion funktioniert

---

## Test-Phase 3: User-Aktionen (App → Public API → E-Mail)

### Test 3.1: Tarif-Upgrade anfordern
**Ziel:** Prüfen, ob Upgrade-Anfragen korrekt verarbeitet werden.

**Schritte:**
1. **Kunde 1:**
   - Verträge-Seite öffnen
   - Upgrade auf "Premium" auswählen
   - Bestätigen
   - Prüfen: Bestätigungsmeldung in App

2. **E-Mail prüfen:**
   - E-Mail an Mitarbeiter sollte ankommen (gemäß Admin-Konfiguration)
   - E-Mail sollte enthalten:
     - Kundenname
     - Alter Tarif: "Standard"
     - Neuer Tarif: "Premium"
     - Customer ID

3. **Kunde erhält Bestätigung:**
   - E-Mail an Kunde sollte ankommen
   - Bestätigung: "Ihre Anfrage wurde erhalten"

**Checkliste:**
- [ ] Upgrade-Anfrage wird gesendet
- [ ] E-Mail an Mitarbeiter kommt an
- [ ] E-Mail an Kunde kommt an
- [ ] E-Mail-Inhalte sind korrekt

---

### Test 3.2: Hardware bestellen
**Ziel:** Prüfen, ob Hardware-Bestellungen korrekt verarbeitet werden.

**Schritte:**
1. **Kunde 1:**
   - Hardware-Seite öffnen
   - Router auswählen
   - "In den Warenkorb" klicken
   - Bestellen
   - Prüfen: Bestätigungsmeldung

2. **E-Mail prüfen:**
   - E-Mail an Mitarbeiter sollte ankommen
   - E-Mail sollte enthalten:
     - Kundenname
     - Produkt: "Mawacon Premium Router"
     - Preis: "149,99 €"
     - Customer ID
     - Lieferadresse (aus Kundenstamm)

3. **Kunde erhält Bestätigung:**
   - E-Mail an Kunde sollte ankommen

**Checkliste:**
- [ ] Bestellung wird gesendet
- [ ] E-Mail an Mitarbeiter kommt an
- [ ] E-Mail an Kunde kommt an
- [ ] Bestellhistorie wird aktualisiert (nach Mirror-Sync)

---

### Test 3.3: TV-Paket buchen
**Ziel:** Prüfen, ob TV-Paket-Buchungen korrekt verarbeitet werden.

**Schritte:**
1. **Kunde 1:**
   - TV-Pakete-Seite öffnen
   - "Comfort waipu.tv" auswählen
   - "Jetzt buchen" klicken
   - Bestätigen

2. **E-Mail prüfen:**
   - E-Mail an Mitarbeiter sollte ankommen
   - E-Mail sollte enthalten:
     - Kundenname
     - Paket: "Comfort waipu.tv"
     - Preis: "6,99 €/mtl."
     - Customer ID

3. **Kunde erhält Bestätigung:**
   - E-Mail an Kunde sollte ankommen

**Checkliste:**
- [ ] Buchung wird gesendet
- [ ] E-Mail an Mitarbeiter kommt an
- [ ] E-Mail an Kunde kommt an
- [ ] Bereits gebuchte Pakete werden markiert (nach Mirror-Sync)

---

## Test-Phase 4: Admin-Panel

### Test 4.1: E-Mail-Routing konfigurieren
**Ziel:** Prüfen, ob E-Mail-Routing korrekt funktioniert.

**Schritte:**
1. Admin-Panel öffnen
2. E-Mail-Routing ändern:
   - Hardware-Bestellungen: `hardware-test@mawacon.de`
   - TV-Buchungen: `tv-test@mawacon.de`
   - Vertragsupgrades: `upgrade-test@mawacon.de`
3. Speichern

4. **Test durchführen:**
   - Kunde 1: Hardware bestellen
   - Prüfen: E-Mail geht an `hardware-test@mawacon.de`
   - Kunde 2: TV-Paket buchen
   - Prüfen: E-Mail geht an `tv-test@mawacon.de`
   - Kunde 3: Tarif upgraden
   - Prüfen: E-Mail geht an `upgrade-test@mawacon.de`

**Checkliste:**
- [ ] E-Mail-Routing kann geändert werden
- [ ] Änderungen werden gespeichert
- [ ] E-Mails gehen an korrekte Adressen
- [ ] Änderungen wirken sofort (kein Neustart nötig)

---

### Test 4.2: Referral-Geschenk konfigurieren
**Ziel:** Prüfen, ob Geschenk-Verwaltung funktioniert.

**Schritte:**
1. Admin-Panel öffnen
2. Referral-Geschenk ändern:
   - Name: "Mawacon Wunschgeschenk"
   - Beschreibung: "Sammeln Sie Empfehlungen und wählen Sie Ihr Lieblingsgeschenk"
   - Bild hochladen (neues Bild)
3. Speichern

4. **In App prüfen:**
   - Alle 3 Kunden: Referral-Seite öffnen
   - Prüfen: Neues Geschenk wird angezeigt
   - Prüfen: Name, Beschreibung, Bild sind korrekt

5. **Geschenk erneut ändern:**
   - Name: "50€ Amazon-Gutschein"
   - Beschreibung: "Erhalten Sie einen 50€ Gutschein"
   - Neues Bild hochladen
   - Speichern

6. **In App prüfen:**
   - Geschenk sollte aktualisiert sein

**Checkliste:**
- [ ] Geschenk kann geändert werden
   - [ ] Name
   - [ ] Beschreibung
   - [ ] Bild
- [ ] Änderungen werden gespeichert
- [ ] App zeigt aktualisiertes Geschenk
- [ ] Bild-Upload funktioniert

---

### Test 4.3: Aktionsbanner konfigurieren
**Ziel:** Prüfen, ob Banner-Verwaltung funktioniert.

**Schritte:**
1. Admin-Panel öffnen
2. Banner ändern:
   - Titel: "Sommeraktion 2024"
   - Text: "Jetzt 3 Monate gratis!"
   - Neues Bild hochladen
   - Banner aktivieren
3. Speichern

4. **In App prüfen:**
   - Alle 3 Kunden: Dashboard öffnen
   - Prüfen: Neues Banner wird angezeigt
   - Prüfen: Titel und Text sind korrekt

5. **Banner deaktivieren:**
   - Switch auf "Aus" setzen
   - Speichern

6. **In App prüfen:**
   - Banner sollte nicht mehr angezeigt werden

**Checkliste:**
- [ ] Banner kann geändert werden
   - [ ] Titel
   - [ ] Text
   - [ ] Bild
- [ ] Banner kann aktiviert/deaktiviert werden
- [ ] Änderungen werden sofort in App sichtbar
- [ ] Deaktiviertes Banner wird nicht angezeigt

---

### Test 4.4: Support-Daten konfigurieren
**Ziel:** Prüfen, ob Support-Kontaktdaten korrekt funktionieren.

**Schritte:**
1. Admin-Panel öffnen
2. Support-Daten ändern:
   - WhatsApp: `https://wa.me/49987654321`
   - E-Mail: `support-neu@mawacon.de`
   - Telefon: `+49 800 999 888`
3. Speichern

4. **In App prüfen:**
   - Alle 3 Kunden: Support-Seite öffnen
   - Prüfen: WhatsApp-Link ist korrekt
   - Prüfen: E-Mail-Adresse ist korrekt
   - Prüfen: Telefonnummer ist korrekt
   - WhatsApp-Link testen (öffnet WhatsApp)

**Checkliste:**
- [ ] Support-Daten können geändert werden
- [ ] Änderungen werden in App angezeigt
- [ ] WhatsApp-Link funktioniert
- [ ] E-Mail-Link funktioniert
- [ ] Telefon-Link funktioniert

---

## Test-Phase 5: Daten-Synchronisation

### Test 5.1: Mirror-Sync nach Änderungen
**Ziel:** Prüfen, ob Datenänderungen korrekt synchronisiert werden.

**Schritte:**
1. **Im Intranet ändern:**
   - Kunde 1: Neue Rechnung hinzufügen
   - Kunde 2: TV-Paket kündigen
   - Kunde 3: Hardware-Bestellung hinzufügen

2. **Mirror-API aufrufen:**
   - Alle Änderungen via Mirror-API senden

3. **In App prüfen (nach Sync):**
   - Kunde 1: Neue Rechnung sollte erscheinen
   - Kunde 2: TV-Paket sollte "Kein Paket" anzeigen
   - Kunde 3: Neue Hardware sollte in Historie erscheinen

**Checkliste:**
- [ ] Rechnungsänderungen werden synchronisiert
- [ ] TV-Paket-Änderungen werden synchronisiert
- [ ] Hardware-Änderungen werden synchronisiert
- [ ] App zeigt aktualisierte Daten

---

### Test 5.2: Mehrfache Updates
**Ziel:** Prüfen, ob wiederholte Updates korrekt funktionieren.

**Schritte:**
1. **Kunde 1: Mehrfache Änderungen**
   - Im Intranet: Vertrag ändern → Mirror
   - Im Intranet: Rechnung hinzufügen → Mirror
   - Im Intranet: Rechnung bezahlt setzen → Mirror

2. **In App prüfen:**
   - Alle Änderungen sollten korrekt angezeigt werden
   - Keine Datenverluste
   - Keine doppelten Einträge

**Checkliste:**
- [ ] Mehrfache Updates funktionieren
- [ ] Keine Datenverluste
- [ ] Keine doppelten Einträge
- [ ] Daten sind konsistent

---

## Test-Phase 6: Fehlerbehandlung & Edge Cases

### Test 6.1: Fehlende Daten
**Ziel:** Prüfen, wie App mit fehlenden Daten umgeht.

**Schritte:**
1. **Kunde ohne Rechnungen:**
   - Neuen Test-Kunden anlegen (ohne Rechnungen)
   - In App einloggen
   - Rechnungen-Seite öffnen
   - Prüfen: "Keine Rechnungen" wird angezeigt

2. **Kunde ohne TV-Paket:**
   - Kunde 1: TV-Paket entfernen (via Mirror)
   - In App prüfen: "Kein TV-Paket" wird angezeigt

**Checkliste:**
- [ ] App zeigt sinnvolle Meldungen bei fehlenden Daten
- [ ] Keine Fehler oder Crashes
- [ ] UI bleibt benutzerfreundlich

---

### Test 6.2: Ungültige Daten
**Ziel:** Prüfen, wie System mit ungültigen Daten umgeht.

**Schritte:**
1. **Ungültige Mirror-Daten senden:**
   - Customer ID fehlt
   - Preis ist negativ
   - Datum ist ungültig

2. **Prüfen:**
   - Mirror-API sollte Fehler zurückgeben
   - Keine ungültigen Daten werden gespeichert
   - Logs zeigen Fehler an

**Checkliste:**
- [ ] Ungültige Daten werden abgelehnt
- [ ] Fehlermeldungen sind verständlich
- [ ] System bleibt stabil

---

### Test 6.3: PDF-Download-Sicherheit
**Ziel:** Prüfen, ob PDF-Downloads sicher sind.

**Schritte:**
1. **Kunde 1:**
   - Rechnung herunterladen
   - Download-Link kopieren
   - 2 Stunden warten (oder Zeitlimit testen)
   - Link erneut aufrufen

2. **Prüfen:**
   - Link sollte abgelaufen sein
   - Kein Zugriff mehr möglich

**Checkliste:**
- [ ] Download-Links sind zeitlich limitiert
- [ ] Abgelaufene Links funktionieren nicht
- [ ] Kunden können nur eigene Rechnungen herunterladen

---

## Test-Phase 7: Performance & Stabilität

### Test 7.1: Mehrere Kunden gleichzeitig
**Ziel:** Prüfen, ob System mehrere gleichzeitige Anfragen handhabt.

**Schritte:**
1. Alle 3 Kunden gleichzeitig:
   - Login durchführen
   - Dashboard öffnen
   - Rechnungen laden
   - Hardware-Seite öffnen

2. **Prüfen:**
   - Alle Anfragen werden korrekt beantwortet
   - Keine Timeouts
   - Keine Fehler

**Checkliste:**
- [ ] System handhabt mehrere gleichzeitige Anfragen
- [ ] Antwortzeiten sind akzeptabel
- [ ] Keine Fehler

---

### Test 7.2: Große Datenmengen
**Ziel:** Prüfen, ob System mit vielen Daten umgeht.

**Schritte:**
1. **Kunde 1:**
   - 50 Rechnungen via Mirror hinzufügen
   - In App: Rechnungen-Seite öffnen
   - Prüfen: Alle Rechnungen werden angezeigt
   - Prüfen: Performance ist akzeptabel

**Checkliste:**
- [ ] Viele Rechnungen werden korrekt angezeigt
- [ ] Performance bleibt akzeptabel
- [ ] Pagination funktioniert (falls implementiert)

---

## Test-Zusammenfassung

### Erfolgskriterien
- [ ] Alle 3 Test-Kunden können sich einloggen
- [ ] Alle Daten werden korrekt vom Intranet gespiegelt
- [ ] App zeigt alle Daten korrekt an
- [ ] Alle User-Aktionen (Upgrade, Bestellung, Buchung) funktionieren
- [ ] E-Mails werden korrekt versendet
- [ ] Admin-Panel-Änderungen wirken sofort
- [ ] PDF-Downloads funktionieren sicher
- [ ] System ist stabil unter Last

### Bekannte Limitierungen (laut Entwicklungsplan)
- ✅ Mirror läuft nicht in Echtzeit (z.B. einmal pro Stunde)
- ✅ Keine automatische Referral-Code-Validierung
- ✅ Keine automatische Provisionierung (alles per E-Mail)

---

## Test-Dokumentation

**Tester:** _________________  
**Datum:** _________________  
**Version:** _________________  

**Ergebnisse:**
- [ ] Alle Tests bestanden
- [ ] Teilweise bestanden (Details: _______________)
- [ ] Tests fehlgeschlagen (Details: _______________)

**Bemerkungen:**
_________________________________________________
_________________________________________________
_________________________________________________


