# XR im Browser

## Entwicklungsumgebung
1. Visual Studio Code
2. Bilbliotheken
3. vite (Packaging)





## Xtended Reality
1. Ergänzungen für XR
   - renderer
  
2. Steuerung
   - XR Button
   - Controller
   - Teleport
  


## Anforderungen an die Klassen

Ein Objekt/Licht wird über eine Klasse eingebunden.
Dabei wird es (vollständig?) konfiguriert. Es fügt sich von selbst in die Szene ein.
Wird das Objekt nicht eingebunden, dann gibt es im Programmablauf keine Fehler.







# Threejs Grundlagen

3-Dimensionalität wird zunehmend in Browser-Anwendungen eingesetzt. 3D-Objekte erweitern Browseranwendungen und Webseiten um vielfältige Möglichkeiten. So wird ein Möbels oder ein Kleidungsstück von allen Seiten zugänglich, eine illustrierte Landschaft kann auf einmal bereist werden. Ein Browser kann alle Inhalte vom Text, über Bild und Video bis zum 3D-Objekt nahtlos verarbeiten.

Die Javascript-Bibliothek Threejs ermöglicht das Erstellen bzw. Hinzufügen nahezu beliebiger 3D-Inhalte in HTML-Seiten. Threejs js nutzt dabei die WebGL-Fähigkeiten des Browsers. Es lassen sich einfache Objekte (Primitives) erzeugen oder komplexe Geometrien aus anderen Programmen importieren. Mit Tageslicht, Nebel, Himmel und Wasser lassen sich alle Szenarien beeindruckend umsetzen. Ebenso können gezielte Beleuchtungen sowie Kamerafahrten bzw. das Herumgehen des Betrachters um Objekte machen die Grundlagen des 3D-Welten-Bauens perfekt.

Mit Threejs können 3D-Welten und Objekte mit verhältnismäßig einfachen Mitteln realisiert werden. Dennoch ist eine "Welt" ungleich komplexer als Text- und Bildinhalte. Der Grundlagenkurs nimmt sich deshalb 5 Tage Zeit, um alle Grundlagen fundiert zu erläutern und in praktischen Beispielen auszuprobieren. Systematisch und praxistauglich werden alle Aspekte von threejs und dem Konstruieren und Zusammenfügen von 3D-Objekten und deren Iszenierungen durchgearbeitet. 




# Threejs 

## Entwicklungsumgebung
- Visual Studio Code
- Bibliotheken
- Browseranforderungen
- vite (Packaging)

## Javascript (falls erforderlich)
- Klassen und ES-Module
- Mit `fetch` arbeiten
- Hilfreiche Sprachkonstrukte aus ES6+

## Threejs Grundlagen
- Begriffe aus dem 3D
  - Geometrie, Material, Mesh
  - Textur, Shader, Maps
  - Koordinaten, Transformationen
  - Rendern, Raytracing, Shadowmap
  - ...
  
- Grundgerüst einer 3D Welt bauen
   - Aufbau einer Szene
   - Was ist ein Renderer
   - Objekte einfügen
   - Licht anschalten
   - Die Kamera setzen
   - Animationen einfügen

- Organisation mit Klassen
   - So gelingt die Programmierung
   - Testbarkeit, Wartbarkeit

- Steuerung (Maus)
   - OrbitControls: die Szene bewegen
   - WSAD/Cursortasten: FirstPersonControls - der Benutzer bewegt sich

- Geometrien
  - BoxGeometry, ConeGeometry, CylinderGeometry, SphereGeometry,
  - CapsuleGeometry, RingGeometry, TorusGeometry, TubeGeometry
  - PlaneGeometry, CircleGeometry, 
  - EdgesGeometry, WireframeGeometry 
  - ShapeGeometry, LatheGeometry, ExtrudeGeometry
  - TetrahedronGeometry, IcosahedronGeometry, OctahedronGeometry, DodecahedronGeometry, PolyhedronGeometry

   - Basis-Texturen
   - Modelle laden
   - Objekte generisch konstruieren


- Lichter
  - AmbientLight
  - DirectionalLight
  - HemisphereLight
  - PointLight
  - SpotLight

- Texturen
  - LineBasicMaterial
  - MeshBasicMaterial
  - MeshLambertMaterial
  - MeshNormalMaterial
  - MeshPhongMaterial
  - MeshStandardMaterial
  - MeshToonMaterial

- Landschaft, Welt
   - Himmel
   - Gelände
   - Nebel
   - Wasser

- Physik
  - Die Bibliothel `cannon`

- Koordinaten und Matemathik im Raum
  - Box2, Box3
  - Color
  - Cylindrical
  - Euler
  - Frustum
  - Interpolant
  - Line3
  - Matrix3, Matrix4
  - Plane
  - Ray
  - Sphere
  - Spherical, SphericalHarmonics3
  - Triangle
  - Quaternion
  - Vector2, Vector3, Vector4


# XR
## Grundlegendes
- XR Button einfügen
- Die Sache mit dem Standpunkt
- Debuggen mit den developer tools
## Renderer
- Ergänzungen für den Renderer
- animationFrame anpassen
## Steuerung
- Controller und Griffe hinzufügen
- Tasten abfragen
- Raycaster, Marker
- Objekte bewegen
- Teleportieren