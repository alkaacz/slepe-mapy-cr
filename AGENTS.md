# Pokyny pro AI agenty

Tento repozitář obsahuje interaktivní slepou mapu Česka. Zachovávejte jeho jednoduchý provoz bez backendu a respektujte stávající strukturu projektu.

## Pravidla práce

- Před změnou si přečtěte `README.md` a relevantní zdrojové soubory.
- Preferujte vlastní větev a změny předkládejte ke kontrole prostřednictvím pull requestu.
- Změny udržujte úzce zaměřené a nezasahujte do nesouvisejících souborů.
- Před commitem ověřte, že upravené JSON soubory jsou validní a odkazy na soubory odpovídají skutečné struktuře repozitáře.
- Nikdy neukládejte tokeny, hesla ani jiné citlivé údaje do repozitáře.
- Git historii používejte jako audit změn; již zveřejněné commity nepřepisujte.

## Autorství commitů vytvořených agentem

- Commit, jehož obsah vytvořil AI agent, musí mít pole **Author** nastavené tak, aby identifikovalo použitého agenta a model (např. `OpenClaw Codex (GPT-6) <noreply@openclaw.ai>`). Použijte `git commit --author="Jméno agenta (Model) <e-mail>"`.
- Pole **Committer** zůstává účtem člověka, který commit vytvořil a nese za něj odpovědnost. Nepřebírejte identitu člověka do pole Author.
- Toto pravidlo se vztahuje na nové commity vytvořené agentem; starší commity se zpětně nemění.
