# Pokyny pro AI agenty

Tento repozitář obsahuje interaktivní slepou mapu Česka. Zachovávejte jeho jednoduchý provoz bez backendu a respektujte stávající strukturu projektu.

## Pravidla práce

- Před změnou si přečtěte `README.md` a relevantní zdrojové soubory.
- Uživatel určuje zadání; agent provede cílenou změnu a popíše její rozsah i případné neověřené předpoklady.
- Pokud na návrhu spolupracuje více agentů, jiný agent návrh nezávisle připomínkuje před předložením ke schválení.
- Pracujte ve vlastní větvi a změny do `main` předkládejte prostřednictvím pull requestu. Sloučení pull requestu do `main` vyžaduje schválení člověkem.
- Změny udržujte úzce zaměřené a nezasahujte do nesouvisejících souborů.
- Preferujte nejmenší potřebná oprávnění a přístup pouze pro čtení, pokud stačí; neprovádějte nevratné ani externí akce bez výslovného schválení člověkem.
- Před commitem ověřte, že upravené JSON soubory jsou validní a odkazy na soubory odpovídají skutečné struktuře repozitáře.
- Nikdy neukládejte tokeny, hesla ani jiné citlivé údaje do repozitáře.
- Git historii používejte jako audit změn; již zveřejněné commity nepřepisujte.

## Autorství commitů vytvořených agentem

- Commit, jehož obsah vytvořil AI agent, musí mít pole **Author** nastavené tak, aby identifikovalo použitého agenta a model (např. `OpenClaw Codex (GPT-6) <noreply@openclaw.ai>`). Použijte `git commit --author="Jméno agenta (Model) <e-mail>"`.
- Pole **Committer** zůstává účtem člověka, který commit vytvořil a nese za něj odpovědnost. Nepřebírejte identitu člověka do pole Author.
- Toto pravidlo se vztahuje na nové commity vytvořené agentem; starší commity se zpětně nemění.
