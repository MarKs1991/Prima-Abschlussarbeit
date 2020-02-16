# Prima
Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University


- [SKYWARD](https://MarKs1991.github.io/Prima-Abschlussarbeit/Skyward/Build)


## Checkliste für Leistungsnachweis
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU

| Nr | Bezeichnung           | Inhalt                                                                                                                                                                                                                                                                         |
|---:|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|    | Titel                 | Skyward
|    | Name                  | Markus Schürmann
|    | Matrikelnummer        | 256667
|  1 | Nutzerinteraktion     | Der Spieler kann mit A und D nach rechts den Spielcharakter nach links und rechts bewegen, mit der Leertaste oder W kann gesprungen werden, wird zum Höhepunkt des Sprunges oder später erneut die Leertaste betätigt kann ein Doppelsprung vollführt werden, dies kann wiederholt werden und ein Dreifachsprung ausgeführt werden, mit den linken Pfeiltaste kann die Kamera um 90 Grad im Urzeigersinn gedreht werden, mit der rechten Pfeiltaste kann die Kamera um 90 Grad gegen den Uhrzeigersinn gedreht werden.                                                                                                                                                 |
|  2 | Objektinteraktion     | Der Nutzer muss Münzen einsammelm um eine möglichst hohe Punktzahl zu erreichen. Diese sind mit Collidern ausgestattet. Die Münzen befinden sich auf jeder Platform. diese Platformen haben ebenfalls Collider um den Spieler am Fallen zu hindern. Um die Platformen zu erreichen muss der Spieler zwischen 4 verschieden Perspektiven wechseln welche verschiedene Ansichten und Abstände der Platformen offen legen. Jedes Mal wenn die Perspektive gewechselt wird ändern sich ebenfalls die Collder der Münzen und Platformen auf die in dem Moment relevanten Achsen. Die Kordinaten der inaktiven Achse wird für den nächsten Perspektivenwechsel in einem Array zwischengespeichert und bei erneuter Drehung wieder ausgelesen. Die Inaktive Achse zeigt immer zur Kamera und alle Nodes bekommen auf dieser Achse den Wert 0 solange sie inaktiv ist.Weitere Details im unter Maße und Positionen. Eine Platform die aus einer Perspektive unerreichbar erscheint kann aus einer anderen in Sprungreichweite sein.                                                                                                                                                                                 |
|  3 | Objektanzahl variabel | Die Platformen werden bei Programmstart zufällig generiert. Dabei bleibt allerdings sicher gestellt das die nächstliegenste Platform immer durch mindestens eine Perspektive erreichbar bleibt. Zur Laufzeit fliegen Flugzeuge auf Höhe der Platformen auf der X-Achse von Rechts nach links oder von Links nach Rechts je nach aktueller Perspektive. Jedes Mal wenn die Flugzeuge die Szene verlassen tauchen sie an auf Höhe einer zufallig gewählten Platform wieder auf.                                                                                                                                                      |
|  4 | Szenenhierarchie      | Die Szenenhirachie ist unterteilt unter einer Game Parent Node. Ab hier spalten sich Camera, Gomez(der Spielcharakter), Level, Collectables, und Enemys Nodes ab. Camera rotiert und hat ein Child CamZoom was für die Translation vom 0 Punkt auf eine Distanz von 30 zuständig ist, an CamZoom hängt dann die eigentliche CameraComponent. Gomez (Spielcharakter) hat keine weiteren Children, unter Level befinden sich alle Platformen(Floor), Collectable hat alle zum Zeitpunkt exestierenden Coins als Children, Enemys hat die Flugzeuge(Planes) als Children.                                                                                                                                                          |
|  5 | Sound                 | Es sind Sounds für ein Sprungfeedback und für den Perspektivenwechsel eingebunden. Zudem sorgt der Soundtrack vom inspierten IndieSpiel FEZ für die musikikalische Hintergrundbemalung.                                                            |
|  6 | GUI                   | Ein GUI an der oberern Bildschirmkante teilt dem Spieler mit wieviel Leben er noch hat, wieviel Münzen er bereits gesammelt hat und ob die Spielmusik an oder aus ist. An der unteren Bildschirmkante kann der Spieler die Steuerung einsehen.                                                                                   |
|  7 | Externe Daten         | In einer JSON Datei sind 3 Parameter hinterlegt: Die Anzahl der zu genenierenden Platformen im Level, der Garantierte Hochstabstand auf zumindest einer Achse von 2 Platformen und die Anzahl der Startleben. Änderungen in der JSON Datei verändern dadurch auch die Anordung und Größe des Levels und damit auch den Schwierigkeitsgrad zu gewissem Masse.                                                                                   |
|  8 | Verhaltensklassen     | Die Klasse Game (aus der Main aufgerufen) baut den Grossteil des Level durch Aufruf der weiteren Verhaltensklassen auf. Die Klasse Gomez beinhaltet das Charakterverhalten bezüglich Sprites für Bewegung und Idle, das Sprungverhalten, Checks für die KillBorder und des Respawns, und die CollisionChecks mit den Verschiedenen Collidern der Klassen Floor Coin und Planes. Floor, Planes und Coin haben alle die getRectWorld Metode welche von der Klasse Gomez für die Collsion Checks benutzt wird. Skybox ist simpel aufgebaut und lad lediglich die Sprites für die Skybox und dessen Mesh. Die Klasse Sound beinhält das Soundverhalten und wird der Klasse Gomez beim springen und einsammeln von Münzen aufgerufen. Control ist für Keyboard Commandszustädig, Camera führt Transformationen für die Perspektivenwechsel aus, und SpriteGenerator macht genau was sein Name impliziert.                                                                                             |
|  9 | Subklassen            | Floor, Coin und Planes erben von Hitbox da alle 3 Objekte eine rechteckige Hitbox besitzten welche von der Klasse Gomez abgefragt wird|
| 10 | Maße & Positionen     | Die Kamera ist 30 Einheiten vom Spielcharakter entfernt um dem Nutzer die nötige Weitsicht zu geben. Die Platformen auf denen sich der Spieler bewegt sind 3mal so gross wie der Spieler was aussreichend ist Die Flugzeuge sind klein gehalten um dem Spieler die Chance zu geben über sie hinweg zu springen. Die Platformen sind scheinen auf dem ersten Blick weit weg von dem Charakter zu erscheinen mit klugen Wechsel der Perspektive wird es möglich diese zu erreichen. Das wechseln der Perspektive um die Platformen zu erreichen ist der Kernaspekt des Spiels. Bei jedem Perspektivenwechsel ändern sich auch die Collider und die Achse die momentan in Richtung der Kamera zeigt wird bei allen objekten inder Szene mit Ausnahme der Kamera auf Null gesetzt. Dies hat den Sinn dass der Spieler die Position der Platformen und Münzen korrekt erkennen kann. Würde diese Transformation nicht durchgeführt können in den meisten Fallen die Position der Platformen und viel wichtiger die Collider nicht vom Spieler eingeschätzt werden weil die Kamera ortografisch arbeitet.                                                                |
| 11 | Event-System          | Das Event-System wird verwendet um Tastaturbefehle für die Bewegung auszuführen und die Perspektivenwechsel der Kamera auszuführen, die Music kann über eine weiteres KeyboardEvent ein und ausgeschaltet werden. Ansonsten werden Events noch für die Bewegung von Spieler und Flugzeugen benutzt.                                                                                                                                                                                    |

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
