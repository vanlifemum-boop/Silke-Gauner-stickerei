# Stickerei Gauder – Website & Shop

Website-Entwurf für Handelsvertretung & Stickerei Sylke Gauder in Rot, Anthrazit und Weiß.

**Website:** https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/

## Enthalten

- Startseite und gemeinsamer Shop mit 131 Einträgen: 122 Club- und Markenartikel, sieben Produktideen sowie Maßhemd und Maßbluse
- Eigene Club-Reiter mit 39 Eura-Mobil-, 51 Forster- und 32 Waumobil-Artikeln aus den bestehenden Shops
- Originale Produktfotos, Größen, Farben und Logo-Ausführungen; Club-Suche und Kategorien
- Benimar und Karmann Club mit Original-Logos und Links zu den bisherigen Shops; Produktübernahme folgt
- Produktsuche, Kategorien und Preissortierung
- Produktauswahl mit T-Shirt, sieben Farben und Größen XS–3XL
- Logo-Bestickung für alle Textilien: Club- oder eigenes Logo, drei zum Artikel passende Positionen, kleine/große Ausführung
- Eigene Kategorien für Hosen, Jacken und Pullover; Maßhemden und Maßblusen mit Stoffwunsch, Ärmel, Kragen, Manschetten und Maßaufnahme
- Direkter WhatsApp-Link zur Mobilnummer 0163 / 6997 060; Festnetznummer entfernt
- Live-Vorschau mit echten Club-Logos für Textilfarbe, Marke, Platzierung und Logogröße
- Varianten, Wunschtext, Garnfarbe und schematische Stickvorschau
- Warenkorb mit lokaler Speicherung und E-Mail-Anfrage
- Firmen & Vereine, individuelle Bestickung, Über uns und Kontakt
- Responsive Gestaltung für Desktop, Tablet und Smartphone

## Entwurfsstatus

Die 122 Club- und Markenartikel und ihre Fotos, Auswahloptionen und Preise stammen aus den bestehenden Eura-Mobil-, Forster- und Waumobil-Shops (Stand 10.10.2026). Die sieben frei gestaltbaren Produktideen mit ihren KI-erstellten Bildern verwenden Beispielpreise. Die neue Website bereitet unverbindliche Anfragen vor; Kaufen-Links öffnen den Originalartikel mit den gewählten Varianten im bestehenden Shop. Keine eigene Zahlungsabwicklung und kein automatischer E-Mail-Versand. Vor dem echten Shopbetrieb müssen das tatsächliche Sortiment, Konditionen und vollständige Rechtstexte ergänzt werden.

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

Preisberechnung, Varianten, Warenkorbspeicherung, Filter, Anfragetexte und HTML-Escaping sind durch Tests abgedeckt. Seitenstruktur und Asset-Verknüpfungen wurden geprüft. 32 Funktionstests bestehen; 271 Seitenvorlagen inklusive Startseite wurden auf Struktur, Beschriftungen und lokale Bildverweise geprüft. Eine visuelle/interaktive Browserprüfung dieser Erweiterung war in der Arbeitsumgebung nicht verfügbar.

## Inhalte bearbeiten

- `shop-core.js`: Produktideen, Beispielpreise und gemeinsame Warenkorb-Logik
- `club-products.js`: 90 importierte Eura-Mobil-/Forster-Artikel und verifizierte Variantenpreise
- `waumobil-products.js`: 32 Artikel aus dem Waumobil Fanshop mit Original-Ausführungen und Preisen
- `club-core.js`: Club-Auswahl, Variantenvalidierung, Preisberechnung und Quellenlinks
- `club-ui.js`: Club-Reiter, Maßhemden-Bereich, Katalog- und Produktseiten
- `embroidery-core.js` / `embroidery-ui.js`: artikelgerechte Stickpositionen, Logo-Auswahl und Aufpreisanfrage
- `tailored-products.js`: Maßhemden und Maßblusen aus dem bestehenden Angebot
- `contact.js`: WhatsApp-Ziel und Kontakt-Icon
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

Markenoptionen: Forster, Benimar, Karmann Club, Eura Mobil, Waumobil und eigenes Firmen-/Vereinslogo. Knaus wurde auf Wunsch entfernt. Alle fünf Marken nutzen ihre vorhandenen Club-Logos in der schematischen Vorschau. Eigene Logos erscheinen bis zur Abstimmung als beschrifteter Platzhalter.

Bei Oberteilen sind Brust, Ärmel oder unten links wählbar. Hosen bieten Oberschenkel, Gesäßtasche und Hosenbein; Westen, Schürzen, Caps, Taschen und Heimtextilien haben passende eigene Positionen. Konkrete Stickmaße und die Umsetzung stimmen wir persönlich ab. Die Beispiel-Aufpreise gelten ausschließlich für die sieben Produktideen.

## Club-Sortimente

