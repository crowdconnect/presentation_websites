# Excel → LaTeX Generator (xlsx2tex)

> **Ziel:** Eine Excel-Datei wird über die Kommandozeile eingelesen und zu einer LaTeX-Datei mit **Spezialseiten** (Cover, Angebot, Einleitung) und **Sektionen** pro Tabellenblatt konvertiert – inkl. zuverlässiger **Sonderzeichen-Escapes**, **mehrseitiger Tabellen** (ltablex), **Bildunterstützung** und **Corporate-konformer** Gestaltungspunkte aus der Referenzvorlage.

---

## TL;DR – Schnellüberblick

| Thema | Kurzinfo |
|---|---|
| **Eingabe** | Eine `.xlsx` mit Blättern: `Cover Page`, `Angebot`, `Einleitung` (früher „Präambel"), weitere Sektionen. |
| **Ausgabe** | Eine `.tex` mit **unnummerierten** Sektionen, **Titelblatt** (Cover), **Angebot** inkl. Summenblock rechts, **mehrseitige Tabellen** via **ltablex**. |
| **Sonderzeichen** | Globales Escaping für `& % $ # _ { } ~ ^ \ €` → LaTeX-sicher. |
| **Details im Angebot** | **Keine** extra „Detail"-Spalte: Detailtexte **kursiv** direkt hinter **Leistung**. |
| **Subsections** | In Excel: `A=SUBSECTION`, `B=Name` → `\subsection*{…}` mit Table-Header-Reset. |
| **Listen** | `STARTENUM`/`ENDENUM` (Nummerierung), `STARTBULLET`/`ENDBULLET` (Aufzählung). |
| **Bilder** | `A=FIGURE`, `B=Caption`, `C=Filename`, `D=Width`, `E=Height` → LaTeX figure environment. |
| **Benutzerdefinierte Tabellen** | `TABLESTART`/`TABLEEND` mit LaTeX colspec für vollständige Layout-Kontrolle. |
| **Leerzeilen** | Leere Zeile → sichtbarer Abstand (`\par\medskip`); **nach Tabellen** ebenfalls. |
| **Reihenfolge** | Sektionen erscheinen **in der Excel-Reihenfolge**. |
| **Dynamische Variablen** | Alle Daten aus dem Cover Page Sheet werden automatisch als `\newcommand` generiert. |
| **Direkte PDF-Generierung** | Ein-Klick-PDF mit automatischer LaTeX-Kompilierung. |

---

## Installation & Lauf

### Voraussetzungen
- Python 3.9+
- Paket **openpyxl**
- (LaTeX) `lualatex` oder `pdflatex` mit folgenden Paketen in der Präambel:  
  `babel[ngerman]`, `geometry`, `graphicx`, `booktabs`, **`ltablex` + `\keepXColumns`**, `hyperref`, `titlesec`, `siunitx`, `eurosym`

> **Hinweis:** Die **CLI** nutzt eine **interne Präambel** mit all diesen Paketen. Du musst nichts ergänzen, solange du die CLI verwendest.

### Ausführen (CLI)
```bash
# Standard: gleiche Basis + .tex
python cli.py -i Eingabemaske_Angebot.xlsx

# Ausgabedatei festlegen (.tex)
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.tex

# Direkt PDF generieren (.pdf)
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.pdf

# PDF generieren ohne automatisches Öffnen
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.pdf --no-open
```

### Output
- **Standard**: `Eingabemaske_Angebot.tex` im gleichen Verzeichnis
- **Mit -o .tex**: Benutzerdefinierte .tex Datei
- **Mit -o .pdf**: Direkt PDF generieren (erstellt auch temporäre .tex Datei)
- **Alle Ausgabedateien** werden im `output/` Unterverzeichnis gespeichert
- **Kompilieren** (manuell):
  ```bash
  lualatex Angebot.tex
  ```

---

## PDF-Output

### **Automatische PDF-Generierung**
Das Programm kann direkt PDFs erzeugen, wenn Sie als Ausgabedatei eine `.pdf` Datei angeben:

```bash
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.pdf
```

### **Was passiert:**
1. ✅ **LaTeX-Datei generiert** (temporär, gleicher Name ohne .pdf)
2. ✅ **PDF kompiliert** mit `lualatex` (zweimal für Referenzen)
3. ✅ **PDF-Datei erstellt** im angegebenen Verzeichnis
4. ✅ **PDF wird automatisch geöffnet** (kann mit `--no-open` deaktiviert werden)
5. ✅ **Temporäre Dateien** bleiben erhalten (können gelöscht werden)

### **Voraussetzungen:**
- **LaTeX-Installation** mit `lualatex` Support
- **Alle benötigten Pakete** (werden automatisch geladen)
- **Schreibberechtigung** im Ausgabeverzeichnis

### **Installation von LaTeX:**
```bash
# macOS
brew install --cask mactex

# Ubuntu/Debian
sudo apt-get install texlive-luatex

# Windows
# Install MiKTeX oder TeX Live
```

### **Vorteile:**
- 🚀 **Ein-Klick-PDF** - Kein manuelles Kompilieren nötig
- 📱 **Sofort verwendbar** - PDF kann direkt geöffnet/verschickt werden
- 🔧 **Automatische Fehlerbehandlung** - Klare Fehlermeldungen bei Problemen
- 📁 **Flexible Ausgabe** - .tex oder .pdf je nach Bedarf
- 🎯 **Automatisches Öffnen** - PDF wird sofort angezeigt

---

## Excel-Struktur & Regeln

### 1) **Cover Page** (Spezialseite, **kein** Tabellenlayout)
Zweispaltig (A: Key, B: Value). Erkannte Schlüssel:

| Key (A) | Bedeutung (B) |
|---|---|
| `Project` | Projekttitel (fett, groß) |
| `OfferId` | Angebotsnummer |
| `OfferDate` | Angebotsdatum |
| `CustomerName` | Kundenname |
| `CustomerAddress` | Kundenadresse |
| `CustomerZip` | Kunden-PLZ |
| `SupplierName` | Anbieter |
| `SupplierAddress` | Anbieteradresse |
| `SupplierUSt` | Anbieter USt-ID |
| `CustomerLogo` | Pfad/Datei Kundenlogo |
| `SupplierLogo` | Pfad/Datei Anbieterlogo |
| `Version` | Versionsnummer |
| `Footnote` | Fußnote auf der Cover Page |

**Rendering:** `titlepage` mit Logos (links/rechts), Titel, Angebotsnummer, Kunde/Anbieter, Datum, dynamische Fußnote. Danach `\clearpage`.

**Dynamische Variablen:** Alle Daten werden automatisch als `\newcommand` generiert und können in Header/Footer verwendet werden.

---

### 2) **Angebot** (Spezialseite)
**Parteien-Tabelle:** Zu Beginn wird automatisch eine Tabelle mit Kunde/Anbieter und Angebotsdaten eingefügt.

**Haupttabelle:** Erste Tabellenzeile = Header. **Keine „Detail"-Spalte** im Output:  
- Falls eine Detailspalte in Excel existiert: deren Text wird **kursiv inline** an **Leistung** angehängt.  
- **Leistung** wird **fett** dargestellt, **Details** werden **kursiv** dargestellt.

**Subsections im Angebot:**  
- Zeile mit `A=SUBSECTION`, `B=<Titel>` → `\subsection*{<Titel>}`; laufende Tabelle wird davor geschlossen und mit **wiederholtem Header** fortgeführt.

**Summenblock (rechts):**  
Zeilen mit `Netto`, `USt/MwSt/Umsatzsteuer`, `Brutto` werden **nicht** als Positionszeilen gedruckt, sondern **rechtsbündig** unter die Tabelle gesetzt mit schöner Formatierung:
```latex
\midrule
\multicolumn{4}{r}{\textbf{Zwischensumme (netto)}} & \textbf{\SI{10000}{€}} \\
\multicolumn{4}{r}{zzgl.\ USt.\ 19\,\%} & \SI{1900}{€} \\
\multicolumn{4}{r}{\textbf{Gesamtbetrag (brutto)}} & \textbf{\SI{11900}{€}} \\
\bottomrule
```

**Sonderzeichen:** siehe Abschnitt „Escaping".

---

### 3) **Einleitung** (früher „Präambel")
- Pro Zeile **ein Absatz** (Spalte A).  
- **Leere Zeile** → Abstand (`\par\medskip`).  
- **Listen:**  
  - Nummeriert: `STARTENUM` … `ENDENUM` *(auch `ENUMSTART`/`ENUMEND` unterstützt)*  
  - Punkte: `STARTBULLET` … `ENDBULLET` *(auch `BULLETSTART`/`BULLETEND`)*

---

### 4) **Weitere Blätter → Sektionen**
- Jedes weitere Blatt → `\section*{<Sheetname>}`.  
- **Tabellen-Erkennung:** Mind. zwei **nicht-leere** Spalten → Tabellenzeile.  
- Einspaltige Zeilen → Absatz.  
- `SUBSECTION`-Logik wie im Angebot (hat **Vorrang** vor Tabellenerkennung).

### 5) **Benutzerdefinierte Tabellen mit TABLESTART/TABLEEND**
Für vollständige Kontrolle über das Tabellenlayout können Sie das neue Keyword-System verwenden:

| Keyword | Spalte A | Spalte B | Beschreibung |
|---|---|---|---|
| `TABLESTART` | `TABLESTART` | `lXX` | Startet eine benutzerdefinierte Tabelle mit dem angegebenen Layout |
| `TABLEEND` | `TABLEEND` | (leer) | Beendet die benutzerdefinierte Tabelle |

**Layout-String Beispiele:**
- `lXX` → Linke Spalte fest, zwei X-Spalten (expandierbar)
- `r|X|X` → Rechte Spalte fest, Trennlinien, zwei X-Spalten
- `p{3cm}X` → 3cm feste Breite, eine X-Spalte
- `lcc` → Drei zentrierte Spalten
- `|l|r|X|` → Trennlinien, links, rechts, expandierbar

**Beispiel Excel-Struktur:**
```
A           B           C           D
TABLESTART  lXX
Name        Description Value
Item 1      Desc 1     100
Item 2      Desc 2     200
TABLEEND
```

**Vorteile:**
- ✅ **Vollständige Kontrolle** über Spaltenbreiten und -ausrichtung
- ✅ **Flexible Layouts** mit Trennlinien, festen Breiten, etc.
- ✅ **Kombinierbar** mit allen anderen Features (Listen, Subsections, etc.)
- ✅ **Mehrseitige Tabellen** mit automatischen Kopf-/Fußzeilen

### 6) **Bilder mit FIGURE Kommando**
Für die Einbindung von Bildern in Ihre Dokumente:

| Keyword | Spalte A | Spalte B | Spalte C | Spalte D | Spalte E |
|---|---|---|---|---|---|
| `FIGURE` | `FIGURE` | Caption | Filename | Width | Height |

**Beispiel Excel-Struktur:**
```
A       B               C           D               E
FIGURE  Ein schönes Logo logo.png  0.5\textwidth   3cm
FIGURE  Diagramm        chart.png   0.8\textwidth   
FIGURE  Screenshot      screen.png                  4cm
```

**Parameter:**
- **Caption** (B): Bildunterschrift (optional)
- **Filename** (C): Bilddatei (erforderlich)
- **Width** (D): Breite (optional, z.B. `0.5\textwidth`, `5cm`)
- **Height** (E): Höhe (optional, z.B. `3cm`)

**Standardwerte:**
- Falls keine Breite/Höhe angegeben: `width=0.8\textwidth`
- Falls nur Breite angegeben: Nur Breite wird gesetzt
- Falls nur Höhe angegeben: Nur Höhe wird gesetzt

**Generierte LaTeX:**
```latex
\begin{figure}[htbp]
\centering
\includegraphics[width=0.5\textwidth,height=3cm]{logo.png}
\caption{Ein schönes Logo}
\end{figure}
```

**Vorteile:**
- ✅ **Einfache Bildverwaltung** direkt in Excel
- ✅ **Flexible Größenangaben** mit LaTeX-Standard-Einheiten
- ✅ **Automatische Zentrierung** und Beschriftung
- ✅ **Professionelle Darstellung** mit figure environment
- ✅ **Kombinierbar** mit allen anderen Features

---

## LaTeX-Layout & Technik

| Baustein | Umsetzung |
|---|---|
| **Sektionen** | `\section*{…}` und `\subsection*{…}` (unnummeriert). |
| **TOC-Einträge** | via `\addcontentsline` (optional je nach Build – in der CLI ist es aktiv). |
| **Tabellen** | **ltablex** (Longtable + `X`-Spalten): mehrseitig, Kopf-/Fußzeilen via `\endfirsthead`, `\endhead`, `\endfoot`, `\endlastfoot`. |
| **Spaltenlayout** | **Text** → `X` (autom. Umbruch), **Zahlen** → `r` (rechtsbündig, automatische Erkennung). |
| **Sonderzeichen** | Globales Escaping für `& % $ # _ { } ~ ^ \ €`. |
| **Abstände** | Leere Zeile erzeugt `\par\medskip`. Zusätzlich: Leere Zeile **direkt nach** einer Tabelle → Abstand. |
| **Währung** | `€` → `€` (direkte Unicode-Unterstützung mit `newunicodechar`). `siunitx` bereits geladen. |
| **Dynamische Variablen** | Alle Cover Page Daten werden als `\newcommand` generiert und können in Header/Footer verwendet werden. |
| **Bilder** | `\includegraphics` mit automatischer Zentrierung und Beschriftung. |
| **Tabellenbreiten** | Automatische Überlaufvermeidung mit `\textwidth` und intelligenten Spaltenspezifikationen. |

> **Hinweis:** Falls du **eigene Präambel** nutzen willst, stelle sicher, dass folgende Pakete geladen sind:  
> `fontspec` (für Unicode-Unterstützung), `ltablex` (mit `\keepXColumns`), `booktabs`, `siunitx`, `eurosym`, `graphicx`, `hyperref`, `titlesec`, `babel[ngerman]`, `geometry`.

---

## Tabellenformatierung

### **Angebot-Tabelle (Spezialbehandlung)**
- Verwendet `ltablex_from_rows_with_totals`
- **Leistung + Details** werden in einer Spalte zusammengeführt
- **Leistung** wird **fett** dargestellt
- **Details** werden **kursiv** dargestellt
- **Summenzeilen** mit schöner Formatierung und `\SI{...}{€}`

### **Andere Tabellen (Generische Behandlung)**
- Verwenden `ltablex_generic`
- **Flexibel** mit beliebiger Spaltenanzahl
- **Alle Spalten** werden beibehalten
- **Einheitliche Formatierung** für alle Tabellen
- **Intelligente Spaltenspezifikation**: `r` für Zahlen, `X` für Text

### **Benutzerdefinierte Tabellen (TABLESTART/TABLEEND)**
- Verwenden `ltablex_custom_layout`
- **Vollständige Kontrolle** über Spaltenbreiten und -ausrichtung
- **Flexible Layouts** mit Trennlinien, festen Breiten, etc.
- **LaTeX-Standard colspec** (z.B. `lXX`, `r|X|X`, `p{3cm}X`)
- **Mehrseitige Tabellen** mit automatischen Kopf-/Fußzeilen

### **Tabellenbreiten-Kontrolle**
- **Automatische Überlaufvermeidung** mit `\textwidth`
- **Intelligente Spaltenspezifikationen**:
  - `r` für Zahlen (rechtsbündig, feste Breite)
  - `X` für Text (flexible Breite, automatischer Umbruch)
- **Reduzierte Abstände** (`\tabcolsep{4pt}`) für bessere Platznutzung
- **Optimierte Zeilenhöhe** (`\arraystretch{1.1}`) für bessere Lesbarkeit

---

## Inline-Formatierung in Zellen

| Markup im Excel-Inhalt | Ergebnis in LaTeX |
|---|---|
| `**fett**` oder `__fett__` oder `<b>fett</b>` | `\textbf{fett}` |
| `*kursiv*` oder `<i>kursiv</i>` | `\textit{kursiv}` |

> **Hinweis:** Teilformatierungen *innerhalb einer Zelle* über Excel selbst sind in `openpyxl` nicht zuverlässig verfügbar. Das oben genannte **Markup** ist robust und wird bevorzugt.

---

## CLI-Optionen

```text
usage: cli.py [-i INPUT] [-o OUTPUT] [--no-open]

-i, --input     Pfad zur Excel-Datei (.xlsx)   [erforderlich]
-o, --output    Pfad zur Ausgabedatei (.tex)   [optional]
--no-open       PDF nicht automatisch öffnen   [optional]
```

**Beispiele**
```bash
# Standard: gleiche Basis + .tex
python cli.py -i Eingabemaske_Angebot.xlsx

# Ausgabedatei festlegen
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.tex

# Direkt PDF generieren
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.pdf

# PDF generieren ohne automatisches Öffnen
python cli.py -i Eingabemaske_Angebot.xlsx -o Angebot.pdf --no-open
```

---

## Programmatic API (Python)

```python
from core import build_from_workbook
from latex import wrap_document

cover_data, body = build_from_workbook("Eingabemaske_Angebot.xlsx")  # erzeugt cover_data und body
tex = wrap_document(INTERNAL_PREAMBLE, body, cover_data)             # mit cover_data kombinieren
open("Angebot.tex","w",encoding="utf-8").write(tex)
```

> So kannst du einfach ein **eigenes Template** verwenden, ohne die CLI-Preamble zu nutzen.

---

## Troubleshooting

| Problem | Ursache | Lösung |
|---|---|---|
| `Undefined control sequence \euro` | Preamble lädt `eurosym` nicht | CLI verwenden (lädt `eurosym`) **oder** selbst `\usepackage{eurosym}` hinzufügen. |
| Tabelle läuft über Rand / bricht nicht um | Preamble ohne `ltablex`/`keepXColumns` | `\usepackage{ltablex}` + `\keepXColumns` einbinden. |
| Ein `&` trennt Spalten unerwartet | Unescaped `&` im Zelltext | Der Generator escaped `& → \&`. Prüfe, ob du die generierte `.tex` manuell verändert hast. |
| Detailspalte erscheint doch | Excel-Header nicht erkannt | Stelle sicher, dass die Spalte **„Detail"/„Details"** exakt so heißt **oder** nutze eine einspaltige Detailzeile unter der Position. |
| `STARTENUM` funktioniert nicht | Schreibweise abweichend | Unterstützt: `STARTENUM`/`ENDENUM` **und** `ENUMSTART`/`ENUMEND`. Gleiches für BULLET. |
| Dynamische Variablen funktionieren nicht | Cover Page Sheet fehlt oder hat falsche Schlüssel | Stelle sicher, dass das Cover Page Sheet die korrekten Schlüssel verwendet (Project, OfferId, CustomerName, etc.). |
| TABLESTART funktioniert nicht | Layout-String fehlt oder ist ungültig | Stelle sicher, dass in Spalte B ein gültiger LaTeX colspec steht (z.B. 'lXX', 'r|X|X'). |
| TABLEEND fehlt | Tabelle wird nicht beendet | Jede TABLESTART muss ein entsprechendes TABLEEND haben. |
| FIGURE funktioniert nicht | Dateiname fehlt oder ist ungültig | Stelle sicher, dass in Spalte C ein gültiger Dateiname steht. |
| Bilder werden nicht angezeigt | Bilddatei nicht gefunden | Stelle sicher, dass die Bilddatei im gleichen Verzeichnis wie die LaTeX-Datei liegt. |
| PDF-Generierung schlägt fehl | lualatex nicht gefunden | Installieren Sie LaTeX mit lualatex Support (siehe PDF-Output Abschnitt). |
| PDF wird nicht erstellt | Schreibberechtigung fehlt | Stellen Sie sicher, dass Sie Schreibrechte im Ausgabeverzeichnis haben. |
| Tabellen laufen über den Rand | Zu viele Spalten oder zu breite Inhalte | Verwenden Sie TABLESTART mit X-Spalten für automatischen Umbruch oder reduzieren Sie die Anzahl der Spalten. |
| Deutsche Zeichen werden zu SS | ß wird zu SS konvertiert | Das System verwendet fontspec für native Unicode-Unterstützung. Stellen Sie sicher, dass lualatex verwendet wird. |

---

## Projektstruktur (Entwickler)

| Datei | Zweck |
|---|---|
| `cli.py` | CLI (interne Präambel; liest `.xlsx`, schreibt `.tex`/`.pdf`). |
| `core.py` | Excel-Parsing, Angebot-/Einleitung-/Sektionen-Renderer, Escapes & Logik. |
| `latex.py` | LaTeX-Helfer (`section*`, `subsection*`, **ltablex**-Builder, dynamische Variablen, FIGURE). |
| `cover.py` | Titelblatt-Rendering (Logos, Titel, Angebotsnummer, Kunde/Anbieter, Datum, dynamische Fußnote). |
| `utils.py` | Escapes, Inline-Markup, Whitespace-Koaleszenz. |
| `requirements.txt` | Python-Abhängigkeiten. |

---

## Neueste Verbesserungen

### **v0.5.0 - Bildunterstützung & Verbesserte Tabellenbreiten**
- ✅ **FIGURE Kommando**: Einfache Bildverwaltung direkt in Excel
- ✅ **Flexible Bildgrößen**: Breite und Höhe mit LaTeX-Standard-Einheiten
- ✅ **Automatische Zentrierung**: Bilder werden automatisch zentriert und beschriftet
- ✅ **Verbesserte Tabellenbreiten**: Automatische Überlaufvermeidung mit intelligenten Spaltenspezifikationen
- ✅ **Optimierte Abstände**: Reduzierte Spaltenabstände und optimierte Zeilenhöhen
- ✅ **Robuste TABLESTART-Verarbeitung**: Verbesserte Logik für benutzerdefinierte Tabellen
- ✅ **Automatisches PDF-Öffnen**: PDFs werden nach der Generierung automatisch geöffnet
- ✅ **Output-Verzeichnis**: Alle generierten Dateien werden im `output/` Unterverzeichnis gespeichert
- ✅ **Deutsche Zeichen**: Native Unicode-Unterstützung mit fontspec für korrekte Darstellung von ß, ä, ö, ü, Ä, Ö, Ü

### **v0.4.0 - Dynamische Variablen & Verbesserte Tabellen**
- ✅ **Dynamische Variablen**: Alle Cover Page Daten werden automatisch als `\newcommand` generiert
- ✅ **Header/Footer**: Verwenden jetzt dynamische Variablen aus dem Cover Page Sheet
- ✅ **Verbesserte Tabellenformatierung**: Angebot-Tabelle mit spezieller Summenformatierung
- ✅ **Generische Tabellenbehandlung**: Flexibel mit beliebiger Spaltenanzahl
- ✅ **Leistung + Details**: Werden in einer Spalte zusammengeführt (Leistung fett, Details kursiv)
- ✅ **Benutzerdefinierte Tabellen**: Neues TABLESTART/TABLEEND System für vollständige Layout-Kontrolle
- ✅ **Direkte PDF-Generierung**: Ein-Klick-PDF-Output mit automatischer LaTeX-Kompilierung
- ✅ **Verbesserte Euro-Symbole**: Korrekte Darstellung von € Zeichen mit `newunicodechar` und `eurosym`

### **v0.3.0 - Cover Page & TOC**
- ✅ **Professionelle Cover Page**: Mit Logos, Titel, Angebotsnummer, Kunde/Anbieter, dynamischer Fußnote
- ✅ **Inhaltsverzeichnis**: Automatisch nach der Cover Page
- ✅ **Header/Footer**: Auf allen Seiten nach dem Inhaltsverzeichnis
- ✅ **Parteien-Tabelle**: Im Angebot-Sheet mit Kunde/Anbieter und Angebotsdaten

### **v0.2.0 - LaTeX Escaping**
- ✅ **Korrekte Sonderzeichen-Behandlung**: `\n`, `\t`, `\r` werden korrekt escaped
- ✅ **Robuste Textverarbeitung**: Keine doppelten Escapes mehr
- ✅ **Flexible Tabellenerkennung**: Automatische Spaltenanzahl-Erkennung

---

## Roadmap / Anpassungen (optional)
- **siunitx `S`-Spalten** für Beträge (dezimal ausgerichtet).
- Konfigurierbare **Fortsetzungstexte** in Longtables.
- Konfigurierbares **Spacing** (`\smallskip`/`\bigskip`) für Leerzeilen.
- **Mehrsprachige Unterstützung** (aktuell: Deutsch).
- **Bildgrößen-Optimierung** basierend auf Bildinhalt.
- **Automatische Bildumbenennung** für bessere Organisation.

---

## Lizenz
Interne Nutzung. Bitte vor Weitergabe klären.

---

## Euro-Symbol-Behandlung

### **Problem gelöst: € wird als "e" angezeigt**
Das Problem lag daran, dass das `€` Zeichen nicht korrekt von LaTeX verarbeitet wurde. Dies wurde behoben durch:

### **Lösung implementiert:**
1. **`newunicodechar` Paket**: Definiert Unicode-Zeichen korrekt
2. **`eurosym` Paket**: Stellt das Euro-Symbol bereit
3. **`textcomp` Paket**: Zusätzliche Text-Symbole
4. **Robuste Definitionen**: `\DeclareRobustCommand{\texteuro}{\euro}`

### **Was wurde hinzugefügt:**
```latex
\usepackage{newunicodechar}
\usepackage{eurosym}
\usepackage{textcomp}

% Better Euro symbol handling with newunicodechar
\newunicodechar{€}{€}
\newunicodechar{–}{--}
\newunicodechar{—}{---}

% Ensure Euro symbol works with different fonts
\DeclareRobustCommand{\texteuro}{\euro}
```

### **Ergebnis:**
- ✅ **€ Zeichen** werden korrekt als Euro-Symbol angezeigt
- ✅ **Keine "e" Zeichen** mehr in der Ausgabe
- ✅ **Professionelle Darstellung** von Währungsangaben
- ✅ **Korrekte Summenzeilen** mit `\SI{...}{€}`
- ✅ **Unicode-Unterstützung** für weitere Sonderzeichen

### **Verwendung:**
Das System erkennt automatisch `€` Zeichen in Excel und konvertiert sie korrekt zu `€` in LaTeX, was dann als echtes Euro-Symbol in der PDF angezeigt wird.

