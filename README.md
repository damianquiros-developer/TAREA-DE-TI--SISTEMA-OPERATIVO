# Vetro OS · Capri

Propuesta gráfica de un sistema operativo para la tarea de TI («Diseñen su sistema operativo ideal»).
La presentación es una página web estática: se abre `index.html` en el navegador.

## Partes

1. Identidad (logo, paleta, tipografía, formas, filosofía y fondo)
2. Inicio de sesión
3. Pantalla de reposo (con el resumen de quIA)
4. Escritorio (Dock con funciones de Windows, iconos tipo iPhone, barra de menú oculta)
5. Widgets (incluye el widget de Teams)
6. Centro de control (se despliega de derecha a izquierda)
7. Explorador de archivos (interfaz conversacional con quIA)
8. Configuración (estilo Windows + macOS, con la burbuja de quIA)
9. Terminal (estilo Kali Linux, con paneles gráficos e IA)

## Estructura

```
index.html              página de presentación (todas las pantallas)
assets/css/base.css     estilos de la página (portada, secciones, identidad)
assets/css/os.css       componentes del sistema (cristal líquido, Dock, barra de menú, widgets, centro de control)
assets/css/screens.css  estilos de cada pantalla
assets/js/main.js       escalado, animaciones de demostración y pequeñas interacciones
assets/img/             fondo «Tutto passa» y sus variantes, logo
```

Cada pantalla está diseñada sobre un lienzo de 1440 × 900 px y se escala al ancho disponible,
por eso se ve igual en un proyector, una laptop o un celular.

## Ver la página

- Local: abrir `index.html` (o servir la carpeta con cualquier servidor estático).
- GitHub Pages: *Settings → Pages → Deploy from a branch*, elegir esta rama y la carpeta `/ (root)`.

## Presentar

- Flechas ← → (o Re Pág / Av Pág) saltan entre partes.
- En el escritorio: llevar el cursor arriba muestra la barra de menú, el botón de la barra abre el
  Centro de control y el logo del Dock abre el menú Inicio. Al pasar el cursor por el Dock aparecen
  las vistas previas de ventanas.
