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
  const themeById = new Map(themes.map((theme) => [theme.id, theme]));
  const subthemes = themes.flatMap((theme) => (theme.subthemes || []).map((subtheme) => ({ ...subtheme, parentId: theme.id, parentLabel: theme.label })));
  const subthemeById = new Map(subthemes.map((subtheme) => [subtheme.id, subtheme]));
  let registryCounter = 0;

  const STOP_WORDS = new Set(["a", "al", "con", "como", "de", "del", "e", "el", "en", "la", "las", "los", "para", "por", "un", "una", "y"]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
    return data.parties.flatMap((party) => party.priorities.map((priority) => ({ party, priority })));
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
          record.section || ""
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
      taxonomyHelp.innerHTML = `<strong>Cómo interpretar la clasificación:</strong> ${escapeHtml(taxonomy.intro || "El tema madre agrupa ámbitos amplios y el subtema concreta las medidas identificadas.")}`;
      return;
    }
    if (selected.type === "theme") {
      const theme = themeById.get(selected.id);
      const description = taxonomy.themes?.[selected.id] || "Ámbito general de clasificación documental.";
      taxonomyHelp.innerHTML = `<strong>Tema madre: ${escapeHtml(theme?.label || selected.id)}</strong> ${escapeHtml(description)} <span>La selección incluye todos sus subtemas activos.</span>`;
      return;
    }
    const subtheme = subthemeById.get(selected.id);
    const description = taxonomy.subthemes?.[selected.id] || "Subtema utilizado para concretar el contenido de las medidas identificadas.";
    taxonomyHelp.innerHTML = `<strong>Subtema: ${escapeHtml(subtheme?.label || selected.id)}</strong> ${escapeHtml(description)} <span>El resultado muestra medidas concretas etiquetadas en esta categoría.</span>`;
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
    partyOptions.innerHTML = data.parties.map((party) => `<label class="party-option"><input type="checkbox" data-party value="${escapeHtml(party.name)}" /> <span>${escapeHtml(party.name)}</span></label>`).join("");
    updatePartySummary();
    themes.forEach((theme) => {
      themeFilter.insertAdjacentHTML("beforeend", `<option value="theme:${escapeHtml(theme.id)}">◆ ${escapeHtml(theme.label)} · todos los subtemas</option>`);
      const children = subthemes.filter((subtheme) => subtheme.parentId === theme.id);
      children.forEach((subtheme) => {
        themeFilter.insertAdjacentHTML("beforeend", `<option value="subtheme:${escapeHtml(subtheme.id)}">　↳ ${escapeHtml(subtheme.label)}</option>`);
      });
    });
  }

  function renderStats(filtered, query) {
    const priorityCount = filtered.length;
    const measureCount = filtered.reduce((total, item) => total + item.measures.length, 0);
    const partyCount = new Set(filtered.map((item) => item.party.name)).size;
    stats.innerHTML = [
      [partyCount, "partidos visibles"],
      [priorityCount, "prioridades visibles"],
      [measureCount, query ? "medidas concretas coincidentes" : "medidas concretas con acceso al PDF"]
    ].map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
  }

  function renderSearchNote(query, filtered) {
    if (!searchNote) return;
    if (!query) {
      searchNote.textContent = "La búsqueda ignora tildes y acepta términos relacionados, como inmigración, migración, asilo o integración.";
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

  function renderParty(party, priorities, query) {
    const prioritiesHtml = priorities.map(({ priority, measures }, priorityIndex) => {
      const labels = priorityThemeLabels(priority);
      const themeHtml = labels.map((label) => `<span class="theme">${escapeHtml(label)}</span>`).join("");
      const matchCount = query ? `<span class="match-count">${measures.length} de ${priority.measures.length} medidas</span>` : "";
      const renderMeasureList = (items) => items.map((measure) => {
        const [title, detail, page] = measure;
        const sourceNumber = measure[5];
        const sourceKind = measureSourceKind(measure);
        const sourceSection = measureSourceSection(measure);
        const id = `measure-${registryCounter++}`;
        registry.set(id, { party, priority, title, detail, page, labels, sourceNumber, sourceKind, sourceSection });
        const numberPrefix = sourceNumber ? `Medida ${sourceNumber}: ` : "";
        const sectionLabel = sourceSection ? `<small class="measure-section">${escapeHtml(sourceSection)}</small>` : "";
        return `<li><button class="measure-button" type="button" data-measure-id="${id}"><span><span class="measure-title">${numberPrefix}${escapeHtml(title)}</span>${sectionLabel}</span><span class="measure-page">PDF p. ${page} →</span></button></li>`;
      }).join("");
      const documentMeasures = measures.filter((measure) => measureSourceKind(measure) === "document");
      const summaryMeasures = measures.filter((measure) => measureSourceKind(measure) !== "document");
      const documentHtml = documentMeasures.length ? `<p class="measure-heading document-heading">Medidas/propuestas extraídas del programa <span>${documentMeasures.length}</span></p><ul class="measure-list">${renderMeasureList(documentMeasures)}</ul>` : "";
      const summaryHtml = summaryMeasures.length ? `<p class="measure-heading summary-heading">Síntesis analíticas del bloque <span>${summaryMeasures.length}</span></p><ul class="measure-list">${renderMeasureList(summaryMeasures)}</ul>` : "";
      return `<article class="priority"><div class="priority-meta"><span class="priority-number">BLOQUE TEMÁTICO ${priorityIndex + 1}</span><span class="theme-list">${themeHtml}</span>${matchCount}</div><h4>${escapeHtml(priority.title)}</h4><p class="priority-description">${escapeHtml(priority.description)}</p>${documentHtml}${summaryHtml}</article>`;
    }).join("");
    return `<article class="party-card"><header class="party-header"><div><h3>${escapeHtml(party.name)}</h3><p>${escapeHtml(party.description)}</p></div><span class="party-code">${data.year}</span></header>${prioritiesHtml}</article>`;
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
    renderStats(filtered, query);
    renderSearchNote(query, filtered);
    if (!filtered.length) {
      results.innerHTML = `<div class="empty"><strong>No hay resultados.</strong><br />Prueba a cambiar los filtros o la búsqueda.</div>`;
      return;
    }
    const grouped = data.parties
      .map((party) => ({ party, priorities: filtered.filter((item) => item.party.name === party.name) }))
      .filter((group) => group.priorities.length);
    results.innerHTML = grouped.map(({ party, priorities }) => renderParty(party, priorities, query)).join("");
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
    dialogContent.innerHTML = `<div class="dialog-content"><p class="dialog-kicker">${sourceLabel}${sourceNumber} · ${escapeHtml(item.party.name)} · ${data.year} · ${escapeHtml(labels)}</p><p class="dialog-context"><strong>Bloque temático:</strong> ${escapeHtml(item.priority.title)}</p>${section}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p><div class="source-box"><strong>Texto completo de la fuente</strong><p>${sourceIntro}</p><a class="source-link" href="${pdfFile}#page=${item.page}" target="_blank" rel="noopener">Abrir PDF en la página ${item.page} ↗</a></div></div>`;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  results.addEventListener("click", (event) => {
    const button = event.target.closest("[data-measure-id]");
    if (button) openMeasure(button.dataset.measureId);
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
  themeFilter.addEventListener("change", render);
  document.addEventListener("click", (event) => {
    if (!partyPicker.contains(event.target)) partyPicker.removeAttribute("open");
  });
  searchInput.addEventListener("input", render);

  attachSourceCatalog();
  populateFilters();
  render();
})();
