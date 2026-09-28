/**
 * ============================================================
 * PROYECTO: Análisis multitemporal del NDVI en la subcuenca del río Hurtado
 * AUTOR: Martín Basualdo
 * FECHA: Septiembre 2026
 * REPOSITORIO: https://github.com/basualdoimportante-boop/analisis-rio-hurtado
 * 
 * DESCRIPCIÓN:
 * Script de análisis RESTREND (Análisis de Tendencias Residuales) para
 * separar la señal climática (precipitación) de la señal no climática
 * (riego o estrés hídrico) en la evolución de la vegetación.
 * 
 * PERÍODO: 2017, 2019, 2021, 2023, 2024 (enero-marzo)
 * DATOS: Sentinel-2 (NDVI) + CHIRPS (precipitación)
 * ============================================================
 */

// ============================================================
// 1. CARGAR LA SUBCUENCA
// ============================================================
var subcuenca = ee.FeatureCollection('projects/rio-hurtado-analysis/assets/subcuenca_hurtado');

// ============================================================
// 2. DEFINIR AÑOS Y PRECIPITACIÓN (datos de CHIRPS)
// ============================================================
var anios = [2017, 2019, 2021, 2023, 2024];
var precipitacion = [26.99, 10.78, 10.52, 14.06, 7.37];

// ============================================================
// 3. FUNCIÓN: ENMASCARAR NUBES CON LA BANDA SCL
// ============================================================
var enmascararSCL = function(imagen) {
  var scl = imagen.select('SCL');
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10)).and(scl.neq(11));
  return imagen.updateMask(mascara);
};

// ============================================================
// 4. FUNCIÓN: CALCULAR NDVI
// ============================================================
var calcularNDVI = function(imagen) {
  var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return imagen.addBands(ndvi);
};

// ============================================================
// 5. FUNCIÓN: PROCESAR CADA AÑO (compuesto mediano)
// ============================================================
var procesarAnio = function(anio) {
  var inicio = ee.Date.fromYMD(anio, 1, 1);
  var fin = ee.Date.fromYMD(anio, 3, 31);
  var coleccion = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(subcuenca)
    .filterDate(inicio, fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 25))
    .map(enmascararSCL)
    .map(calcularNDVI)
    .select('NDVI');
  return coleccion.median().clip(subcuenca).toFloat().set('anio', anio);
};

// ============================================================
// 6. GENERAR COMPUESTOS POR AÑO
// ============================================================
var compuestos = ee.ImageCollection(anios.map(procesarAnio));

// ============================================================
// 7. CREAR PARES (PRECIPITACIÓN, NDVI)
// ============================================================
var pares = anios.map(function(anio, i) {
  var precipImg = ee.Image.constant(precipitacion[i]).toFloat().rename('precip').clip(subcuenca);
  var ndviImg = ee.Image(compuestos.filter(ee.Filter.eq('anio', anio)).first())
    .select('NDVI').toFloat().rename('ndvi');
  return precipImg.addBands(ndviImg);
});

// ============================================================
// 8. AJUSTAR REGRESIÓN LINEAL POR PÍXEL
// ============================================================
var regresion = ee.ImageCollection(pares).reduce(ee.Reducer.linearFit());

// ============================================================
// 9. CALCULAR RESIDUO DE CADA AÑO
// ============================================================
var calcularResiduo = function(anio, i) {
  var ndvi = ee.Image(compuestos.filter(ee.Filter.eq('anio', anio)).first()).select('NDVI');
  var ndviPredicho = regresion.select('offset').add(regresion.select('scale').multiply(precipitacion[i]));
  return ndvi.subtract(ndviPredicho).rename('residuo').toFloat().set('anio', anio);
};

var coleccionResiduos = ee.ImageCollection(anios.map(calcularResiduo));

// ============================================================
// 10. CALCULAR RESIDUO MEDIO POR AÑO
// ============================================================
var medias = anios.map(function(anio) {
  var residuo = ee.Image(coleccionResiduos.filter(ee.Filter.eq('anio', anio)).first());
  var media = residuo.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: subcuenca.geometry(),
    scale: 100,
    maxPixels: 1e9
  });
  return ee.Feature(null, {
    'anio': anio,
    'residuo_medio': media.get('residuo')
  });
});

var estadisticasMedias = ee.FeatureCollection(medias);

// ============================================================
// 11. VISUALIZACIÓN EN EL MAPA
// ============================================================
Map.centerObject(subcuenca, 10);
Map.addLayer(subcuenca, {color: 'red'}, 'Subcuenca Río Hurtado');

anios.forEach(function(anio) {
  var residuo = ee.Image(coleccionResiduos.filter(ee.Filter.eq('anio', anio)).first());
  Map.addLayer(residuo, 
    {min: -0.3, max: 0.3, palette: ['red', 'white', 'green']}, 
    'Residuo ' + anio);
});

// ============================================================
// 12. IMPRIMIR RESULTADOS EN LA CONSOLA
// ============================================================
print('=== RESIDUO MEDIO POR AÑO ===');
print(estadisticasMedias);

// ============================================================
// 13. GRÁFICO DE EVOLUCIÓN TEMPORAL
// ============================================================
var chart = ui.Chart.feature.byFeature(estadisticasMedias, 'anio', ['residuo_medio'])
  .setChartType('LineChart')
  .setOptions({
    title: 'Evolución del residuo medio RESTREND (2017-2024)',
    hAxis: {title: 'Año'},
    vAxis: {title: 'Residuo medio'},
    colors: ['red']
  });

print('=== GRÁFICO DE EVOLUCIÓN ===');
print(chart);

// ============================================================
// FIN DEL SCRIPT
// ============================================================
