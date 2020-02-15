# Prima
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University

[Pages-Version](https://jirkadelloro.github.io/Prima/)

- [PONG](https://jirkadelloro.github.io/Prima/L06_PongFinal/Main.html)
- [CRAFTRIS](https://jirkadelloro.github.io/Prima/L13_Craftris)


## Checkliste für Leistungsnachweis
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 |
|    | Name                  |
|    | Matrikelnummer        |
|  1 | Nutzerinteraktion     | Der Nutzer kann mit der Applikation interagieren. Mit welchen Mitteln und welchen Aktionen werden welche Reaktionen ausgelöst? |
|  2 | Objektinteraktion     | Der Nutzer muss Münzen einsammelm um eine möglichst hohe Punktzahl zu erreichen. Um die Platformen zu erreichen muss der Spieler zwischen 4 verschieden Perspektiven wechseln welche verschiedene Ansichten und Abstände der Platformen offen legen. Eine Platform die aus einer Perspektive unerreichbar erscheint kann aus einer anderen in Sprungreichweite sein.       |
|  3 | Objektanzahl variabel | Die Platformen werden zur Laufzeit zufällig generiert. Dabei bleibt allerdings sicher gestellt das die nächstliegenste Platform immer durch mindestens eine Perspektive erreichbar bleibt. 
                             |
|  4 | Szenenhierarchie      | Die Szenenhirachie ist unterteilt unter einer Game Parent. Ab hier spalten sich Camera, Charakter, Level, Collectables ab. Weitere Details einfügen. 
|
|  5 | Sound                 | Es sind Sounds für ein Sprungfeedback und für den Perspektivenwechsel eingebunden. Zudem sorgt der Soundtrack vom inspiererten IndieSpiel FEZ für die musikikalische Hintergrundbemalung. 
|
|  6 | GUI                   | Ein GUI an der oberern Bildschirmkante teilt dem Spieler mit wieviel Leben er noch hat, wieviel Münzen er bereits gesammelt hat und ob die Spielmusik an oder aus ist. An der unteren Bildschirmkante kann der Spieler die Steuerung einsehen.  
|
|  7 | Externe Daten         | In einer JSON Datei sind 3 Parameter hinterlegt: Die Anzahl der zu genenierenden Platformen im Level, der Garantierte Hochstabstand auf zumindest einer Achse von 2 Platformen und die Anzahl der Startleben. 
|
|  8 | Verhaltensklassen     | Das Verhalten von Objekten ist in den Methoden von Klassen definiert, die in externen Dateien abgelegt sind. Welche Klassen sind dies und welches Verhalten wird dort beschrieben? 
|
|  9 | Subklassen            | Es existiert eine Klassenhierarchie, einige Objekte sind Instanzen von einer oder mehreren abgeleiteten Subklassen mit gegenüber den anderen Objekten speziellem Verhalten und besonderen Eigenschaften. Welche Klassen sind dies und welches Verhalten wird dort beschrieben? 
|
| 10 | Maße & Positionen     | Die Kamera ist weit vom Spielcharakter entfernt um dem Nutzer die nötige weitsicht zu geben. Bei jedem Perspektivenwechsel ändern sich auch die Collider und die Achse die momentan in Richtung der Kamera zeigt wird bei allen objekten inder Szene mit Ausnahme der Kamera auf Null gesetzt. Dies hat den Sinn dass der Spieler die Position der Platformen und Münzen korrekt erkennen kann da sich sonst durch eine optische Täuschung die Sprites an einer Anderen Position erscheinen würden als der Collider es vorgibt. |
| 11 | Event-System          | Das Event-System wird verwendet. Wer sendet wem Informationen oder Methodenaufrufe und wofür? 
|

## Abgabeformat
* Fasse die Konzeption als ein wohlformatiertes Designdokument in PDF zusammen!
* Platziere einen Link in der Readme-Datei deines PRIMA-Repositories auf Github auf die fertige und in Github-Pages lauffähige Anwendung.
* Platziere ebenso Links zu den Stellen in deinem Repository, an denen der Quellcode und das Designdokument zu finden sind.
* Stelle zudem auf diese Art dort auch ein gepacktes Archiv zur Verfügung, welches folgende Daten enthält
  * Das Designdokument 
  * Die Projektordner inklusive aller erforderlichen Dateien, also auch Bild- und Audiodaten
  * Eine kurze Anleitung zur Installation der Anwendung unter Berücksichtigung erforderlicher Dienste (z.B. Heroku, MongoDB etc.) 
  * Eine kurze Anleitung zur Interaktion mit der Anwendung

## GameZone
Wenn Du dein Spiel bei der Dauerausstellung "GameZone" am Tag der Medien sehen möchtest, ergänze folgendes  
* Einen Ordner mit zwei Screenshots der laufenden Applikation in den Größen 250x100 und 1920x400 pixel sowie ein Textdokument mit den Informationen:
* Titel
* Autor
* Jahr und Semester der Entwicklung (Sose, Wise)
* Studiensemester
* Lehrplansemester
* Studiengang
* Veranstaltung im Rahmen derer die Entwicklung durchgeführt wurde
* betreuender Dozent
* Genre des Spiels
* ggf. passende Tags/ Schlagwörter zu dem Spiel
* Untertitel (max 40 Zeichen), der Menschen zum Spielen animiert
* Kurzbeschreibung (max 250 Zeichen), die kurz erklärt wie zu spielen ist
* Erklärung, dass die Fakultät Digitale Medien die Anwendung bei Veranstaltungen, insbesondere am Tag der Medien, mit einem expliziten Verweis auf den Autor, vorführen darf.
