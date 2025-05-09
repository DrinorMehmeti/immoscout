# Projektstruktur Übersicht

```
src/
│
├── assets/              # Statische Dateien (Bilder, Icons, Logos)
├── components/          # Wiederverwendbare UI-Komponenten (Navbar, Footer, PropertyCard, etc.)
├── context/             # React Contexts (z.B. AuthContext)
├── data/                # Statische Daten, Mockdaten
├── layouts/             # Layout-Komponenten (z.B. DashboardLayout)
├── lib/                 # Hilfsfunktionen, API-Clients (z.B. supabase.ts)
├── pages/               # Seiten (jede Route eine Datei/Ordner: Dashboard, ListingsPage, Login, Register, etc.)
├── types/               # TypeScript-Typen und Interfaces
├── index.css            # Haupt-CSS (Tailwind)
├── main.tsx             # Einstiegspunkt React
└── App.tsx              # Haupt-App-Komponente (mit Routing)
```

## Ordner-Erklärung

- **assets/**: Bilder, Logos, statische Dateien für das Frontend.
- **components/**: Alle wiederverwendbaren UI-Bausteine, die in mehreren Seiten/Layouts genutzt werden.
- **context/**: Globale React Contexts, z.B. für Authentifizierung.
- **data/**: Statische Daten, z.B. Mockdaten für Entwicklung und Tests.
- **layouts/**: Layout-Komponenten, die das Grundgerüst für Seiten mit Sidebar, Header etc. liefern.
- **lib/**: Hilfsfunktionen, API-Clients, externe Service-Integrationen.
- **pages/**: Jede Seite, die einer Route entspricht (z.B. /dashboard, /login, /register, /listings).
- **types/**: Globale TypeScript-Typen und Schnittstellen.
- **index.css**: Globale Styles, Tailwind-Basis.
- **main.tsx**: Einstiegspunkt für die React-App.
- **App.tsx**: Hauptkomponente, enthält das Routing und ggf. globale Provider.

---

**Tipp:**
- Neue Features/Seiten immer in den passenden Ordner einsortieren.
- Komponenten, die nur in einer Seite gebraucht werden, können auch als Unterordner in `pages/` liegen.
- Für größere Features ggf. einen eigenen Unterordner anlegen. 