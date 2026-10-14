# Sylke Gauder – Stickerei und gemeinsame Sortimente

Website: https://vanlifemum-boop.github.io/Silke-Gauner-stickerei/

Website-Entwurf in Rot, Anthrazit und Weiß. Die sichtbare Geschäftsbezeichnung lautet **Sylke Gauder**. Die vorhandene Repository-Adresse bleibt erhalten.

## Gemeinsamer Katalog

Stand der Zusammenführung: 12.10.2026. Die Übersicht zeigt **633 unterschiedliche Artikel und Produktideen**. 763 Quellangebote behalten ihre eigenen Detailrouten und Ausführungen; 130 doppelte Karten werden in der gemeinsamen Suche ausgeblendet. Unterschiedliche enthaltene Club-Logos sowie Text-, Logo- und Bildstickerei bleiben eigenständige Angebote.

| Sortiment | Quellangebote |
| --- | ---: |
| Arbeitsbekleidung besticken | 322 |
| Stölzinga | 107 |
| Meine Tischdecke | 60 |
| Bestickungen nach Maß | 122 |
| Eura Mobil Club | 39 |
| Forster Fahrer & Fans | 51 |
| Karmann Club | 21 |
| Waumobil | 32 |
| Maßhemd und Maßbluse | 2 |
| Frei gestaltbare Produktideen | 7 |

Pferdezubehoer-besticken.de führt zum Shop Bestickungen nach Maß. Die vier kaufbaren Pferdeartikel sind dort und im eigenen Pferdezubehör-Filter erreichbar, ohne doppelten Import. Ein Testprodukt und ausdrücklich nicht kaufbare Artikel werden nicht angeboten. Benimar bleibt als bestehender Clubbereich mit Logo und Vorschau erhalten.

Identische neutrale Shopware-Artikel werden anhand übereinstimmender Artikel-ID, Bezeichnung und Grundpreis zusammengeführt. Die jeweiligen Quellangebote bleiben auf der Produktseite verlinkt, damit unterschiedliche Optionen erhalten bleiben. Dokumentation: `docs/catalog-merge.json` und `docs/catalog-sources.json`.

## Bedienung

- `#/sortimente`: Shopbereiche, Hersteller/Marken und Clubs
- `#/shop`: kombinierbare Sortiments-, Hersteller-, Kategorie- und Suchfilter, Preis-/Namenssortierung und 24 Artikel je Ergebnisseite
- Produktseiten: belegte Farben, Größen, Maße, Logoausführungen, Quellpreise und Originalfotos
- `#/masshemden`: Maßhemd und Maßbluse, persönliche Maßaufnahme, Stoff- und Ausführungswünsche
- `#/newsletter`: optionaler Vorname, E-Mail, Themenauswahl und aktiv zu erteilende Einwilligung; Anmeldung wird als selbst zu versendender E-Mail-Entwurf vorbereitet
- WhatsApp: https://wa.me/491636997060 – keine automatische Nachricht, keine Festnetznummer auf der Website

Die neue Website bereitet unverbindliche Anfragen vor. Originalartikel können über den jeweiligen Link im bestehenden Shop gekauft werden. Es gibt keine eigene Zahlungsabwicklung, automatischen E-Mail-Versand oder automatischen Newsletter-Verteiler. Die Geschäfts- und Datenschutzhinweise kennzeichnen den Entwurfsstatus.

## Preise und Bestickung

Bestätigte Variantenpreise werden exakt angezeigt, weitere Kombinationen als Ab-Preis bzw. individuelle Anfrage. Preise sind datierte Quellangaben, keine Live-Synchronisierung. WooCommerce-Attribute behalten ihre nativen Parameternamen; ausdrücklich beliebige Variantenattribute werden als Wildcards ausgewertet.

Bereits enthaltene Text-, Logo- oder Bildstickerei wird nicht erneut pauschal berechnet. Wunschtext und Motivbeschreibung bleiben in Warenkorb und Anfrage erhalten. Eine zusätzlich nötige Stickdatei ist separat gekennzeichnet. Abweichende oder zusätzliche Logo-Bestickung wird gesondert angeboten.

Pferdezubehör besitzt native Zusatzfelder einschließlich bedingter Auswahl. Deren Aufpreise werden angefragt, nicht aus ungeprüften Formeln berechnet. Freie Tischdecken-Wunschmaße wechseln die Preisanzeige auf Anfrage. Schaumstoff, PVC, Folien, Lederhandschuhe, Metallartikel und Gutscheine erhalten keine unpassende Stickoption.

Die sieben Produktideen verwenden ausdrücklich gekennzeichnete Beispielpreise. Beim Camper-T-Shirt kostet ein kleines Logo im Entwurf 7,90 €, ein großes 14,90 € zusätzlich. Diese Beispiel-Aufpreise gelten nicht für importierte Originalartikel. Alle bisherigen Club-Logo-Auswahlen und die schematische T-Shirt-Vorschau bleiben erhalten.

## Quellen und Dateien

- `assortment-products.js` und `catalog/`: 611 allgemeine Shopangebote, Zuordnung gleicher Artikel und sachliche Datenkorrekturen
- `karmann-products.js`: 21 Karmann-Angebote
- `assortment-core.js`, `assortment-ui.js`: Sortiments-/Herstellerübersicht, Seiteneinteilung
- `catalog-options.js`: native Zusatzfelder, Bedingungen und Validierung
- `club-products.js`, `waumobil-products.js`, `tailored-products.js`: bestehende Sortimente
- `club-core.js`, `shop-core.js`: Optionen, Preise, Filter, Dubletten und Anfragekorb
- `club-ui.js`, `embroidery-ui.js`, `garment-preview.js`: Produktseiten und Bestickung

Neue Produktbilder und Herstellerlogos werden überwiegend von den verifizierten Quellshops geladen. Die bestehenden Clubbilder, Schriften, Konzeptbilder und Wohnungsfotos liegen lokal unter `assets/`. Fehlende Quellbilder erhalten eine neutrale Platzhalterfläche. Persönliche Kontakttexte und fremde Werbelinks aus den Quellseiten wurden nicht übernommen.

## Veröffentlichung und Prüfung

Buildlose HTML-/JavaScript-Website mit Hash-Routen und relativen lokalen Asset-Pfaden. GitHub Actions veröffentlicht bei Änderungen auf `main` nach `npm run check` bzw. den entsprechenden Node-Prüfungen. Alle zur Laufzeit benötigten Module werden in `_site/` kopiert.

41 Funktionstests bestehen. Zusätzlich wurden 1.447 Seitenvorlagen auf Überschriften, ausgeglichene HTML-Struktur, eindeutige IDs, Formularbeschriftungen, lokale Bilddateien und entfernte Kontaktdaten geprüft. Eine visuelle/interaktive Browserprüfung war in der Arbeitsumgebung nicht verfügbar.
