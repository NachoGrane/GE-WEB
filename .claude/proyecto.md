<!--
  Ubicacion: <raiz-del-repo>/.claude/proyecto.md
  Este archivo SI va commiteado. Es la unica parte que cambia entre proyectos.
  Los comandos /commit y /mr lo leen automaticamente.
-->

# Convenciones de este proyecto

## Identificación

- **Nombre del sistema:** GE PAGE
- **Rama base:** `main`
- **Raíz de los bundles:** `src/`

## Áreas

El área es un **concepto del proyecto**, no una carpeta. Es el título de bloque que el
cliente ve en el changelog. Un mismo bundle puede aportar ítems a varias áreas, y una
misma área puede recibir ítems de varios bundles.

### Precedencia para asignar el área

Se evalúa en este orden y se corta en la primera que aplica:

**1. Área transversal.** Si el ítem es *sobre* uno de estos temas, va acá sin importar en
qué bundle esté el código:

| Área | Cuándo |
|---|---|
| Seguridad | roles, permisos, voters, firewall, accesos |
| API | endpoints, serializers, tokens, contratos con terceros |
| Notificaciones | mails, avisos, notificación flotante |
| Integraciones | servicios externos, importaciones, exportaciones |
| Rendimiento | consultas, cachés, tiempos de carga |

**2. Módulo funcional dentro del bundle.** Si el bundle contiene más de un módulo, gana
el módulo. Este es el caso de `ReleaseBundle`, que tiene Releases y API adentro y son
dos áreas distintas a nivel proyecto.

**3. Bundle.** El default, cuando no aplicó ninguna de las dos anteriores.

### Tabla bundle → área

| Bundle | Área por defecto |
|---|---|
| `ReleaseBundle` | Releases |
| `ReportesBundle` | Reportes |
| `TareaBundle` | Tareas |
| `TituloBundle` | Títulos |
| _(completar)_ | |

<!--
  PENDIENTE: agregá una fila por bundle de src/NOE/.
  Para verlos:  Get-ChildItem src\NOE -Directory | Select-Object Name
-->

### Módulos dentro de un bundle

| Bundle / subcarpeta | Área |
|---|---|
| `ReleaseBundle/Controller/Api*`, `ReleaseBundle/Api/` | API |
| `<Bundle>/Controller/Alumno*` | Alumno |
| `<Bundle>/Controller/Ingreso*` | Ingreso |
| `<Bundle>/Controller/Legajo*` | Legajo |
| `<Bundle>/Controller/Equivalencia*` | Equivalencias |
| _(completar)_ | |

### Reglas

- Un ítem va a **una sola** área. No se duplica.
- Si un ítem no encaja limpio en ninguna, el comando debe avisarlo y proponer el área
  nueva. No lo fuerce al bundle por descarte.
- En el `<área>` del mensaje de commit va la versión corta, minúscula y sin acentos:
  `seguridad`, `api`, `releases`, `alumno`, `legajo`, `equivalencias`, `reportes`.

## Voz de los ítems

Verbo primero, tercera persona del singular. El sujeto implícito es el cambio.

`Agrega`, `Crea`, `Migra`, `Reabre`, `Detecta`, `Muestra`, `Permite`, `Valida`,
`Filtra`, `Corrige`, `Reemplaza`, `Quita`, `Renombra`, `Mueve`, `Unifica`.

Nunca `se agregó`, `agregamos`, `agregué`, ni `ahora podés`.

## Vocabulario del dominio

Usá siempre el mismo nombre para la misma cosa, en commits y en el MR. Esto permite que
`/mr` agrupe sin inventar mejoras duplicadas.

| Decí | No digas |
|---|---|
| cambio de plan | migración de alumno, traspaso de carrera |
| alta manual | carga manual, ingreso manual |
| documentos compartidos | docs duplicados, legajo cruzado |
| legajo | expediente, carpeta |
| show del alumno | ficha, detalle, perfil |

## Convenciones técnicas del proyecto

Cosas que el commit no debe contradecir:

- No se usan clases `Model/`. El hilo del proyecto es entity / type / controller /
  manager / twig / js. Los catálogos van en el manager correspondiente.
- Los permisos se nombran `ROLE_<MODULO>_<ACCION>`.

## Tipos que van a release

`feat` y `perf` → Feature. `fix` y `hotfix` → Fix.
`refactor`, `chore`, `docs` y `test` no se publican al cliente.