- Eura Mobil: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/club/eura-mobil
- Forster: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/club/forster
- Waumobil: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/#/club/waumobil
- Benimar: Vorschauseite mit Original-Logo, Produkte folgen.
- Karmann Club: Vorschauseite mit Original-Logo und Link zum bestehenden Gauder-Shop; Produkte folgen.

Quellen: https://euramobilclub-shop.de/ und https://forster-fahrer-shop.de/, abgerufen am 10.10.2026. Eura Mobil Club verlinkt Gauder auf https://www.euramobilclub.de/ als Webshop. Der Benimar-Schriftzug stammt aus https://benimar-fans-shop.de/. Logos und Produktfotos wurden lokal gespeichert; Fotos werden für die Web-Auslieferung als WebP verkleinert. Zwei Artikel haben im Quellshop kein Produktfoto und verwenden deshalb eine neutrale Bild-Platzhalterfläche.

Exakt überprüfte Varianten zeigen ihren Stückpreis. Für weitere Kombinationen steht ein gekennzeichneter Ab-Preis; Verfügbarkeit und endgültiger Preis werden persönlich bestätigt. Der pauschale Beispiel-Aufpreis der frei gestaltbaren Camper Edition wird auf Clubartikel nicht angewendet. Bei den Miami-Tischsets wird die optionale Wunschbestickung mit dem Original-Aufpreis von 10,00 € pro Stück berechnet. Der Wunschtext ist auf 15 Zeichen begrenzt. Bekannte nicht verfügbare Kombinationen können nicht zur Anfrage hinzugefügt werden. Die abgelaufene Vorbestellfrist des EMC-Jahresshirts 2026 wird ausdrücklich angegeben.

Auswahl, Stückzahl, Logo-Ausführung und gesondert anzubietende Wünsche bleiben im Anfragekorb und im E-Mail-Entwurf erhalten. Preiswerte aus dem Browser-Speicher werden nicht übernommen. Die Produktdaten sind eine datierte Momentaufnahme und werden nicht automatisch mit den Originalshops synchronisiert.


## Maßanfertigung und zusätzliche Bestickung

Maßhemden und Maßblusen stammen aus https://www.individuelle-masshemden.de/. Es werden belegte Wünsche für Stoff/Farbe, Lang- oder Kurzarm, Kragen, Manschetten und persönliche Maßaufnahme angeboten. Bei Kurzarm entfällt die Manschette. Preise werden angefragt; historische Werbepreise und erfundene Standardgrößen werden nicht übernommen. Fotos und Varianten-Herkunft sind in `docs/tailored-sources.json` dokumentiert.

Bei realen Clubartikeln wird eine frei gewählte zusätzliche oder abweichende Bestickung gesondert angeboten. Der bekannte Grundpreis bleibt erhalten; Produktseite, Warenkorb und E-Mail weisen auf den noch fehlenden Stickaufpreis hin. Gutscheine sind vom Stickkonfigurator ausgenommen. Anfrageartikel erscheinen niemals als kostenlos.

Das Karmann-Mobil-Club-Logo stammt aus dem offiziellen Clubauftritt und ist identisch im bestehenden Gauder-Clubshop vorhanden. Herkunft: `docs/karmann-source.json`. Der WhatsApp-Link öffnet https://wa.me/491636997060 ohne automatisch eine Nachricht zu versenden.


## Waumobil Edition

Waumobil ist als eigener Reiter neben Eura Mobil, Forster, Benimar und Karmann verfügbar und in allen Logo-Konfiguratoren auswählbar. Der offizielle Auftritt https://waumobil.eu/gebrauchtes-wohnmobil-anbieten/ verlinkt den Waumobil Fanshop https://waumobil.handelsvertretung-gauder.de/. Das Original-Logo, die 32 gelisteten Produkte, Originalfotos, Farben, Größen und vorhandene Logoausführungen werden übernommen. „Nur Brustlogo“ und „Brust und Rücken groß“ behalten ihre überprüften Variantenpreise. Quellen sind in `docs/waumobil-source.json` und `docs/waumobil-products-source.json` dokumentiert.

## Sichtbare und austauschbare Logos

Die T-Shirt-Karte auf Startseite und im Shop zeigt die echten Club-Logos. Ihre bebilderte Logoauswahl wechselt die Vorschau sofort und übernimmt die Auswahl in den Produkt-Konfigurator. Die Logo-Schaltflächen in beiden Konfiguratoren zeigen Benimar Fans, Forster Fahrer & Fans, Eura Mobil Club, Karmann Club und Waumobil. Bei den frei gestaltbaren Oberteilen erscheint das gewählte Logo zusätzlich vergrößert. Position, Logogröße und Logo bleiben in Warenkorb und Anfrage erhalten. Die bestehenden Logo-Dateien werden unverändert verwendet. Versionsparameter laden die aktualisierten Oberflächenmodule auch bei einem bereits geöffneten Browser-Cache.
