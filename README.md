# analisis-rio-hurtado
Análisis multitemporal del NDVI en la subcuenca del río Hurtado (2017-2024) usando Sentinel-2, Google Earth Engine y RESTREND.
# Análisis multitemporal del NDVI en la subcuenca del río Hurtado (2017-2024)

Evaluación del impacto de la megasequía mediante Sentinel-2, Google Earth Engine y el método RESTREND.

---

## Descripción

Este proyecto analiza el impacto de la megasequía en la cobertura vegetal de la subcuenca del río Hurtado, en la provincia de Limarí (Región de Coquimbo, Chile), entre los años 2017 y 2024. Utiliza imágenes satelitales Sentinel-2 procesadas en Google Earth Engine para calcular el índice de vegetación NDVI, y datos de precipitación CHIRPS para implementar el método RESTREND (Análisis de Tendencias Residuales). El objetivo es separar la señal climática (precipitación) de la señal no climática (riego o estrés hídrico) en la evolución de la vegetación.

---

## Contexto

La cuenca del Limarí es uno de los polos agrícolas más relevantes del Norte Chico de Chile. Sustenta a más de 118.000 habitantes y concentra las mayores extensiones de mandarinas y uva de mesa del país. El consumo agrícola representa el 95,8% de la demanda de agua total en la cuenca.

La megasequía que afecta a Chile central desde aproximadamente 2010 ha tenido impactos documentados:

- En 2015, más del 72% de las hectáreas bajo riego en la provincia de Limarí no pudieron ser regadas.
- En 2024, la provincia fue declarada oficialmente zona de escasez hídrica mediante el Decreto MOP N°87.
- En los últimos cinco años se han perdido al menos 10.000 hectáreas bajo riego.
- El embalse La Paloma pasó de distribuir 240 millones de m³ anuales a solo 28 millones en 2024.

---

## Objetivos

### Objetivo general

Cuantificar el impacto de la megasequía en la cobertura vegetal de la subcuenca del río Hurtado (2017-2024), diferenciando entre la señal climática (precipitación) y la señal no climática (riego o estrés hídrico), mediante el análisis multitemporal del NDVI y el método RESTREND.

### Objetivos específicos

1. Calcular el NDVI para la estación de verano (enero-marzo) de los años 2017, 2019, 2021, 2023 y 2024, aplicando máscara de nubes con la banda SCL.
2. Construir un modelo de regresión lineal entre el NDVI y la precipitación acumulada para el período de estudio.
3. Calcular el residuo (NDVI observado - NDVI predicho) para cada año, identificando zonas de riego (residuo positivo) y estrés hídrico (residuo negativo).
4. Comparar la evolución de los residuos entre 2017 y 2024 para evaluar si la señal no climática se ha intensificado con la megasequía.
5. Publicar el análisis completo en un repositorio de GitHub con documentación reproducible.

---

## Área de estudio

La subcuenca del río Hurtado se ubica en la zona sur-oriental de la cuenca del río Limarí, Región de Coquimbo, Chile. Tiene una superficie aproximada de 2.425 km² y presenta un clima semiárido con influencia de estepa fría de montaña en las zonas altas.

Características relevantes:

- La cabecera de la subcuenca alberga glaciares blancos.
- La zona baja sostiene agricultura de riego (paltos, mandarinas, nogales).
- La estación fluviométrica "Río Hurtado en San Agustín" (código DGA 04502005) registra caudales con régimen natural.
- Precipitación media anual: ~72,4 mm.
- Caudal promedio histórico: ~1,8 m³/s.
- Caudal ecológico mínimo: 0,28 m³/s.  

Interpretación:

- Residuo positivo: más verdor del esperado por la lluvia (riego).
- Residuo negativo: menos verdor del esperado (estrés hídrico).

---

## Resultados

### Precipitación acumulada (octubre-marzo)

| Año | Precipitación (mm) |
|---|---|
| 2017 | 26,99 |
| 2019 | 10,78 |
| 2021 | 10,52 |
| 2023 | 14,06 |
| 2024 | 7,37 |

### Residuos RESTREND por año

| Año | Residuo medio |
|---|---|
| 2017 | -0,0044 |
| 2019 | +0,0050 |
| 2021 | -0,0044 |
| 2023 | +0,0125 |
| 2024 | -0,0087 |

### Hallazgo principal

