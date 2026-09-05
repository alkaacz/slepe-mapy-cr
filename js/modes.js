// Registr dostupných režimů slepé mapy.
// Přidání nové kategorie = nový záznam sem + odpovídající JSON soubor v data/.
const MODES = {
  "reky": {
    title: "Řeky",
    dataFile: "data/reky.json",
    itemLabelRiver: "řeku",
    prompt: "Jak se jmenuje tato řeka?",
  },
  "vodni-dila": {
    title: "Vodní díla",
    dataFile: "data/vodni-dila.json",
    itemLabelRiver: "vodní dílo",
    prompt: "Jak se jmenuje toto vodní dílo?",
  },
  "mesta-kraje": {
    title: "Města — krajská",
    dataFile: "data/mesta-kraje.json",
    itemLabelRiver: "město",
    prompt: "Jak se jmenuje toto město?",
  },
  "mesta-okresy": {
    title: "Města — okresní",
    dataFile: "data/mesta-okresy.json",
    itemLabelRiver: "město",
    prompt: "Jak se jmenuje toto město?",
  },
};

const MODE_ORDER = ["reky", "vodni-dila", "mesta-kraje", "mesta-okresy"];
