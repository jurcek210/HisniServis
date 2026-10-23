---
config:
  theme: dark
---
erDiagram
    STANOVALEC {
        int id PK
        string ime
        string priimek
        string email
        string geslo
        string telefon
    }

    IZVAJALEC {
        int id PK
        string ime
        string priimek
        string email
        string geslo
        string telefon
        string specializacija
        string opis
        boolean aktiven
    }

    POPRAVILO {
        int id PK
        int stanovalec_id FK
        string naslov
        string kategorija
        string opis
        string fotografija
        string status
        datetime datum_objave
    }

    PONUDBA {
        int id PK
        int popravilo_id FK
        int izvajalec_id FK
        decimal cena
        string opis
        int predviden_cas
        datetime datum_oddaje
        string status
    }

    TERMIN {
        int id PK
        int ponudba_id FK
        datetime datum_ura
        string status
        string opomba
    }

    OCENA {
        int id PK
        int ponudba_id FK
        int ocena
        string komentar
        datetime datum
    }

    STANOVALEC ||--o{ POPRAVILO : "objavi"
    POPRAVILO ||--o{ PONUDBA : "prejme"
    IZVAJALEC ||--o{ PONUDBA : "odda"
    PONUDBA ||--o{ TERMIN : "ima"
    PONUDBA ||--o| OCENA : "je ocenjena"