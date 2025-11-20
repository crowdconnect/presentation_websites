 # Aufgabenpakete für die Entwicklung der Kundenplattform
 
 ## Paket 1 – Mobile App (React Native)
  Entwicklung einer mobilen App für iOS und Android auf Basis von React Native.
  Umsetzung aller Screens, Navigationsstrukturen und Benutzerabläufe.
  Integration mit der öffentlichen API für Login, Verträge, Rechnungen und Bestellungen.
  Keine Designarbeit notwendig, da ein fertiges Next.js-Frontend als Vorlage existiert.
 
 ## Paket 2 – Öffentliche API (Backend)
  Aufbau eines neuen Public-API-Servers, der ausschließlich mit der App kommuniziert.
  Die API enthält Authentifizierung, Datenbereitstellung und alle Business-Logiken.
  Keine direkte Verbindung zum Mawacon-Intranet, nur abgesicherte Kommunikation.
  Trennung zwischen Endkunden-Endpunkten und Mirror-Endpunkten.
 
 ## Paket 3 – Daten-Mirror vom Intranet ins öffentliche System
  Erstellung einer Mirror-API auf dem öffentlichen Server.
  Einrichtung eines Cronjobs im Mawacon-Intranet, der regelmäßig Kunden-, Vertrags- und Rechnungsdaten an die Public API sendet.
  Synchronisation erfolgt einseitig: Intranet → Öffentlicher Server (Push-Modell).
  Sicherstellen, dass der Public-Server niemals direkten Zugriff auf das Intranet benötigt.
 
 ## Paket 4 – Registrierungssystem für Kunden
  Entwicklung eines sicheren Registrierungsprozesses für Bestandskunden.
  Abgleich von Kundennummer, E-Mail und optional PLZ oder weiterem Merkmal.
  Versand von Bestätigungslinks oder Codes per E-Mail.
  Erstellung eines App-Kontos und Setzen eines Passworts nach erfolgreicher Verifikation.
 
 ## Paket 5 – Login- und Session-Verwaltung
  Implementierung eines sicheren Login-Systems basierend auf dem registrierten App-Konto.
  Passwort-Hashing (bcrypt/Argon2), Token-Erstellung und Session-Handling.
  Zugriffsschutz auf alle kundenrelevanten Funktionen.
 
 ## Paket 6 – Vertragsverwaltung
  Bereitstellung der Vertragsdaten aus dem Mirror (Tarif, Geschwindigkeit, Status).
  Möglichkeit für Kunden, Tarif-Upgrades anzufragen.
  Automatisches Erzeugen einer Mail an interne Mitarbeiter bei Upgrade-Anfragen.
 
 ## Paket 7 – Rechnungsübersicht und PDF-Downloads
  Darstellung aller Rechnungen inkl. Nummer, Datum, Betrag und Status.
  Bereitstellung sicherer PDF-Downloads über zeitbegrenzte Einmal-Links.
  Verarbeitung der PDF-Dateien aus dem Mirror und Schutz vor direktem Zugriff.
 
 ## Paket 8 – Hardware-Bestellungen
  Produktübersicht für Router, Booster und Zubehör.
  Bestellprozess inkl. Speicherung, Bestellhistorie und automatischer E-Mail an das Support-Team.
  Integration der Bestellung in die App und API.
 
 ## Paket 9 – TV-Paketverwaltung
  Anzeige aller verfügbaren TV-Pakete mit Preisen und Details.
  Kunden können Pakete buchen; das System sendet automatisch eine E-Mail an Mitarbeiter zur Bearbeitung.
  Anzeige bereits gebuchter Pakete.
 
 ## Paket 10 – Freunde-werben / Referral-System
  Anzeige eines persönlichen Einladungscodes für jeden Kunden.
  Teilen über WhatsApp, E-Mail oder Social Media.
  Mirror-basierte Verwaltung der geworbenen Freunde und deren Status.
  Automatische E-Mail an Mitarbeiter, wenn eine Prämie oder ein Gutschein ausgelöst wird.
 
 ## Paket 11 – Support- und Hilfe-Bereich
  Bereitstellung eines Hilfe-Screens in der App.
  Anzeige von Kontaktmöglichkeiten wie WhatsApp, Telefon und E-Mail.
  Integration eines FAQ-Bereichs.
 
 ## Paket 12 – E-Mail-Benachrichtigungssystem
  Automatischer Versand von E-Mails an interne Mitarbeiter bei Vertragsänderungen, Bestellungen und Referral-Aktivierungen.
  Versand von Bestätigungs-E-Mails an Kunden.
  Integration eines zuverlässigen Mail-Providers.
 
 ## Paket 13 – Hosting & Architektur
  Aufsetzen eines separaten öffentlichen API-Servers (z. B. Docker-Umgebung).
  Einrichtung der Mirror-Endpunkte und Sicherstellung der Einbahn-Kommunikation.
  Härtung des Servers, HTTPS, Rate Limits, Monitoring.
 
 ## Paket 14 – Qualitätssicherung und Tests
  Durchführung umfangreicher Tests auf iOS und Android.
  Tests der API-Endpunkte, Synchronisation und Registrierungsabläufe.
  Fehlerbehebungen und Optimierungen.
 
 ## Paket 15 – Übergabe und Wartung
  Dokumentation der API, Datenstrukturen und Deployments.
  Übergabe des Systems in den Betrieb inklusive Anleitung und Supportprozessen.
  Optional: laufende Wartung, Fehlerbehebungen und Erweiterungen.
 