El análisis RESTREND con 5 años de datos **no muestra una tendencia clara ni consistente**. Los residuos alternan entre valores negativos y positivos (negativo, positivo, negativo, positivo, negativo), un patrón que **no corresponde a una señal ecológica real**, sino a un **artefacto estadístico conocido como sobreajuste**.

**Explicación del sobreajuste:** Con solo 5 puntos de datos, la regresión lineal se ajusta tan estrechamente a las observaciones disponibles que empieza a capturar el ruido en lugar de la señal. La línea de regresión "pasa por todos los puntos", dejando residuos que oscilan artificialmente. La literatura científica recomienda un mínimo de 30 puntos para análisis de tendencias robustos (NOAA), y RESTREND fue diseñado para series de 15 a 30 años.

**Comparación de los años extremos:** Si se comparan únicamente los años extremos (2017, el más húmedo, y 2024, el más seco), ambos residuos son negativos (-0,0044 y -0,0087 respectivamente), lo que sugiere que **en 2024 hay menos verdor del que la lluvia justifica**, en comparación con 2017. Esta observación puntual es coherente con la megasequía, pero **no constituye una tendencia estadística**.

### Interpretación

El resultado más honesto es que **el análisis RESTREND no es concluyente con solo 5 años de datos**. El patrón alternante de los residuos sugiere que el modelo está sobreajustado, y las conclusiones deben limitarse a la observación comparativa entre los años extremos. Para un análisis robusto, se requiere una serie temporal de al menos 15 años, lo cual no fue posible porque Sentinel-2 solo está disponible desde 2015 y los datos de precipitación de la DGA dejaron de reportarse después de 2020.
---

## Limitaciones

1. **Baja potencia estadística (limitación principal):** Solo se dispone de 5 puntos de datos (2017, 2019, 2021, 2023, 2024) para ajustar la regresión. El patrón alternante de los residuos sugiere sobreajuste. Los resultados deben interpretarse como una caracterización exploratoria, no como una predicción robusta ni una tendencia estadística.

2. **Falta de validación con datos terrestres:** Las estaciones de la DGA en la cuenca del Limarí dejaron de reportar datos después de 2020, lo que impidió validar CHIRPS con mediciones en terreno para los años 2021-2024.

3. **Resolución espacial de CHIRPS:** La resolución de ~5,5 km es más gruesa que la de Sentinel-2 (10-20 m), lo que puede introducir diferencias en la representación espacial de la precipitación. Además, se ha documentado que CHIRPS **sobreestima la precipitación en el norte árido de Chile**.

4. **El NDVI es un proxy:** No mide directamente la disponibilidad hídrica. Un cultivo puede estar verde por riego tecnificado, aunque el río esté seco.

5. **Relación lineal asumida:** RESTREND asume una relación lineal entre NDVI y precipitación. En zonas semiáridas, la respuesta de la vegetación a la lluvia puede ser no lineal.

6. **Serie temporal corta:** Sentinel-2 comenzó a operar en 2015, lo que limita la serie a un máximo de ~10 años. RESTREND requiere series más largas para ser robusto.

---

## Trabajo futuro

- **Extender la serie temporal** usando Landsat (disponible desde 1984) como fuente alternativa o complementaria.
- Incorporar datos de niveles de agua subterránea de pozos DGA para correlacionar con los residuos.
- Analizar específicamente la vegetación riparia del cauce del río Hurtado.
- Comparar Sentinel-2 con satélites chinos (Jilin-1, Gaofen).
- Migrar el análisis a Python (Google Colab + VS Code) para portafolio profesional.
- Incorporar datos de evapotranspiración (MODIS MOD16A2) para calcular la brecha hídrica completa.
- Aplicar métodos estadísticos más robustos para series cortas (por ejemplo, bootstrap o análisis de tendencias con corrección de sesgo).

---

## Herramientas utilizadas

- **Google Earth Engine:** Procesamiento satelital en la nube.
- **QGIS:** Gestión y exportación de datos vectoriales.
- **Sentinel-2:** Imágenes satelitales (Programa Copernicus, ESA).
- **CHIRPS:** Datos de precipitación satelital.
- **JavaScript API de Earth Engine:** Código de procesamiento satelital.

---

## Autor

Martín Basualdo
GitHub: [basualdoimportante-boop](https://github.com/basualdoimportante-boop)

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
