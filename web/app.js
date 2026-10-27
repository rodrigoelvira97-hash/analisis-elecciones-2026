(function () {
  "use strict";

  const data = window.ELECTION_ANALYSIS;
  const partyPicker = document.getElementById("party-picker");
  const partySummary = document.getElementById("party-summary");
  const partyAll = document.getElementById("party-all");
  const partyOptions = document.getElementById("party-options");
  const themeFilter = document.getElementById("theme-filter");
  const searchInput = document.getElementById("search-input");
  const searchNote = document.getElementById("search-note");
  const taxonomyHelp = document.getElementById("taxonomy-help");
  const stats = document.getElementById("stats");
  const results = document.getElementById("results");
  const dialog = document.getElementById("measure-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const closeDialog = document.getElementById("close-dialog");

  const registry = new Map();
  const themes = data.themes || [];
  const taxonomy = data.taxonomy || { intro: "", themes: {}, subthemes: {} };
  const sourceCatalog = window.ELECTION_SOURCE_CATALOG || {};
  const programStructure = window.ELECTION_PROGRAM_STRUCTURE || { parties: {} };
  const PARTY_DISPLAY_ORDER = ["PP", "PSOE", "VOX", "SUMAR"];
  const themeById = new Map(themes.map((theme) => [theme.id, theme]));
  const subthemes = themes.flatMap((theme) => (theme.subthemes || []).map((subtheme) => ({ ...subtheme, parentId: theme.id, parentLabel: theme.label })));
  const subthemeById = new Map(subthemes.map((subtheme) => [subtheme.id, subtheme]));
  let registryCounter = 0;
  let browseState = { type: "home", partyName: null, blockIndex: null };

  const STOP_WORDS = new Set(["a", "al", "con", "como", "de", "del", "e", "el", "en", "la", "las", "los", "para", "por", "un", "una", "y"]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function pdfPageViewerLink(pdfFile, page) {
    const params = new URLSearchParams({ file: pdfFile, page: String(page) });
    return `pdf-viewer.html?${params.toString()}`;
  }

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function tokens(value) {
    return [...new Set(normalizeText(value).split(/\s+/).filter((token) => token && !STOP_WORDS.has(token)))];
  }

  function allPriorities() {
    return orderedParties().flatMap((party) => party.priorities.map((priority) => ({ party, priority })));
  }

  function orderedParties() {
    const partiesByName = new Map(data.parties.map((party) => [party.name, party]));
    const ordered = PARTY_DISPLAY_ORDER.map((name) => partiesByName.get(name)).filter(Boolean);
    return [...ordered, ...data.parties.filter((party) => !PARTY_DISPLAY_ORDER.includes(party.name))];
  }

  function priorityThemeIds(priority) {
    const explicitIds = priority.themeIds || [];
    const derivedIds = priority.measures.flatMap((measure) => measureSubthemeIds(measure).map((id) => subthemeById.get(id)?.parentId).filter(Boolean));
    return explicitIds.length ? [...new Set(explicitIds)] : [...new Set(derivedIds)];
  }

  function priorityHasTheme(priority, themeId) {
    if ((priority.themeIds || []).includes(themeId)) return true;
    return priority.measures.some((measure) => measureTopicIds(measure).includes(themeId));
  }

  function priorityThemeLabels(priority) {
    const labels = priorityThemeIds(priority)
      .map((id) => themeById.get(id)?.label)
      .filter(Boolean);
    return labels.length ? labels : [priority.theme];
  }

  function themeTerms(theme) {
    return [theme.label, ...(theme.aliases || [])];
  }

  function themeDirectTerms(theme) {
    return theme.directTerms || theme.aliases || [];
  }

  function measureTopicIds(measure) {
    const explicitIds = measure[3] || [];
    const derivedIds = measureSubthemeIds(measure).map((id) => subthemeById.get(id)?.parentId).filter(Boolean);
    return [...new Set([...explicitIds, ...derivedIds])];
  }

  function measureSubthemeIds(measure) {
    return measure[4] || [];
  }

  function measureSourceKind(measure) {
    return measure[6] || (measure[5] ? "document" : "summary");
  }

  function measureSourceSection(measure) {
    return measure[7] || "";
  }

  function measureOriginalBlockIndex(measure) {
    return Number.isInteger(measure[8]) ? measure[8] : null;
  }

  function measureText(measure) {
    return normalizeText(measure.slice(0, 2).join(" "));
  }

  function attachSourceCatalog() {
    data.parties.forEach((party) => {
      const records = sourceCatalog[party.name] || [];
      records.forEach((record) => {
        const priority = party.priorities[record.priorityIndex];
        if (!priority || !record.title || !record.page) return;
        const alreadyAdded = priority.measures.some((measure) => measure[0] === record.title && measure[2] === record.page);
        if (alreadyAdded) return;
        priority.measures.push([
          record.title,
          record.detail,
          record.page,
          [],
          record.subthemeIds || [],
          record.number,
          record.kind || "document",
          record.section || "",
          record.originalBlockIndex ?? null
        ]);
      });
    });
  }

  function selectedThemeFilter() {
    if (themeFilter.value === "all") return { type: "all", id: "all" };
    const separatorIndex = themeFilter.value.indexOf(":");
    return {
      type: themeFilter.value.slice(0, separatorIndex),
      id: themeFilter.value.slice(separatorIndex + 1)
    };
  }

  function renderTaxonomyHelp() {
    if (!taxonomyHelp) return;
    const selected = selectedThemeFilter();
    if (selected.type === "all") {
      taxonomyHelp.innerHTML = `<strong>Dos formas de explorar:</strong> entra en un partido para seguir su índice original o elige un tema para comparar propuestas entre partidos.`;
      return;
    }
    if (selected.type === "theme") {
      const theme = themeById.get(selected.id);
      const description = taxonomy.themes?.[selected.id] || "Ámbito general de clasificación documental.";
      taxonomyHelp.innerHTML = `<strong>Tema: ${escapeHtml(theme?.label || selected.id)}</strong> ${escapeHtml(description)} <span>Ahora selecciona un subtema para consultar las propuestas.</span>`;
      return;
    }
    const subtheme = subthemeById.get(selected.id);
    const description = taxonomy.subthemes?.[selected.id] || "Subtema utilizado para concretar el contenido de las medidas identificadas.";
    taxonomyHelp.innerHTML = `<strong>Subtema: ${escapeHtml(subtheme?.label || selected.id)}</strong> ${escapeHtml(description)} <span>Se muestran propuestas localizadas en los documentos de los partidos seleccionados.</span>`;
  }

  function selectedPartyNames() {
    if (partyAll.checked) return null;
    return [...partyOptions.querySelectorAll("input[data-party]")]
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  function updatePartySummary() {
    const selected = selectedPartyNames();
    if (selected === null) {
      partySummary.textContent = "Todos los partidos";
      return;
    }
    if (!selected.length) {
      partySummary.textContent = "Ningún partido";
      return;
    }
    if (selected.length === data.parties.length) {
      partySummary.textContent = "Todos los partidos";
      partyAll.checked = true;
      partyOptions.querySelectorAll("input[data-party]").forEach((input) => { input.checked = false; });
      return;
    }
    partySummary.textContent = `${selected.length} partido${selected.length === 1 ? "" : "s"} seleccionado${selected.length === 1 ? "" : "s"}`;
  }

  function matchingMeasures(party, priority, query) {
    let measures = priority.measures;
    const selected = selectedThemeFilter();
    if (selected.type === "theme") {
      measures = measures.filter((measure) => measureTopicIds(measure).includes(selected.id));
    }
    if (selected.type === "subtheme") {
      measures = measures.filter((measure) => measureSubthemeIds(measure).includes(selected.id));
    }
    if (!query) return measures;
    const concept = conceptForQuery(query);
    return measures.filter((measure) => {
      const normalizedMeasure = measureText(measure);
      if (concept.subthemes.length) {
        if (concept.subthemes.some((subtheme) => measureSubthemeIds(measure).includes(subtheme.id))) return true;
        return tokens(query).every((token) => matchesToken(token, normalizedMeasure));
      }
      if (concept.themes.length) {
        const topics = new Set(measureTopicIds(measure));
        return concept.themes.some((theme) => topics.has(theme.id));
      }
      return tokens(query).every((token) => matchesToken(token, normalizedMeasure));
    });
  }

  function levenshtein(left, right) {
    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let row = 1; row <= left.length; row += 1) {
      const current = [row];
      for (let column = 1; column <= right.length; column += 1) {
        const insertion = current[column - 1] + 1;
        const deletion = previous[column] + 1;
        const substitution = previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1);
        current.push(Math.min(insertion, deletion, substitution));
      }
      previous.splice(0, previous.length, ...current);
    }
    return previous[right.length];
  }

  function matchesToken(token, normalizedText) {
    if (normalizedText.includes(token)) return true;
    if (token.length < 6) return false;
    return normalizedText.split(" ").some((word) => Math.abs(word.length - token.length) <= 1 && levenshtein(token, word) <= 1);
  }

  function conceptForQuery(query) {
    const normalizedQuery = normalizeText(query);
    const queryTokens = tokens(query);
    const matchingSubthemes = subthemes.filter((subtheme) => queryTokens.length && queryTokens.every((token) => tokens(subtheme.label).some((labelToken) => matchesToken(token, labelToken))));
    if (matchingSubthemes.length) {
      return {
        themes: [],
        subthemes: matchingSubthemes,
        directTerms: matchingSubthemes.map((subtheme) => subtheme.label)
      };
    }
    return {
      themes: themes.filter((theme) => themeTerms(theme).some((term) => {
      const normalizedTerm = normalizeText(term);
      if (normalizedTerm === normalizedQuery) return true;
      return queryTokens.length === 1 && tokens(term).includes(queryTokens[0]);
      })),
      subthemes: [],
      directTerms: []
    };
  }

  function matchesPriority(party, priority) {
    const selectedParties = selectedPartyNames();
    if (selectedParties !== null && !selectedParties.includes(party.name)) return false;
    const selected = selectedThemeFilter();
    if (selected.type === "theme" && !priorityHasTheme(priority, selected.id)) return false;
    if (selected.type === "subtheme" && !priority.measures.some((measure) => measureSubthemeIds(measure).includes(selected.id))) return false;
    return true;
  }

  function populateFilters() {
    partyOptions.innerHTML = orderedParties().map((party) => `<label class="party-option"><input type="checkbox" data-party value="${escapeHtml(party.name)}" /> <span>${escapeHtml(party.name)}</span></label>`).join("");
    updatePartySummary();
    themes.filter((theme) => themeMeasureCount(theme.id) > 0).forEach((theme) => {
      const themeCount = themeMeasureCount(theme.id);
        themeFilter.insertAdjacentHTML("beforeend", `<option value="theme:${escapeHtml(theme.id)}">◆ ${escapeHtml(theme.label)} · ${themeCount} propuestas</option>`);
      const children = subthemes.filter((subtheme) => subtheme.parentId === theme.id && subthemeMeasureCount(subtheme.id) > 0);
      children.forEach((subtheme) => {
        themeFilter.insertAdjacentHTML("beforeend", `<option value="subtheme:${escapeHtml(subtheme.id)}">　↳ ${escapeHtml(subtheme.label)} · ${subthemeMeasureCount(subtheme.id)} propuestas</option>`);
      });
    });
  }

  function selectedParties() {
    const names = selectedPartyNames();
    return names === null ? orderedParties() : orderedParties().filter((party) => names.includes(party.name));
  }

  function documentMeasures(party) {
    return party.priorities.flatMap((priority, priorityIndex) => priority.measures
      .filter((measure) => measureSourceKind(measure) === "document")
      .map((measure) => ({ party, priority, priorityIndex, measure })));
  }

  function themeMeasureCount(themeId) {
    return data.parties.flatMap((party) => documentMeasures(party)).filter(({ measure }) => measureTopicIds(measure).includes(themeId)).length;
  }

  function subthemeMeasureCount(subthemeId) {
    return data.parties.flatMap((party) => documentMeasures(party)).filter(({ measure }) => measureSubthemeIds(measure).includes(subthemeId)).length;
  }

  function renderStats(partyCount, nodeCount, nodeLabel, measureCount, measureLabel) {
    stats.innerHTML = [
      [partyCount, "partidos visibles"],
      [nodeCount, nodeLabel],
      [measureCount, measureLabel]
    ].map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
  }

  function renderSearchNote(query, filtered) {
    if (!searchNote) return;
    if (!query) {
      searchNote.textContent = "Selecciona un bloque del programa, un tema madre o un subtema para consultar sus medidas. La búsqueda libre también permite localizar propuestas concretas.";
      return;
    }
    if (filtered.length) {
      const partyCount = new Set(filtered.map((item) => item.party.name)).size;
      const measureCount = filtered.reduce((total, item) => total + item.measures.length, 0);
      searchNote.innerHTML = `Resultados documentales para <strong>${escapeHtml(searchInput.value.trim())}</strong>: ${measureCount} medida${measureCount === 1 ? "" : "s"} coincidente${measureCount === 1 ? "" : "s"} en ${partyCount} partido${partyCount === 1 ? "" : "s"}. La prioridad se conserva como contexto.`;
    } else {
      searchNote.innerHTML = `No se ha localizado contenido para <strong>${escapeHtml(searchInput.value.trim())}</strong> en la base web actual.`;
    }
  }

  function renderMeasureList(entries) {
    return entries.map(({ party, priority, measure }) => {
      const [title, detail, page] = measure;
      const labels = priorityThemeLabels(priority);
      const sourceNumber = measure[5];
      const sourceKind = measureSourceKind(measure);
      const sourceSection = measureSourceSection(measure);
      const id = `measure-${registryCounter++}`;
      registry.set(id, { party, priority, title, detail, page, labels, sourceNumber, sourceKind, sourceSection });
      const numberPrefix = sourceNumber ? `Medida ${sourceNumber}: ` : "";
      const sectionLabel = sourceSection ? `<small class="measure-section">${escapeHtml(sourceSection)}</small>` : "";
      return `<li><button class="measure-button" type="button" data-measure-id="${id}"><span><span class="measure-title">${numberPrefix}${escapeHtml(title)}</span>${sectionLabel}</span><span class="measure-page">PDF p. ${page} →</span></button></li>`;
    }).join("");
  }

  function partyDocumentMeasuresForBlock(party, blockIndex) {
    return documentMeasures(party).filter(({ measure }) => measureOriginalBlockIndex(measure) === blockIndex);
  }

  function countMeasuresForPartyBlock(party, blockIndex) {
    return partyDocumentMeasuresForBlock(party, blockIndex).length;
  }

  function countThemeForParties(themeId, parties = selectedParties()) {
    return parties.flatMap((party) => documentMeasures(party)).filter(({ measure }) => measureTopicIds(measure).includes(themeId)).length;
  }

  function countSubthemeForParties(subthemeId, parties = selectedParties()) {
    return parties.flatMap((party) => documentMeasures(party)).filter(({ measure }) => measureSubthemeIds(measure).includes(subthemeId)).length;
  }

  function renderProgramIndex(party) {
    const structure = programStructure.parties?.[party.name];
    if (!structure?.blocks?.length) return "";
    const blockLabel = `${structure.blocks.length} bloque${structure.blocks.length === 1 ? "" : "s"} principales`;
    const indexPage = String(structure.indexPdfPages || "").split("-")[0];
    const blocksHtml = structure.blocks.map((block, index) => {
      const measureCount = countMeasuresForPartyBlock(party, index);
      const sectionsHtml = block.sections?.length
        ? `<details class="program-section-list"><summary>Ver apartados del índice (${block.sections.length})</summary><ol class="structure-sections">${block.sections.map((section) => `<li>${escapeHtml(section)}</li>`).join("")}</ol></details>`
        : `<p class="structure-empty">El índice presenta este capítulo como unidad principal, sin apartados de primer nivel listados en el índice.</p>`;
      return `<li class="structure-block"><button class="program-block-button" type="button" data-program-block="${escapeHtml(party.name)}::${index}"><span class="structure-block-heading"><span class="structure-number">${index + 1}</span><span><strong>${escapeHtml(block.title)}</strong><small>Paginación impresa: p. ${escapeHtml(block.page)}</small></span></span><span class="node-count">${measureCount} propuestas</span></button>${sectionsHtml}</li>`;
    }).join("");
    return `<section class="program-structure"><div class="structure-content"><div class="program-index-heading"><div><strong>Índice original del programa</strong><small>${blockLabel}. Selecciona un bloque para ver sus medidas.</small></div><a class="structure-source-link" href="${escapeHtml(pdfPageViewerLink(party.sourceFile, indexPage))}" target="_blank" rel="noopener">Abrir índice en PDF ↗</a></div><p class="structure-intro">Esta organización pertenece al documento original. Es independiente de los temas madre y subtemas comparativos.</p><ol class="structure-blocks">${blocksHtml}</ol></div></section>`;
  }

  function renderPartyShell(party, content) {
    const structure = programStructure.parties?.[party.name];
    const blockCount = structure?.blocks?.length || 0;
    const measureCount = documentMeasures(party).length;
    const metadata = `Programa ${data.year} · ${blockCount} apartados del programa · ${measureCount} referencias documentales localizadas`;
    return `<article class="party-card"><header class="party-header"><div><h3>${escapeHtml(party.name)}</h3><p>${escapeHtml(metadata)}</p></div><span class="party-code">${data.year}</span></header>${content}</article>`;
  }

  function renderThemeBrowser() {
    const parties = selectedParties();
    const cards = themes.filter((theme) => countThemeForParties(theme.id, parties) > 0).map((theme) => {
      const children = subthemes.filter((subtheme) => subtheme.parentId === theme.id && countSubthemeForParties(subtheme.id, parties) > 0);
      const childHtml = children.map((subtheme) => `<button class="topic-child-button" type="button" data-subtheme-node="${escapeHtml(subtheme.id)}"><span>${escapeHtml(subtheme.label)}</span><small>${countSubthemeForParties(subtheme.id, parties)} propuestas</small></button>`).join("");
      return `<article class="topic-node"><button class="topic-parent-button" type="button" data-theme-node="${escapeHtml(theme.id)}"><span><strong>${escapeHtml(theme.label)}</strong><small>Tema · ${countThemeForParties(theme.id, parties)} propuestas asociadas</small></span><span>Ver subtemas →</span></button><div class="topic-children">${childHtml}</div></article>`;
    }).join("");
    return `<section id="theme-explorer" class="topic-browser"><div class="browser-heading"><div><p class="eyebrow">Por tema</p><h3>Compara propuestas por temas</h3></div><p>Selecciona un tema para abrir sus subtemas. Las propuestas permanecen ocultas hasta entrar en un subtema.</p></div><div class="topic-grid">${cards || `<div class="empty"><strong>No hay temas con propuestas asociadas.</strong></div>`}</div></section>`;
  }

  function renderHomeView() {
    const parties = selectedParties();
    const partyCards = parties.map((party) => renderPartyShell(party, renderProgramIndex(party))).join("");
    const blockCount = parties.reduce((total, party) => total + (programStructure.parties?.[party.name]?.blocks?.length || 0), 0);
    const measureCount = parties.reduce((total, party) => total + documentMeasures(party).length, 0);
    renderStats(parties.length, blockCount, "apartados de programa", measureCount, "referencias documentales");
    return `<section class="quick-actions" aria-label="Elegir forma de exploración"><div><p class="eyebrow">Empieza por donde quieras</p><h3>Explora y compara sin perderte</h3><p>Consulta primero la estructura de un partido o entra directamente en un tema que te interese.</p></div><div class="quick-action-buttons"><button class="quick-action primary-action" type="button" data-scroll-target="party-explorer">Explorar programas <span>↓</span></button><button class="quick-action" type="button" data-scroll-target="theme-explorer">Comparar por tema <span>↓</span></button></div></section><section id="party-explorer" class="explorer-section"><div class="section-heading"><div><p class="eyebrow">Por partido</p><h3>Índices de los programas</h3></div><p>Selecciona un apartado para ver sus propuestas.</p></div><section class="party-grid">${partyCards || `<div class="empty"><strong>No hay partidos seleccionados.</strong></div>`}</section></section>${renderThemeBrowser()}`;
  }

  function renderThemeView(theme) {
    const parties = selectedParties();
    const children = subthemes.filter((subtheme) => subtheme.parentId === theme.id && countSubthemeForParties(subtheme.id, parties) > 0);
    const cards = children.map((subtheme) => `<button class="topic-detail-button" type="button" data-subtheme-node="${escapeHtml(subtheme.id)}"><strong>${escapeHtml(subtheme.label)}</strong><span>${countSubthemeForParties(subtheme.id, parties)} propuestas localizadas</span></button>`).join("");
    renderStats(parties.length, children.length, "subtemas con resultados", countThemeForParties(theme.id, parties), "propuestas dentro del tema");
    return `<section class="drilldown"><button class="back-button" type="button" data-reset-node>← Volver a índices y temas</button><div class="drilldown-heading"><p class="eyebrow">Tema madre</p><h3>${escapeHtml(theme.label)}</h3><p>${escapeHtml(taxonomy.themes?.[theme.id] || "Selecciona un subtema para consultar sus medidas.")}</p></div><div class="topic-detail-grid">${cards || `<div class="empty"><strong>No hay subtemas con medidas en la base actual.</strong></div>`}</div></section>`;
  }

  function shortenText(value, limit = 105) {
    const text = String(value ?? "").replace(/\s+/g, " ").trim();
    return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
  }

  function renderSubthemeView(subtheme) {
    const parties = selectedParties();
    const rows = parties.map((party) => {
      const entries = documentMeasures(party).filter(({ measure }) => measureSubthemeIds(measure).includes(subtheme.id));
      if (!entries.length) {
        return `<article class="comparison-party-row comparison-party-empty"><div class="comparison-party-main"><strong>${escapeHtml(party.name)}</strong><span class="comparison-count">0 propuestas localizadas</span></div><p>No hay propuestas localizadas en este subtema en la base actual.</p></article>`;
      }
      const preview = entries.slice(0, 2).map(({ measure }) => `<li>${escapeHtml(shortenText(measure[0]))}</li>`).join("");
      const moreCount = entries.length - Math.min(entries.length, 2);
      const previewMore = moreCount > 0 ? `<li class="comparison-preview-more">+ ${moreCount} propuesta${moreCount === 1 ? "" : "s"} al abrir</li>` : "";
      return `<details class="comparison-party-row"><summary><span class="comparison-party-main"><span class="comparison-party-heading"><strong>${escapeHtml(party.name)}</strong><span class="comparison-count">${entries.length} propuesta${entries.length === 1 ? "" : "s"}</span></span><span class="comparison-preview-label">Ejemplos:</span><ul class="comparison-preview">${preview}${previewMore}</ul></span><span class="comparison-row-cta">Ver propuestas <span aria-hidden="true">⌄</span></span></summary><div class="comparison-expanded"><p class="measure-heading document-heading">Propuestas del programa <span>${entries.length}</span></p><ul class="measure-list">${renderMeasureList(entries)}</ul></div></details>`;
    }).join("");
    const total = countSubthemeForParties(subtheme.id, parties);
    renderStats(parties.length, 1, "subtema seleccionado", total, "propuestas disponibles");
    return `<section class="drilldown"><button class="back-button" type="button" data-reset-node>← Volver a índices y temas</button><div class="drilldown-heading"><p class="eyebrow">${escapeHtml(subtheme.parentLabel || "Tema")} · Subtema</p><h3>${escapeHtml(subtheme.label)}</h3><p>Comparativa resumida por partido. Abre cada fila para consultar el listado completo y acceder al PDF.</p></div><section class="comparison-board"><div class="comparison-board-heading"><div><strong>Propuestas localizadas</strong><small>${total} en los partidos seleccionados</small></div><span>Selecciona un partido para ampliar</span></div>${rows || `<div class="empty"><strong>No hay partidos seleccionados.</strong></div>`}</section></section>`;
  }

  function renderProgramBlockView(party, blockIndex) {
    const structure = programStructure.parties?.[party.name];
    const block = structure?.blocks?.[blockIndex];
    const entries = partyDocumentMeasuresForBlock(party, blockIndex);
    renderStats(1, 1, "bloque original seleccionado", entries.length, "medidas del bloque");
    const body = entries.length ? `<p class="measure-heading document-heading">Medidas del programa <span>${entries.length}</span></p><ul class="measure-list">${renderMeasureList(entries)}</ul>` : `<div class="empty"><strong>No hay medidas vinculadas a este bloque.</strong><br />La extracción de este documento debe revisarse antes de afirmar que el programa no lo desarrolla.</div>`;
    return `<section class="drilldown"><button class="back-button" type="button" data-reset-node>← Volver al índice del programa</button><div class="drilldown-heading"><p class="eyebrow">${escapeHtml(party.name)} · Índice original</p><h3>${escapeHtml(block?.title || "Bloque del programa")}</h3><p>Paginación impresa: p. ${escapeHtml(block?.page || "—")}. Las medidas se muestran separadas de la clasificación analítica común.</p></div>${renderPartyShell(party, `<section class="selected-node-content">${body}</section>`)}</section>`;
  }

  function renderSearchParty(party, priorities, query) {
    const priorityHtml = priorities.map(({ priority, measures }, priorityIndex) => {
      const labels = priorityThemeLabels(priority);
      const themeHtml = labels.map((label) => `<span class="theme">${escapeHtml(label)}</span>`).join("");
      const entries = measures.map((measure) => ({ party, priority, priorityIndex, measure }));
      return `<article class="priority"><div class="priority-meta"><span class="priority-number">BLOQUE ANALÍTICO ${priorityIndex + 1}</span><span class="theme-list">${themeHtml}</span><span class="match-count">${measures.length} coincidencias</span></div><h4>${escapeHtml(priority.title)}</h4><p class="priority-description">${escapeHtml(priority.description)}</p><p class="measure-heading document-heading">Resultados para “${escapeHtml(query)}” <span>${measures.length}</span></p><ul class="measure-list">${renderMeasureList(entries)}</ul></article>`;
    }).join("");
    return renderPartyShell(party, priorityHtml);
  }

  function renderSearchView(filtered, query) {
    const partyCount = new Set(filtered.map((item) => item.party.name)).size;
    const measureCount = filtered.reduce((total, item) => total + item.measures.length, 0);
    renderStats(partyCount, filtered.length, "apartados con coincidencias", measureCount, "propuestas coincidentes");
    renderSearchNote(query, filtered);
    if (!filtered.length) return `<div class="empty"><strong>No hay resultados.</strong><br />Prueba a cambiar los filtros o la búsqueda.</div>`;
    const grouped = orderedParties().map((party) => ({ party, priorities: filtered.filter((item) => item.party.name === party.name) })).filter((group) => group.priorities.length);
    return `<div class="view-intro"><strong>Resultados de búsqueda.</strong> La búsqueda es una entrada directa a las medidas; fuera de ella, el visor mantiene las medidas cerradas hasta seleccionar un nivel.</div><section class="party-grid">${grouped.map(({ party, priorities }) => renderSearchParty(party, priorities, query)).join("")}</section>`;
  }

  function render() {
    registry.clear();
    registryCounter = 0;
    const query = searchInput.value.trim();
    renderTaxonomyHelp();
    const filtered = allPriorities()
      .filter(({ party, priority }) => matchesPriority(party, priority))
      .map(({ party, priority }) => ({ party, priority, measures: matchingMeasures(party, priority, query) }))
      .filter((item) => item.measures.length);
    if (query) {
      results.innerHTML = renderSearchView(filtered, query);
      return;
    }
    const selected = selectedThemeFilter();
    if (selected.type === "theme") {
      results.innerHTML = renderThemeView(themeById.get(selected.id));
      return;
    }
    if (selected.type === "subtheme") {
      results.innerHTML = renderSubthemeView(subthemeById.get(selected.id));
      return;
    }
    if (browseState.type === "program-block") {
      const party = data.parties.find((candidate) => candidate.name === browseState.partyName);
      results.innerHTML = party ? renderProgramBlockView(party, browseState.blockIndex) : renderHomeView();
      return;
    }
    renderSearchNote("", []);
    results.innerHTML = renderHomeView();
  }

  function openMeasure(id) {
    const item = registry.get(id);
    if (!item) return;
    const pdfFile = item.party.sourceFile;
    const labels = item.labels.join(" · ");
    const sourceNumber = item.sourceNumber ? ` · Medida ${item.sourceNumber}` : "";
    const sourceLabel = item.sourceKind === "document" ? "MEDIDA DEL PROGRAMA" : "SÍNTESIS ANALÍTICA";
    const section = item.sourceSection ? `<p class="dialog-context"><strong>Sección del programa:</strong> ${escapeHtml(item.sourceSection)}</p>` : "";
    const sourceIntro = item.sourceKind === "document" ? "Esta ficha procede de una propuesta extraída del programa y conserva su referencia de página." : "Esta ficha es una síntesis analítica basada en el contenido del programa; la referencia permite consultar el texto completo.";
    dialogContent.innerHTML = `<div class="dialog-content"><p class="dialog-kicker">${sourceLabel}${sourceNumber} · ${escapeHtml(item.party.name)} · ${data.year} · ${escapeHtml(labels)}</p><p class="dialog-context"><strong>Bloque analítico:</strong> ${escapeHtml(item.priority.title)}</p>${section}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p><div class="source-box"><strong>Texto completo de la fuente</strong><p>${sourceIntro}</p><a class="source-link" href="${escapeHtml(pdfPageViewerLink(pdfFile, item.page))}" target="_blank" rel="noopener">Abrir PDF en la página ${item.page} ↗</a><a class="source-secondary-link" href="${escapeHtml(pdfFile)}#page=${item.page}" target="_blank" rel="noopener">Abrir PDF completo en el visor del dispositivo</a></div></div>`;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  results.addEventListener("click", (event) => {
    const scrollTarget = event.target.closest("[data-scroll-target]");
    if (scrollTarget) {
      document.getElementById(scrollTarget.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const button = event.target.closest("[data-measure-id]");
    if (button) openMeasure(button.dataset.measureId);
    const programBlock = event.target.closest("[data-program-block]");
    if (programBlock) {
      const [partyName, blockIndex] = programBlock.dataset.programBlock.split("::");
      browseState = { type: "program-block", partyName, blockIndex: Number(blockIndex) };
      themeFilter.value = "all";
      render();
      return;
    }
    const themeNode = event.target.closest("[data-theme-node]");
    if (themeNode) {
      themeFilter.value = `theme:${themeNode.dataset.themeNode}`;
      browseState = { type: "home", partyName: null, blockIndex: null };
      render();
      return;
    }
    const subthemeNode = event.target.closest("[data-subtheme-node]");
    if (subthemeNode) {
      themeFilter.value = `subtheme:${subthemeNode.dataset.subthemeNode}`;
      browseState = { type: "home", partyName: null, blockIndex: null };
      render();
      return;
    }
    if (event.target.closest("[data-reset-node]")) {
      themeFilter.value = "all";
      browseState = { type: "home", partyName: null, blockIndex: null };
      render();
    }
  });
  closeDialog.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  partyAll.addEventListener("change", () => {
    if (partyAll.checked) {
      partyOptions.querySelectorAll("input[data-party]").forEach((input) => { input.checked = false; });
    }
    updatePartySummary();
    render();
  });
  partyOptions.addEventListener("change", (event) => {
    if (!event.target.matches("input[data-party]")) return;
    partyAll.checked = false;
    updatePartySummary();
    render();
  });
  themeFilter.addEventListener("change", () => {
    browseState = { type: "home", partyName: null, blockIndex: null };
    render();
  });
  document.addEventListener("click", (event) => {
    if (!partyPicker.contains(event.target)) partyPicker.removeAttribute("open");
  });
  searchInput.addEventListener("input", render);

  attachSourceCatalog();
  populateFilters();
  render();
})();
