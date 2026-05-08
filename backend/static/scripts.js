

  const map = L.map('map').setView([-12.0464, -77.0428], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);

  const $fechaDesde = $('#fechaDesde');
  const $fechaHasta = $('#fechaHasta');
  const $filtroDepartamento = $('#filtroDepartamento');

  let modoFecha = 'slider';

  const capas = {};
  const overlays = {};

  $fechaDesde.on('change', () => {
    const desde = $fechaDesde.val();
    if (!desde) {
      $fechaHasta.val('').removeAttr('min');
      $fechaHasta.prop('disabled', true);
      $fechaHasta.attr('aria-disabled', 'true');
      return;
    }
    $fechaHasta.attr('min', desde);
    $fechaHasta.prop('disabled', false);
    $fechaHasta.attr('aria-disabled', 'false');
    const hasta = $fechaHasta.val();
    if (hasta && hasta < desde) {
      $fechaHasta.val(desde);
    }
  });

  $filtroDepartamento.on('change', () => {
    const { inicio, fin } = rangoFechasParaSismos();
    cargarSismosAlMapa(inicio, fin);
  });

  const reglasMagnitud = [
    { min: 6, categoria: 'alta', color: 'red', radio: 8, descripcion: 'Alta (≥ 6)' },
    { min: 4.5, categoria: 'media', color: 'orange', radio: 6, descripcion: 'Media (≥ 4.5)' },
    { min: 0, categoria: 'baja', color: 'green', radio: 4, descripcion: 'Baja (≥ 0)' },
  ];

  const reglasIntensidad = [
    { color:'blue', descripcion: 'Baja intensidad'},
    { color:'green', descripcion: 'Media intensidad'},
    { color:'yellow', descripcion: 'Alta intensidad'},
    { color:'red', descripcion: 'Muy alta intensidad'},
  ];

  reglasMagnitud.forEach((r) => {
    capas[r.categoria] = L.layerGroup();
  }); // Es dinámico
  reglasMagnitud.forEach((r) => {
    overlays['Magnitud ' + r.categoria] = capas[r.categoria];
  });

  const heatLayer = L.heatLayer([], {
    radius: 20,
    blur: 18,
    minOpacity: 0.18,
    maxZoom: 9,
  }).addTo(map);
  overlays['Mapa de calor (magnitud)'] = heatLayer;

  const layersControl = L.control.layers(null, overlays).addTo(map);

  const ZOOM_MIN_MARKERS = 7;
  const LIMITE_POR_MARKERS = 500;
  let lastHeatPoints = [];
  let lastMarkersCount = 0;
  let lastHeatPointsCount = 0;
  let totalSismos = 0;
  let limiteHeatPoints = 0;

  (function aplicarVistaModoFecha() {
    const $btn = $('#btnCambiarModoFecha');
    if (modoFecha === 'slider') {
      $('#panelFiltroAnios').show();
      $('#panelFiltroManual').hide();
      $btn.text('Usar rango manual de fechas');
    } else {
      $('#panelFiltroAnios').hide();
      $('#panelFiltroManual').show();
      $btn.text('Usar rango por años (slider)');
    }
  })();

  (function cargarOpcionesDepartamento() {
    return fetch('/api/departamentos')
      .then((res) => res.json())
      .then((departamentos) => {
        $filtroDepartamento.empty();
        $filtroDepartamento.append($('<option></option>').val('').text('TODOS'));
        departamentos.forEach((dep) => {
          $filtroDepartamento.append($('<option></option>').val(dep.id).text(dep.nombre));
        });
      });
  })();

  (function cargarCapaLimitesDepartamentos(mapInstance, capaControl) {
    return fetch('/static/departamentos.geojson')
      .then((res) => res.json())
      .then((geojson) => {
        const deptStyle = {
          color: '#1e40af',
          weight: 1,
          opacity: 0.75,
          fillColor: '#3b82f6',
          fillOpacity: 0.06,
        };
        const departamentosGeo = L.geoJSON(geojson, {
          style: () => deptStyle,
          onEachFeature: function (feature, lyr) {
            const nombre = feature.properties && feature.properties.nombre;
            lyr.on('click', function () {
              if (!nombre) return;
              const { inicio, fin } = rangoFechasParaSismos();
              $filtroDepartamento.find('option').each(function () {
                if ($(this).text() === nombre) {
                  $filtroDepartamento.val($(this).val());
                  return false;
                }
              });
              cargarSismosAlMapa(inicio, fin, nombre);
            });
            lyr.on('mouseover', function () {
              this.setStyle({ weight: 3, color: '#000' });
            });
            lyr.on('mouseout', function () {
              this.setStyle({ weight: 1, color: '#1e40af' });
            });
          },
        }).addTo(mapInstance);
        capaControl.addOverlay(departamentosGeo, 'Departamentos');
      })
      .catch((error) => {
        console.error('Error al cargar los limites departamentales', error);
        alert('No se pudieron cargar los límites departamentales');
      })
      .finally(() => {
        $('#mapDeptGeoLoading').hide();
      });
  })(map, layersControl);

  function legendHtml(usarMarkers) {
    if (usarMarkers){
      return `
        <div class="legend-title">Magnitud</div>
        ${ reglasMagnitud.map((r) => `<div class="legend-item"> <span class="legend-swatch" style="background:${r.color}"></span>${r.descripcion}</div>`).join('') }
        <hr style="margin:8px 0;opacity:.35;">
        <div style="font-weight:600;color:#111827;">
          📍 Marcadores
        </div> `;
    }else{
      return ` 
        <div class="legend-title">Intensidad</div>
        ${ reglasIntensidad.map((r) => `<div class="legend-item"> <span class="legend-swatch" style="background:${r.color}"></span>${r.descripcion}</div>`).join('') }
        <hr style="margin:8px 0;opacity:.35;">
        <div style="font-weight:600;color:#111827;">
          🔥 Mapa de calor 
        </div> `;
    }
  }

  function crearLegendControl() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = legendHtml(map.getZoom() >= ZOOM_MIN_MARKERS);
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      return div;
    };
    legend.addTo(map);
    return legend;
  }

  function actualizarLegend(usarMarkers) {
    if (!legendContainer) return;
    legendContainer.innerHTML = legendHtml(usarMarkers);
  }

  const legendControl = crearLegendControl();
  const legendContainer = legendControl.getContainer();

  function getInfoMagnitud(magnitud) {
    return reglasMagnitud.find((r) => magnitud >= r.min) || { categoria: 'ninguna', color: 'gray' };
  }

  function syncCapasPorZoom() {
    const z = map.getZoom();
    const usarMarkers = z >= ZOOM_MIN_MARKERS;

    if (usarMarkers) {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
      reglasMagnitud.forEach((r) => {
        const layer = capas[r.categoria];
        if (layer && !map.hasLayer(layer)) {
          map.addLayer(layer);
        }
      });
    } else { // usar heatmap
      reglasMagnitud.forEach((r) => {
        const layer = capas[r.categoria];
        if (layer && map.hasLayer(layer)) map.removeLayer(layer);
      });
      if (!map.hasLayer(heatLayer)) {
        map.addLayer(heatLayer);
      }
      if (heatLayer._map) {
        heatLayer.setLatLngs(lastHeatPoints);
      }
    }

    actualizarCantidadResultados(usarMarkers);
    actualizarLegend(usarMarkers);
  }

  map.on('zoomend', syncCapasPorZoom);

  function actualizarCantidadResultados(usarMarkers){
    /*console.log("totalSismos: ", totalSismos);
    console.log("limiteHeatPoints: ", limiteHeatPoints);
    console.log("lastHeatPointsCount: ", lastHeatPointsCount);
    console.log("lastMarkersCount: ", lastMarkersCount);*/

    if (usarMarkers) {
      if(totalSismos > LIMITE_POR_MARKERS){

        $('#info-resultados').text(`📍 Mostrando ${lastMarkersCount} marcadores de ${totalSismos} sismos.`);

      }else{

        if(totalSismos === 0){
          $('#info-resultados').text(`📍 No hubo ningún sismo.`);
        } else if (totalSismos === 1) {
          $('#info-resultados').text(`📍 Mostrando el único sismo.`);
        }else{
          $('#info-resultados').text(`📍 Mostrando los ${lastMarkersCount} sismos.`);
        }
        
      }

    } else {
      if(totalSismos > limiteHeatPoints){

        $('#info-resultados').text(`🔥 Mostrando ${lastHeatPointsCount} marcadores de ${totalSismos} sismos.`);

      }else{
        
        if(totalSismos === 0){ 
          $('#info-resultados').text(`🔥 No hubo ningún sismo.`);
        }else if (totalSismos === 1) {
          $('#info-resultados').text(`🔥 Mostrando el único sismo.`);
        }else{
          $('#info-resultados').text(`🔥 Mostrando los ${lastHeatPointsCount} sismos.`);
        }

      }
    }
    
  }

  function renderSismos(data) {
    const sismos = data.data;
    totalSismos = data.total;
    limiteHeatPoints = data.limit;

    capas.alta.clearLayers();
    capas.media.clearLayers();
    capas.baja.clearLayers();

    const maxMagnitud = Math.max(
      1,
      ...sismos
        .map((s) => Number(s.magnitud))
        .filter((m) => Number.isFinite(m)),
    );

    // MARKERS
    const markers = sismos.slice(0, LIMITE_POR_MARKERS);
    markers.forEach((sismo) => {
      const lat = Number(sismo.lat);
      const lon = Number(sismo.lon);
      const mag = Number(sismo.magnitud);

      const info = getInfoMagnitud(mag);

      L.circleMarker([lat, lon], { radius: info.radio, color: info.color })
        .addTo(capas[info.categoria])
        .bindPopup(`Magnitud: ${mag}<br>
                                    Profundidad: ${sismo.profundidad}<br>
                                    Fecha: ${sismo.fecha}`);
    });

    lastMarkersCount = markers.length;

    // HEAT POINTS
    const heatPoints = [];
    sismos.forEach((sismo) => {
      const lat = Number(sismo.lat);
      const lon = Number(sismo.lon);
      const mag = Number(sismo.magnitud);

      if (Number.isFinite(lat) && Number.isFinite(lon) && Number.isFinite(mag)) {
        const intensidad = Math.min(1, Math.max(0, mag / maxMagnitud));
        heatPoints.push([lat, lon, intensidad]);
      }
    });

    lastHeatPoints = heatPoints;
    lastHeatPointsCount = heatPoints.length;

    syncCapasPorZoom();
  }

  function obtenerSismosJson(inicio, fin, departamentoExplicito) {
    const params = { inicio, fin };
    if (departamentoExplicito !== undefined && departamentoExplicito !== null && departamentoExplicito !== '') {
      params.departamento = departamentoExplicito;
    } else {
      const dep = $('#filtroDepartamento option:selected').text();
      if (dep && dep !== 'TODOS') {
        params.departamento = dep;
      }
    }
    const qs = new URLSearchParams(params).toString();
    return fetch(`/api/sismos?${qs}`).then((res) => res.json());
  }

  function cargarSismosAlMapa(inicio, fin, departamentoExplicito) {
    $('#yearSlider').slider('disable');
    $('#loading').show();
    return obtenerSismosJson(inicio, fin, departamentoExplicito)
      .then((data) => {
        renderSismos(data);
      })
      .catch((error) => {
        console.error('Error al cargar los sismos.', error);
        alert('No se pudieron cargar los sismos');
      })
      .finally(() => {
        $('#loading').hide();
        $('#yearSlider').slider('enable');
      });
  }

  $('#btnCambiarModoFecha').on('click', () => {
    modoFecha = modoFecha === 'slider' ? 'manual' : 'slider';
    (function aplicarVistaModoFecha() {
      const $btn = $('#btnCambiarModoFecha');
      if (modoFecha === 'slider') {
        $('#panelFiltroAnios').show();
        $('#panelFiltroManual').hide();
        $btn.text('Usar rango manual de fechas');
      } else {
        $('#panelFiltroAnios').hide();
        $('#panelFiltroManual').show();
        $btn.text('Usar rango por años (slider)');
      }
    })();
    if (modoFecha === 'slider') {
      const r = yearRangeFromSlider();
      cargarSismosAlMapa(`${r.yMin}-01-01`, `${r.yMax}-12-31`);
    }
  });

  $('#btnFiltrar').on('click', () => {
    if (modoFecha !== 'manual') return;
    const inicio = $fechaDesde.val();
    const fin = $fechaHasta.val();
    if (!inicio || !fin) {
      alert('Seleccione fecha desde y fecha hasta.');
      return;
    }
    cargarSismosAlMapa(inicio, fin);
  });

  let yearSliderTimeout;

  function yearRangeFromSlider() {
    const [a, b] = $('#yearSlider').slider('option', 'values');
    return {
      yMin: Math.min(a, b),
      yMax: Math.max(a, b),
    };
  }

  function rangoFechasParaSismos() {
    if (modoFecha === 'slider') {
      const r = yearRangeFromSlider();
      return { inicio: `${r.yMin}-01-01`, fin: `${r.yMax}-12-31` };
    }
    const inicio = $fechaDesde.val();
    const fin = $fechaHasta.val();
    if (inicio && fin) {
      return { inicio, fin };
    }
    const r = yearRangeFromSlider();
    return { inicio: `${r.yMin}-01-01`, fin: `${r.yMax}-12-31` };
  }

  function updateYearLabel(yMin, yMax) {
    $('#yearLabel').text(yMin + ' – ' + yMax);
  }

  $('#yearSlider').slider({
    range: true,
    min: 1960,
    max: 2023,
    values: [2023, 2023],
    slide: function (event, ui) {
      if (modoFecha !== 'slider') return;
      const yMin = ui.values[0];
      const yMax = ui.values[1];
      updateYearLabel(yMin, yMax);

      clearTimeout(yearSliderTimeout);
      yearSliderTimeout = setTimeout(() => {
        const r = yearRangeFromSlider();
        const inicio = `${r.yMin}-01-01`;
        const fin = `${r.yMax}-12-31`;
        cargarSismosAlMapa(inicio, fin);
      }, 400);
    },
  });

  (function cargarSismosInicialesPorSlider() {
    const r = yearRangeFromSlider();
    updateYearLabel(r.yMin, r.yMax);
    cargarSismosAlMapa(`${r.yMin}-01-01`, `${r.yMax}-12-31`);
  })();

