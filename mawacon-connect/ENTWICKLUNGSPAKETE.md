 # Entwicklungs-Pakete: Mawacon Connect App (Finales Angebot – 10.000 € brutto)

 ## Übersicht
 Die Mawacon Connect App ermöglicht Kunden:
 - Verträge zu verwalten
 - Hardware zu bestellen
 - TV-Pakete zu buchen
 - Freunde zu werben
 - Rechnungen einzusehen
 - Support zu kontaktieren

 Die App kommuniziert ausschließlich mit einem separaten **Public API Backend**, das:
 - unabhängig vom Mawacon-Intranet ist
 - seine Daten über einen **einseitigen Daten-Mirror (Push vom Intranet)** erhält
 - ein **Admin-Panel** zur Konfiguration bietet

 ---

 # Aufgabenpakete (inkl. Architektur-Anpassungen)
 Gesamtziel: Public Backend + React Native App + Admin UI  
 Gesamtbudget: **10.000 € brutto**

 ---

 ## Paket 1: Mobile App (iOS & Android)
 **Beschreibung:** Fertige App für iPhone und Android.

 **Leistungen:**
 - React Native App
 - Navigation & Grundstruktur
 - Dashboard-Integration
 - Kommunikation mit Public API

 **Kosten:** **2.500 €**

 ---

 ## Paket 2: Public API Backend (separater Docker-Container)
 **Beschreibung:** Public API für alle App-Funktionen.

 **Leistungen:**
 - Aufbau des API Servers
 - Endpunkte für Login, Verträge, Rechnungen, Bestellungen
 - Sicheres Token-Login & Passwort-Hashing
 - Mirror-Endpunkte zur Datenübernahme
 - Speicherung in der Public Mirror DB

 **Kosten:** **2.200 €**

 ---

 ## Paket 3: Daten-Mirror (Intranet → Public API)
 **Beschreibung:** Sicherer Push-Datenabgleich.

 **Leistungen:**
 - Mirror-API (/mirror/*)
 - Upsert-Logik für Kunden, Verträge, Rechnungen
 - Unterstützung für PDF-Übertragung

 **Kosten:** **900 €**

 ---

 ## Paket 4: Rechnungen & Sichere PDF-Downloads
 **Beschreibung:** Anzeige & Download von Rechnungen.

 **Leistungen:**
 - Rechnungsübersicht
 - Status (offen/bezahlt)
 - PDF-Download über zeitlich limitierte Einmal-Links

 **Kosten:** **800 €**

 ---

 ## Paket 5: Vertragsverwaltung & Tarifwechsel
 **Beschreibung:** Einsicht & Änderung von Vertragsdaten.

 **Leistungen:**
 - Vertragsinformationen anzeigen
 - Upgrade-Funktion
 - E-Mail an Mitarbeiter
 - Bestätigung an Kunden

 **Kosten:** **800 €**

 ---

 ## Paket 6: Hardware- & TV-Bestellungen
 **Beschreibung:** Produkt- und TV-Paketverwaltung.

 **Leistungen:**
 - Produktkatalog
 - Produktdetails
 - Bestellung an Mitarbeiter per E-Mail
 - Bestellhistorie anzeigen

 **Kosten:** **1.000 €**

 ---

 ## Paket 7: Freunde-werben (Referral)
 **Beschreibung:** Empfehlungscode & Übersicht.

 **Leistungen:**
 - Empfehlungscode anzeigen
 - Teilen via WhatsApp/E-Mail
 - Anzeige der geworbenen Freunde
 - E-Mail-Events an Mitarbeiter

 **Kosten:** **900 €**

 ---

 ## Paket 8: Support & FAQ
 **Beschreibung:** Kontaktmöglichkeiten.

 **Leistungen:**
 - WhatsApp-Link
 - Support-E-Mail
 - Support-Telefon
 - FAQ-Bereich

 **Kosten:** **500 €**

 ---

 ## Paket 9: Admin-Konfigurations-Panel
 **Beschreibung:** Interne Verwaltungsoberfläche.

 **Leistungen:**
 - E-Mail-Routing (TV, Hardware, Upgrade, Referral)
 - Aktionsbanner (Bild hochladen, an/aus)
 - WhatsApp-Supportdaten
 - Kontaktinformationen
 - Allgemeine Systemeinstellungen

 **Kosten:** **1.200 €**

 ---

 # Abgrenzungen (Nicht Bestandteil dieses Angebots)

 **1. Gutschein-Code-Handling (Referral)**  
 - Gutscheincodes werden **nicht automatisch verarbeitet**.  
 - Sie können optional vom Kunden eingegeben werden, aber:  
   - keine Validierung  
   - keine automatische Gutschrift  
   - keine Logik zur Code-Prüfung  

 **2. Echtzeit-Datenaktualisierung**  
 - Die App zeigt **gespiegelte Daten**, nicht Live-Daten.  
 - Der Mirror läuft z. B. **einmal pro Stunde**.  
 - Änderungen im Intranet erscheinen erst nach dem nächsten Sync.  

 **3. Kein direkter Zugriff auf das Intranet**  
 - Der Public API Server hat **keinen Zugang** zu internen Systemen.  
 - Alle Daten müssen vom Intranet aktiv an die Mirror-API gesendet werden.  

 **4. Keine automatische Provisionierung**  
 - Alle Anfragen (TV, Hardware, Upgrade) werden nur per E-Mail an Mitarbeiter geschickt.  
 - Es erfolgt **keine automatische Bearbeitung** oder Weiterverarbeitung.  

 **5. Keine Push-Benachrichtigungen**  
 - Push Notifications sind nicht Teil dieses Angebots.  

 **6. Kein Web-Kundenportal**  
 - Dieses Angebot umfasst ausschließlich die **Mobile App**.  
 - Keine Web-Version.

 ---

 # Zusammenfassung

 | Paket | Beschreibung | Kosten (€) |
 |-------|--------------|------------:|
 | 1 | Mobile Apps | 2.500 |
 | 2 | Public API Backend | 2.200 |
 | 3 | Daten-Mirror | 900 |
 | 4 | Rechnungen + PDF | 800 |
 | 5 | Vertragsverwaltung | 800 |
 | 6 | Hardware & TV | 1.000 |
 | 7 | Empfehlungssystem | 900 |
 | 8 | Support & FAQ | 500 |
 | 9 | Admin-Konfiguration | 1.200 |
 | **GESAMT** | | **10.000 € brutto** |

 ---

 # Projektlaufzeit
 **Geschätzte Dauer:** 6–8 Wochen

 - Woche 1–2: API + Mirror  
 - Woche 3–4: App Grundstruktur + Dashboard  
 - Woche 5–6: Rechnungen, Verträge, Bestellungen  
 - Woche 7–8: Referral, Admin UI, Tests  

 ---

 # Hinweise
 - Die App spricht ausschließlich mit dem Public API Server.  
 - Der Mirror erfolgt einseitig (Intranet → Public API).  
 - Admin UI ermöglicht Änderungen ohne neue Deployments.  
 - Keine Abhängigkeit zu externen Systemen.  
