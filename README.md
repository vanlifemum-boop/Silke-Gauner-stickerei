# Stickerei Gauder – Website & Shop

Website-Entwurf für Handelsvertretung & Stickerei Sylke Gauder in Rot, Anthrazit und Weiß.

**Website:** https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/

## Enthalten

- Startseite, Shop und sechs Produktdetailseiten
- Produktsuche, Kategorien und Preissortierung
- Varianten, Wunschtext, Garnfarbe und schematische Stickvorschau
- Warenkorb mit lokaler Speicherung und E-Mail-Anfrage
- Firmen & Vereine, individuelle Bestickung, Über uns und Kontakt
- Responsive Gestaltung für Desktop, Tablet und Smartphone

## Entwurfsstatus

Produkte, Varianten, Preise und KI-erstellte Bilder sind Beispiele. Keine verbindlichen Bestellungen, keine Zahlungsabwicklung und kein automatischer E-Mail-Versand. Vor dem echten Shopbetrieb müssen das tatsächliche Sortiment, Konditionen und vollständige Rechtstexte ergänzt werden.

Die Kontaktdaten stammen von der bereitgestellten Visitenkarte. Der Markenname lautet **Sylke Gauder**; der vorgegebene Repository-Name bleibt unverändert.

## GitHub Pages

Die Website liegt direkt im Hauptverzeichnis und braucht keinen Build-Schritt.

- Quelle: GitHub Actions
- Workflow: `.github/workflows/pages.yml`
- Bei jedem Push auf `main`: JavaScript-Prüfung, Funktionstests und Veröffentlichung
- Veröffentlicht werden ausschließlich die Website-Dateien und Assets aus `_site/`.
- Der Workflow verwendet die offiziellen Actions aus der GitHub-Pages-Vorlage.

Alle Asset-Pfade sind relativ, sodass die Website auch unter dem Repository-Unterpfad funktioniert. Die Navigation verwendet Hash-Routen.

## Prüfung

Mit Node.js: `npm run check`

Preisberechnung, Varianten, Warenkorbspeicherung, Filter, Anfragetexte und HTML-Escaping sind durch Tests abgedeckt. Seitenstruktur und Asset-Verknüpfungen wurden geprüft. Eine interaktive Browserprüfung steht noch aus.

## Inhalte bearbeiten

- `shop-core.js`: Produkte, Varianten, Beispielpreise und Warenkorb-Logik
- `app.js`: Seiteninhalte und Interaktionen
- `styles.css`: Farben, Typografie und responsive Layouts
- `assets/`: lokale Bilder, Schriften und Favicon

## Quellen und Bildwelt

Die Sortimentsbereiche orientieren sich an https://www.handelsvertretung-gauder.de/unsere-shops/ (10.10.2026). Die Konzeptbilder wurden mit dem integrierten image_gen-Werkzeug erstellt und für die Website als WebP gespeichert. Sie sind keine dokumentarischen Aufnahmen des Betriebs oder seiner tatsächlichen Produkte.
