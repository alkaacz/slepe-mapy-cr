# Slepá mapa Česka

Interaktivní slepá mapa ČR — klikneš na naznačenou řeku nebo vodní dílo a doplníš jeho název. Bez přihlašování, bez backendu, čisté HTML/CSS/JS.

Odkaz: https://<tvuj-ucet>.github.io/slepe-mapy-cr

## Lokální spuštění

V terminálu spusť:

```
cd slepe-mapy-cr
python -m http.server 8000
```

Potom otevři v prohlížeči:

- výběr kategorie: http://localhost:8000
- přímo konkrétní režim: http://localhost:8000/map.html?mode=reky

Server ukončíš v terminálu klávesovou zkratkou `Ctrl+C`.

## Jak hra funguje

1. Na `index.html` vybereš kategorii (Řeky / Vodní díla / …).
2. Otevře se `map.html?mode=<klíč>`.
3. Klikneš na naznačenou linku (řeka) nebo bod (vodní dílo).
4. Napíšeš název do políčka a potvrdíš.
5. Správná odpověď se zeleně popíše přímo do mapy, špatná nechá pole zatřást a jde zkusit znovu.
6. Nahoře se počítá skóre, dole je tlačítko na restart.

## Struktura projektu

```
├── index.html          # úvodní menu s výběrem kategorie
├── map.html            # samotná hra, řízená parametrem ?mode=
├── css/style.css        # sdílený vzhled
├── js/
│   ├── modes.js         # registr kategorií (název, datový soubor, texty)
│   └── map-core.js      # vykreslení mapy, klikání, vyhodnocení, skóre
└── data/
    ├── outline-cr.json  # obrys ČR + orientační města (sdíleno všemi režimy)
    ├── reky.json        # řeky jako linky (typ "path")
    └── vodni-dila.json  # přehrady/nádrže jako body (typ "point")
```

Obrys ČR i trasy řek vycházejí z reálných geografických dat (Natural Earth), promítnutých do souřadnic 760×460.

## Přidání nové kategorie (např. „Kraje“)

1. Vytvoř `data/kraje.json` ve stejném formátu jako `reky.json` nebo `vodni-dila.json`:
   ```json
   { "type": "path", "title": "Kraje", "items": [
     { "name": "Jihomoravský kraj", "points": [[x,y], [x,y], ...], "answers": ["jihomoravsky", "jihomoravskykraj"] }
   ]}
   ```
   Pro body (typ `"point"`) místo `"points"` použij `"point": [x, y]`.
2. Přidej záznam do `js/modes.js`:
   ```js
   "kraje": {
     title: "Kraje",
     dataFile: "data/kraje.json",
     prompt: "Jak se jmenuje tento kraj?",
   }
   ```
3. Přidej dlaždici do `index.html`.

Souřadnice (`points`/`point`, i obrys/města v `outline-cr.json`) jsou v souřadném systému SVG plátna 760×460 — nejjednodušší cesta k novým datům je promítnout GeoJSON (lon/lat) stejnou jednoduchou projekcí, jakou používá zbytek dat v `data/`.

## Nasazení na GitHub Pages

1. Nastavení repozitáře → **Pages** → Source: `Deploy from a branch`, větev `main`, složka `/ (root)`.
2. Po uložení se stránka objeví na `https://<ucet>.github.io/<nazev-repa>/`.

Žádný build krok není potřeba — GitHub Pages servíruje soubory přímo tak, jak jsou.
