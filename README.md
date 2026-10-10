# Stickerei Gauder – Website & Shop

Website-Entwurf für Handelsvertretung & Stickerei Sylke Gauder in Rot, Anthrazit und Weiß.

**Website:** https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/

## Enthalten

- Startseite, Shop und sieben frei gestaltbare Produktideen
- Eigene Club-Reiter mit 39 Eura-Mobil- und 51 Forster-Artikeln aus den bestehenden Shops
- Originale Produktfotos, Größen, Farben und Logo-Ausführungen; Club-Suche und Kategorien
- Benimar und Knaus als angekündigte Kollektionen; vorhandenes Benimar-Logo integriert
- Produktsuche, Kategorien und Preissortierung
- Produktauswahl mit T-Shirt, sieben Farben und Größen XS–3XL
- Camper Edition für T-Shirt, Polo und Hoodie: Marke, drei Positionen und zwei Logogrößen
- Live-Vorschau für Textilfarbe, Markenname, Platzierung und Logogröße
- Varianten, Wunschtext, Garnfarbe und schematische Stickvorschau
- Warenkorb mit lokaler Speicherung und E-Mail-Anfrage
- Firmen & Vereine, individuelle Bestickung, Über uns und Kontakt
- Responsive Gestaltung für Desktop, Tablet und Smartphone

## Entwurfsstatus

Die 90 Clubartikel und ihre Fotos, Auswahloptionen und Preise stammen aus den bestehenden Eura-Mobil- und Forster-Shops (Stand 10.10.2026). Die sieben frei gestaltbaren Produktideen mit ihren KI-erstellten Bildern verwenden Beispielpreise. Die neue Website bereitet unverbindliche Anfragen vor; Kaufen-Links öffnen den Originalartikel mit den gewählten Varianten im bestehenden Shop. Keine eigene Zahlungsabwicklung und kein automatischer E-Mail-Versand. Vor dem echten Shopbetrieb müssen das tatsächliche Sortiment, Konditionen und vollständige Rechtstexte ergänzt werden.

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

Preisberechnung, Varianten, Warenkorbspeicherung, Filter, Anfragetexte und HTML-Escaping sind durch Tests abgedeckt. Seitenstruktur und Asset-Verknüpfungen wurden geprüft. 21 Funktionstests bestehen; 113 Seitenvorlagen inklusive Startseite wurden auf Struktur, Beschriftungen und lokale Bildverweise geprüft. Eine visuelle/interaktive Browserprüfung dieser Club-Erweiterung war in der Arbeitsumgebung nicht verfügbar.

## Inhalte bearbeiten

- `shop-core.js`: Produktideen, Beispielpreise und gemeinsame Warenkorb-Logik
- `club-products.js`: 90 importierte Clubartikel und verifizierte Variantenpreise
- `club-core.js`: Club-Auswahl, Variantenvalidierung, Preisberechnung und Quellenlinks
- `club-ui.js`: Club-Reiter, Katalog- und Produktseiten
- `docs/club-sources.json`: Herkunft der Logos und Produktbilder
- `app.js`: Seiteninhalte und Interaktionen
- `garment-preview.js`: schematische, interaktive Textilvorschau
- `styles.css`: Farben, Typografie und responsive Layouts
- `assets/`: lokale Bilder, Schriften und Favicon

## Quellen und Bildwelt

Die Sortimentsbereiche orientieren sich an https://www.handelsvertretung-gauder.de/unsere-shops/ (10.10.2026). Die Konzeptbilder wurden mit dem integrierten image_gen-Werkzeug erstellt und für die Website als WebP gespeichert. Sie sind keine dokumentarischen Aufnahmen des Betriebs oder seiner tatsächlichen Produkte.

## Camper Edition

Direktlink: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/produkt/camper-tshirt?edition=camper

Beispielpreise: T-Shirt 24,90 €, kleines Logo +7,90 €, großes Logo +14,90 €. Der Wechsel von klein auf groß erhöht den Stückpreis um 7,00 €. Optionaler zusätzlicher Wunschtext kostet im Entwurf +7,90 €. Mengen, Logo-Aufpreis und Gesamtsumme werden gemeinsam berechnet; jede Konfiguration bleibt in Warenkorb und Anfrage erhalten.

Markenoptionen: Forster, Benimar, Knaus, Karmann-Mobil und Eura Mobil. Die diktierte Angabe „Fürstler“ wurde als Forster interpretiert; wegen „Knausman“ sind Knaus und Karmann-Mobil getrennt vorhanden. Eura Mobil, Forster und Benimar nutzen ihre vorhandenen Club-Logos auch in der schematischen Vorschau. Knaus und Karmann-Mobil zeigen vorläufig einen Markennamen als Platzhalter.

Positionen: vorne auf der linken Brust, linker Ärmel oder vorne unten links am Saum. „Links“ gilt aus Trägersicht. Konkrete Stickmaße und Logo-Ausführung sind noch abzustimmen. Alle Preiswerte stehen zentral in `shop-core.js`.

## Club-Sortimente

- Eura Mobil: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/club/eura-mobil
- Forster: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/club/forster
- Benimar: Vorschauseite mit Original-Logo, Produkte folgen.
- Knaus: Vorschauseite, Produkte und das konkrete Club-Logo folgen.

Quellen: https://euramobilclub-shop.de/ und https://forster-fahrer-shop.de/, abgerufen am 10.10.2026. Eura Mobil Club verlinkt Gauder auf https://www.euramobilclub.de/ als Webshop. Der Benimar-Schriftzug stammt aus https://benimar-fans-shop.de/. Logos und Produktfotos wurden lokal gespeichert; Fotos werden für die Web-Auslieferung als WebP verkleinert. Zwei Artikel haben im Quellshop kein Produktfoto und verwenden deshalb eine neutrale Bild-Platzhalterfläche.

Exakt überprüfte Varianten zeigen ihren Stückpreis. Für weitere Kombinationen steht ein gekennzeichneter Ab-Preis; Verfügbarkeit und endgültiger Preis werden persönlich bestätigt. Der pauschale Beispiel-Aufpreis der frei gestaltbaren Camper Edition wird auf Clubartikel nicht angewendet. Bei den Miami-Tischsets wird die optionale Wunschbestickung mit dem Original-Aufpreis von 10,00 € pro Stück berechnet. Der Wunschtext ist auf 15 Zeichen begrenzt. Bekannte nicht verfügbare Kombinationen können nicht zur Anfrage hinzugefügt werden. Die abgelaufene Vorbestellfrist des EMC-Jahresshirts 2026 wird ausdrücklich angegeben.

Auswahl, Stückzahl, Logo-Ausführung und gesondert anzubietende Wünsche bleiben im Anfragekorb und im E-Mail-Entwurf erhalten. Preiswerte aus dem Browser-Speicher werden nicht übernommen. Die Produktdaten sind eine datierte Momentaufnahme und werden nicht automatisch mit den Originalshops synchronisiert.
