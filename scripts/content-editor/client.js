const existingEditor = document.querySelector('[data-cvi-content-editor]');

if (!existingEditor) {
  const editorScript = document.querySelector('script[data-cvi-editor][data-editor-base]');
  const editorBase = editorScript?.dataset.editorBase || '';
  const editorUrl = (path) => `${editorBase}${path}`;
  const storageKey = 'cvi-local-editor-state';
  const newEntryValue = '__new__';
  const typeLabels = {
    project: 'Projects',
    publication: 'Publications',
    person: 'People',
  };
  const state = {
    open: false,
    type: 'project',
    id: undefined,
    items: [],
    item: undefined,
  };

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
  const optional = (value) => value?.trim() || undefined;
  const lines = (value) => value.split('\n').map((line) => line.trim()).filter(Boolean);
  const paragraphs = (value) => value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const identifierFrom = (value) => String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

  const shell = document.createElement('div');
  shell.dataset.cviContentEditor = '';
  shell.innerHTML = `
    <button class="cvi-editor-launch" type="button" aria-expanded="false" aria-controls="cvi-editor-panel">
      <span aria-hidden="true">+</span> Add
    </button>
    <div class="cvi-editor-backdrop" hidden></div>
    <aside class="cvi-editor-panel" id="cvi-editor-panel" aria-label="Local content editor" hidden>
      <header class="cvi-editor-header">
        <div>
          <span>Local editing session</span>
          <h2>CVI Lab Content Editor</h2>
        </div>
        <button class="cvi-editor-close" type="button" aria-label="Close editor">×</button>
      </header>
      <p class="cvi-editor-notice">Changes are written directly to <code>src/content/</code> on this computer. Use a card's pencil to edit it and its six-dot handle to reorder it. Changes are not deployed until you commit and deploy them.</p>
      <nav class="cvi-editor-tabs" aria-label="Content type">
        ${Object.entries(typeLabels).map(([type, label]) => `<button type="button" data-editor-type="${type}">${label}</button>`).join('')}
      </nav>
      <div class="cvi-editor-picker">
        <label for="cvi-editor-item">Item</label>
        <div>
          <select id="cvi-editor-item"></select>
          <button class="cvi-editor-new" type="button">New</button>
        </div>
      </div>
      <section class="cvi-editor-create" aria-labelledby="cvi-editor-create-title" hidden></section>
      <div class="cvi-editor-status" role="status" aria-live="polite"></div>
      <div class="cvi-editor-form"></div>
    </aside>
    <div class="cvi-editor-toast" role="status" aria-live="polite" hidden></div>
    <div class="cvi-editor-inline-popover" role="dialog" aria-modal="false" aria-labelledby="cvi-inline-title" hidden>
      <header class="cvi-editor-inline-popover__header">
        <div>
          <span>Inline edit</span>
          <h2 id="cvi-inline-title">Edit page text</h2>
        </div>
        <button type="button" data-inline-close aria-label="Close text editor">×</button>
      </header>
      <form data-inline-form>
        <label>
          <span data-inline-field-label>Text</span>
          <textarea name="value" rows="6" required></textarea>
        </label>
        <small data-inline-help></small>
        <small data-inline-source></small>
        <p data-inline-status role="status" aria-live="polite"></p>
        <div class="cvi-editor-inline-popover__actions">
          <button type="button" data-inline-cancel>Cancel</button>
          <button type="submit" data-inline-save>Save text</button>
        </div>
      </form>
    </div>
  `;
  document.body.append(shell);

  const launch = shell.querySelector('.cvi-editor-launch');
  const backdrop = shell.querySelector('.cvi-editor-backdrop');
  const panel = shell.querySelector('.cvi-editor-panel');
  const closeButton = shell.querySelector('.cvi-editor-close');
  const itemSelect = shell.querySelector('#cvi-editor-item');
  const createContainer = shell.querySelector('.cvi-editor-create');
  const formContainer = shell.querySelector('.cvi-editor-form');
  const status = shell.querySelector('.cvi-editor-status');
  const toast = shell.querySelector('.cvi-editor-toast');
  const inlinePopover = shell.querySelector('.cvi-editor-inline-popover');
  const inlineForm = shell.querySelector('[data-inline-form]');
  const inlineTextarea = inlineForm.elements.value;
  const inlineFieldLabel = shell.querySelector('[data-inline-field-label]');
  const inlineHelp = shell.querySelector('[data-inline-help]');
  const inlineSource = shell.querySelector('[data-inline-source]');
  const inlineStatus = shell.querySelector('[data-inline-status]');
  let inlineTarget;
  let inlineEditContext;

  const setStatus = (message, kind = '') => {
    status.textContent = message;
    status.dataset.kind = kind;
  };

  let toastTimer;
  const showToast = (message, kind = '') => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.dataset.kind = kind;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  };

  const persistState = () => sessionStorage.setItem(storageKey, JSON.stringify({
    open: state.open,
    type: state.type,
    id: state.id,
  }));

  const inferredContext = () => {
    const pathname = editorBase && window.location.pathname.startsWith(`${editorBase}/`)
      ? window.location.pathname.slice(editorBase.length)
      : window.location.pathname;
    const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/);
    if (projectMatch) return { type: 'project', id: decodeURIComponent(projectMatch[1]) };
    if (/^\/projects\/?$/.test(pathname)) return { type: 'project' };
    if (/^\/publications\/?$/.test(pathname)) return { type: 'publication' };
    if (/^\/people\/?$/.test(pathname)) return { type: 'person' };
    return undefined;
  };
  const pageContext = inferredContext();
  launch.hidden = !pageContext || Boolean(pageContext.id);

  function installCardEditButtons() {
    document.querySelectorAll('[data-content-type][data-content-id]').forEach((card) => {
      if (card.querySelector(':scope > [data-card-edit]')) return;
      const type = card.dataset.contentType;
      const id = card.dataset.contentId;
      if (!typeLabels[type] || !id) return;

      const title = card.querySelector('h2, h3')?.textContent?.trim() || id;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cvi-editor-card-edit';
      button.dataset.cardEdit = '';
      button.dataset.editType = type;
      button.dataset.editId = id;
      button.setAttribute('aria-label', `Edit ${title}`);
      button.title = `Edit ${title}`;
      button.innerHTML = `
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12.9 3.4 16.6 7.1 7.2 16.5l-4.4.8.8-4.4 9.3-9.5Z" />
          <path d="m10.9 5.4 3.7 3.7" />
        </svg>`;
      card.classList.add('cvi-editor-editable');
      card.append(button);
    });
  }

  const orderKindFromGroup = (group) => {
    if (group === 'project' || group === 'featured-project') return group;
    if (group.startsWith('publication:')) return 'publication';
    if (group.startsWith('person:')) return 'person';
    return undefined;
  };

  const orderedCards = (group) => [...document.querySelectorAll('[data-order-group]')]
    .filter((card) => card.dataset.orderGroup === group);

  function installSortables() {
    let dragged;
    let originalIds = [];

    document.querySelectorAll('[data-order-group][data-content-id]').forEach((card) => {
      if (card.querySelector(':scope > [data-order-drag]')) return;
      const group = card.dataset.orderGroup;
      if (!group || !orderKindFromGroup(group)) return;

      const title = card.querySelector('h2, h3')?.textContent?.trim() || card.dataset.contentId;
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'cvi-editor-drag-handle';
      handle.dataset.orderDrag = '';
      handle.draggable = true;
      handle.setAttribute('aria-label', `Drag to reorder ${title}`);
      handle.title = `Drag to reorder ${title}`;
      handle.innerHTML = `
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="6" cy="5" r="1.25"/><circle cx="14" cy="5" r="1.25"/>
          <circle cx="6" cy="10" r="1.25"/><circle cx="14" cy="10" r="1.25"/>
          <circle cx="6" cy="15" r="1.25"/><circle cx="14" cy="15" r="1.25"/>
        </svg>`;
      card.classList.add('cvi-editor-sortable');
      card.append(handle);

      handle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      handle.addEventListener('dragstart', (event) => {
        dragged = card;
        originalIds = orderedCards(group).map((item) => item.dataset.contentId);
        card.classList.add('cvi-editor-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.dataset.contentId);
      });
      handle.addEventListener('dragend', async () => {
        if (!dragged) return;
        const movedCard = dragged;
        dragged = undefined;
        movedCard.classList.remove('cvi-editor-dragging');
        document.querySelectorAll('.cvi-editor-drop-target').forEach((item) => {
          item.classList.remove('cvi-editor-drop-target');
        });
        const ids = orderedCards(group).map((item) => item.dataset.contentId);
        if (ids.join('\n') === originalIds.join('\n')) return;

        showToast('Saving new order…');
        document.querySelectorAll('[data-order-drag]').forEach((item) => { item.draggable = false; });
        try {
          await api('order', {
            method: 'PUT',
            body: JSON.stringify({ kind: orderKindFromGroup(group), ids }),
          });
          showToast('Order saved.', 'success');
          window.setTimeout(() => window.location.reload(), 650);
        } catch (error) {
          showToast(`${error.message} Reloading the original order…`, 'error');
          window.setTimeout(() => window.location.reload(), 1300);
        }
      });

      card.addEventListener('dragover', (event) => {
        if (!dragged || dragged === card || dragged.dataset.orderGroup !== group) return;
        if (dragged.parentElement !== card.parentElement) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const parent = card.parentElement;
        const rectangle = card.getBoundingClientRect();
        const columns = getComputedStyle(parent).gridTemplateColumns
          .split(/\s+/)
          .filter(Boolean).length;
        const before = columns > 1
          && Math.abs(event.clientY - (rectangle.top + rectangle.height / 2)) < rectangle.height * 0.35
          ? event.clientX < rectangle.left + rectangle.width / 2
          : event.clientY < rectangle.top + rectangle.height / 2;
        parent.insertBefore(dragged, before ? card : card.nextSibling);
        document.querySelectorAll('.cvi-editor-drop-target').forEach((item) => {
          if (item !== card) item.classList.remove('cvi-editor-drop-target');
        });
        card.classList.add('cvi-editor-drop-target');
      });
      card.addEventListener('drop', (event) => {
        if (dragged?.dataset.orderGroup === group) event.preventDefault();
      });
    });
  }

  function installInlineEditButtons() {
    document.querySelectorAll('[data-inline-edit], [data-inline-project-field]').forEach((region) => {
      if (region.querySelector(':scope > [data-inline-edit-button]')) return;
      const key = region.dataset.inlineEdit;
      const projectId = region.dataset.inlineProjectId;
      const projectField = region.dataset.inlineProjectField;
      if (!key && !(projectId && projectField)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cvi-editor-inline-edit';
      button.dataset.inlineEditButton = '';
      const label = region.dataset.inlineLabel || 'this text';
      button.setAttribute('aria-label', `Edit ${label}`);
      button.title = `Edit ${label}`;
      button.innerHTML = `
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12.9 3.4 16.6 7.1 7.2 16.5l-4.4.8.8-4.4 9.3-9.5Z" />
          <path d="m10.9 5.4 3.7 3.7" />
        </svg>`;
      region.classList.add('cvi-editor-inline-editable');
      region.append(button);
    });
  }

  function positionInlinePopover(button) {
    const buttonRect = button.getBoundingClientRect();
    const popoverRect = inlinePopover.getBoundingClientRect();
    const margin = 12;
    const left = Math.min(
      window.innerWidth - popoverRect.width - margin,
      Math.max(margin, buttonRect.right - popoverRect.width),
    );
    let top = buttonRect.bottom + 8;
    if (top + popoverRect.height > window.innerHeight - margin) {
      top = Math.max(margin, buttonRect.top - popoverRect.height - 8);
    }
    inlinePopover.style.left = `${left}px`;
    inlinePopover.style.top = `${top}px`;
  }

  function closeInlineEditor({ restoreFocus = true } = {}) {
    const button = inlineTarget?.querySelector(':scope > [data-inline-edit-button]');
    inlinePopover.hidden = true;
    inlinePopover.style.removeProperty('left');
    inlinePopover.style.removeProperty('top');
    inlineStatus.textContent = '';
    inlineStatus.dataset.kind = '';
    inlineTarget = undefined;
    inlineEditContext = undefined;
    inlinePopover.dataset.format = '';
    if (restoreFocus) button?.focus();
  }

  async function openInlineEditor(button) {
    inlineTarget = button.closest('[data-inline-edit], [data-inline-project-field]');
    const key = inlineTarget?.dataset.inlineEdit;
    const projectId = inlineTarget?.dataset.inlineProjectId;
    const projectField = inlineTarget?.dataset.inlineProjectField;
    if (!key && !(projectId && projectField)) return;
    const requestedTarget = inlineTarget;

    inlinePopover.hidden = false;
    inlineTextarea.value = '';
    inlineTextarea.disabled = true;
    inlineFieldLabel.textContent = 'Text';
    inlineHelp.textContent = 'Loading…';
    inlineSource.textContent = '';
    inlineStatus.textContent = '';
    positionInlinePopover(button);

    try {
      let result;
      if (projectId && projectField) {
        const item = await api(`item?type=project&id=${encodeURIComponent(projectId)}`);
        const projectFields = {
          title: { value: item.data.title, format: 'text' },
          subtitle: { value: item.data.subtitle, format: 'text' },
          tags: { value: (item.data.tags ?? []).join('\n'), format: 'lines' },
          imageCaption: { value: item.data.image?.caption, format: 'text' },
          body: { value: item.body, format: 'markdown' },
        };
        const selectedField = projectFields[projectField];
        if (!selectedField || typeof selectedField.value !== 'string') {
          throw new Error('This project field cannot be edited inline.');
        }
        inlineEditContext = { kind: 'project', item, field: projectField };
        result = { ...selectedField, sourcePath: item.sourcePath };
      } else {
        result = await api(`copy?key=${encodeURIComponent(key)}`);
        inlineEditContext = { kind: 'copy', key };
      }
      if (inlineTarget !== requestedTarget) return;
      inlineTextarea.value = result.value;
      inlineTextarea.disabled = false;
      inlinePopover.dataset.format = result.format;
      inlineTextarea.rows = result.format === 'markdown'
        ? 18
        : result.format === 'lines'
          ? Math.min(12, Math.max(5, result.value.split('\n').length + 1))
          : 7;
      inlineFieldLabel.textContent = inlineTarget.dataset.inlineLabel
        || (result.format === 'lines' ? 'One item per line' : result.format === 'markdown' ? 'Markdown' : 'Text');
      inlineHelp.textContent = result.format === 'lines'
        ? 'Keep one list item or line in each row.'
        : result.format === 'markdown'
          ? 'Use Markdown headings, paragraphs, and lists. Write inline formulas as $…$ and display formulas as $$…$$ or \\[…\\]. Keep at least one ## section heading.'
          : 'Plain text only; formatting is controlled by the website design.';
      inlineSource.textContent = result.sourcePath;
      positionInlinePopover(button);
      inlineTextarea.focus();
      inlineTextarea.select();
    } catch (error) {
      inlineHelp.textContent = '';
      inlineStatus.textContent = error.message;
      inlineStatus.dataset.kind = 'error';
    }
  }

  async function api(path, options) {
    const response = await fetch(editorUrl(`/__editor/api/${path}`), {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(value.error || `Request failed with status ${response.status}`);
    return value;
  }

  const field = (label, name, value, options = {}) => {
    const { help, type = 'text', required = false, min, step, readonly = false } = options;
    return `
      <label class="cvi-editor-field">
        <span>${escapeHtml(label)}${required ? ' <b>*</b>' : ''}</span>
        <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value ?? '')}"
          ${required ? 'required' : ''} ${readonly ? 'readonly' : ''} ${min != null ? `min="${min}"` : ''} ${step != null ? `step="${step}"` : ''}>
        ${help ? `<small>${escapeHtml(help)}</small>` : ''}
      </label>`;
  };

  const textarea = (label, name, value, options = {}) => `
    <label class="cvi-editor-field">
      <span>${escapeHtml(label)}${options.required ? ' <b>*</b>' : ''}</span>
      <textarea name="${escapeHtml(name)}" rows="${options.rows ?? 4}" ${options.required ? 'required' : ''}>${escapeHtml(value ?? '')}</textarea>
      ${options.help ? `<small>${escapeHtml(options.help)}</small>` : ''}
    </label>`;

  const select = (label, name, value, choices) => `
    <label class="cvi-editor-field">
      <span>${escapeHtml(label)}</span>
      <select name="${escapeHtml(name)}">
        ${choices.map(([choiceValue, choiceLabel]) => `<option value="${choiceValue}" ${value === choiceValue ? 'selected' : ''}>${escapeHtml(choiceLabel)}</option>`).join('')}
      </select>
    </label>`;

  function closeCreateForm() {
    createContainer.hidden = true;
    createContainer.innerHTML = '';
    formContainer.hidden = false;
    if (state.id && [...itemSelect.options].some((option) => option.value === state.id)) {
      itemSelect.value = state.id;
    }
  }

  async function cancelCreateForm() {
    const fallbackId = state.items.some((item) => item.id === state.id)
      ? state.id
      : state.items[0]?.id;
    closeCreateForm();
    if (fallbackId) await loadItem(fallbackId);
    else {
      state.id = undefined;
      state.item = undefined;
      renderForm();
      setStatus('No existing entries yet.');
    }
  }

  async function showCreateForm() {
    const creationType = state.type;
    itemSelect.value = newEntryValue;
    createContainer.innerHTML = '<p class="cvi-editor-create__loading">Preparing a new entry…</p>';
    createContainer.hidden = false;
    formContainer.hidden = true;
    setStatus(creationType === 'project' ? 'Loading publications…' : '');

    let publications = [];
    if (creationType === 'project') {
      try {
        publications = (await api('items?type=publication')).items;
      } catch (error) {
        await cancelCreateForm();
        setStatus(error.message, 'error');
        return;
      }
    }
    if (state.type !== creationType) return;

    const settings = {
      project: {
        noun: 'project',
        nameLabel: 'Project title',
        idLabel: 'Project URL name',
        idHelp: 'This becomes the project page address. It is generated from the title; change it only if you want a shorter address.',
        placeholder: 'e.g. language-guided-scene-generation',
      },
      publication: {
        noun: 'publication',
        nameLabel: 'Publication title',
        idLabel: 'Internal publication ID',
        idHelp: 'This is the source filename used to connect a publication to a project. Website visitors will not see it.',
        placeholder: 'e.g. author-2026-short-title',
      },
      person: {
        noun: 'person',
        nameLabel: 'Person’s name',
        idLabel: 'Internal person ID',
        idHelp: 'This is the source filename. Website visitors will not see it.',
        placeholder: 'e.g. first-last',
      },
    }[creationType];
    const hasPublications = creationType !== 'project' || publications.length > 0;
    const publicationField = creationType === 'project' ? `
      <label class="cvi-editor-field">
        <span>Linked publication <b>*</b></span>
        <select name="publication" required ${hasPublications ? '' : 'disabled'}>
          <option value="">Select a publication…</option>
          ${publications.map((publication) => `<option value="${escapeHtml(publication.id)}">${escapeHtml(publication.title)}</option>`).join('')}
        </select>
        <small>${hasPublications
          ? 'The publication supplies the citation and paper links for this project.'
          : 'Create the publication first, then return here to create its project page.'}</small>
      </label>` : '';

    createContainer.innerHTML = `
      <form data-editor-create="${creationType}">
        <header class="cvi-editor-create__header">
          <span>New entry</span>
          <h3 id="cvi-editor-create-title">Create a new ${settings.noun}</h3>
          <p>Start with the identifying information. After creation, the full editing form will open.</p>
        </header>
        ${field(settings.nameLabel, 'displayName', '', { required: true })}
        <label class="cvi-editor-field">
          <span>${settings.idLabel} <b>*</b></span>
          <input name="identifier" type="text" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxlength="80" autocomplete="off" spellcheck="false" placeholder="${settings.placeholder}">
          <small data-create-id-help>${settings.idHelp}</small>
        </label>
        ${creationType === 'project' ? '<p class="cvi-editor-create__preview">Page address: <code data-create-preview>/projects/your-project/</code></p>' : ''}
        ${publicationField}
        <div class="cvi-editor-create__actions">
          <button type="button" data-create-cancel>Cancel</button>
          <button class="cvi-editor-create__submit" type="submit" ${hasPublications ? '' : 'disabled'}>Create ${settings.noun}</button>
        </div>
      </form>`;
    setStatus('');

    const form = createContainer.querySelector('form');
    const nameInput = form.elements.displayName;
    const idInput = form.elements.identifier;
    const idHelp = form.querySelector('[data-create-id-help]');
    const preview = form.querySelector('[data-create-preview]');
    let customIdentifier = false;

    const updateIdentifierState = () => {
      const duplicate = state.items.some((item) => item.id === idInput.value);
      idInput.setCustomValidity(duplicate ? 'An entry already uses this identifier.' : '');
      idHelp.textContent = duplicate
        ? 'This identifier is already in use. Choose another one.'
        : settings.idHelp;
      idHelp.dataset.kind = duplicate ? 'error' : '';
      if (preview) preview.textContent = `/projects/${idInput.value || 'your-project'}/`;
    };

    nameInput.addEventListener('input', () => {
      if (!customIdentifier) idInput.value = identifierFrom(nameInput.value);
      updateIdentifierState();
    });
    idInput.addEventListener('input', () => {
      idInput.value = identifierFrom(idInput.value);
      customIdentifier = idInput.value !== identifierFrom(nameInput.value);
      updateIdentifierState();
    });
    idInput.addEventListener('blur', () => {
      idInput.value = identifierFrom(idInput.value);
      customIdentifier = idInput.value !== identifierFrom(nameInput.value);
      updateIdentifierState();
    });
    nameInput.focus();
  }

  function projectForm(item) {
    const data = item.data;
    return `
      <form data-editor-form="project">
        <div class="cvi-editor-source">Editing <code>${escapeHtml(item.sourcePath)}</code></div>
        ${field('Project title', 'title', data.title, { required: true })}
        ${textarea('Subtitle', 'subtitle', data.subtitle, { required: true, rows: 3 })}
        ${textarea('Card summary', 'summary', data.summary, { required: true, rows: 4 })}
        ${field('Linked publication ID', 'publication', data.publication, { required: true, help: 'Internal publication ID (the filename without .yaml).' })}
        <fieldset>
          <legend>Project image</legend>
          ${field('Image path or URL', 'imageSrc', data.image?.src, { required: true })}
          ${textarea('Image description', 'imageAlt', data.image?.alt, { required: true, rows: 2 })}
          ${textarea('Image caption/source', 'imageCaption', data.image?.caption, { required: true, rows: 2 })}
        </fieldset>
        ${textarea('Tags', 'tags', (data.tags ?? []).join('\n'), { required: true, rows: 4, help: 'One tag per line' })}
        <label class="cvi-editor-checkbox"><input name="featured" type="checkbox" ${data.featured ? 'checked' : ''}> Feature on Home page</label>
        ${textarea('Detailed project page (Markdown)', 'body', item.body, { required: true, rows: 24, help: 'Use ##/### headings. Write inline formulas as $…$ and display formulas as $$…$$ or \\[…\\].' })}
        <div class="cvi-editor-actions">
          <button class="cvi-editor-save" type="submit">Save project</button>
          <button class="cvi-editor-linked" type="button" data-linked-publication="${escapeHtml(data.publication)}">Edit linked publication</button>
          <button class="cvi-editor-delete" type="button" data-delete-item>Delete project</button>
        </div>
      </form>`;
  }

  function publicationForm(item) {
    const data = item.data;
    return `
      <form data-editor-form="publication">
        <div class="cvi-editor-source">Editing <code>${escapeHtml(item.sourcePath)}</code></div>
        ${textarea('Publication title', 'title', data.title, { required: true, rows: 3 })}
        ${textarea('Authors', 'authors', (data.authors ?? []).join('\n'), { required: true, rows: 5, help: 'One author per line, in display order' })}
        ${field('Full venue name', 'venue', data.venue, { required: true })}
        <div class="cvi-editor-grid">
          ${field('Venue tag', 'venueShort', data.venueShort)}
          ${field('Year', 'year', data.year, { type: 'number', required: true })}
          ${field('Month', 'month', data.month)}
          ${field('Pages/article', 'pages', data.pages)}
        </div>
        ${field('Related project ID', 'project', data.project, { readonly: true, help: 'Managed automatically from the linked publication field in the project editor.' })}
        <fieldset>
          <legend>External links</legend>
          ${field('Project website', 'projectUrl', data.links?.project)}
          ${field('Paper URL', 'paperUrl', data.links?.paper)}
          ${field('Code URL', 'codeUrl', data.links?.code)}
        </fieldset>
        ${textarea('BibTeX', 'bibtex', data.bibtex, { rows: 14, help: 'Optional while a newly accepted paper is waiting for its finalized citation.' })}
        <div class="cvi-editor-actions">
          <button class="cvi-editor-save" type="submit">Save publication</button>
          <button class="cvi-editor-delete" type="button" data-delete-item>Delete publication</button>
        </div>
      </form>`;
  }

  function personForm(item) {
    const data = item.data;
    return `
      <form data-editor-form="person">
        <div class="cvi-editor-source">Editing <code>${escapeHtml(item.sourcePath)}</code></div>
        ${field('Name', 'name', data.name, { required: true })}
        <div class="cvi-editor-grid">
          ${select('Status', 'status', data.status, [['current', 'Current member'], ['alumni', 'Alumnus']])}
          ${select('Category', 'category', data.category, [
            ['pi', 'Principal investigator'],
            ['postdoc', 'Postdoctoral'],
            ['visiting', 'Visiting scholar'],
            ['phd', 'PhD'],
            ['masters', 'Master’s'],
            ['undergraduate', 'Undergraduate'],
          ])}
        </div>
        ${field('Role/title', 'role', data.role, { required: true })}
        ${field('Avatar path', 'avatar', data.avatar, { required: true })}
        ${field('Email', 'email', data.email)}
        ${textarea('Research interests', 'researchInterests', data.researchInterests, { rows: 3 })}
        ${textarea('Biography paragraphs', 'biography', (data.biography ?? []).join('\n\n'), { rows: 8, help: 'Separate paragraphs with a blank line.' })}
        <div class="cvi-editor-conditional" data-person-category="pi" ${data.category === 'pi' ? '' : 'hidden'}>
          ${textarea('PI research description', 'research', data.research, { rows: 5 })}
        </div>
        <fieldset class="cvi-editor-conditional" data-person-status="alumni" ${data.status === 'alumni' ? '' : 'hidden'}>
          <legend>Alumni details</legend>
          ${field('Current position', 'currentPosition', data.currentPosition)}
          ${field('Current organization', 'currentOrganization', data.currentOrganization)}
          ${field('Location', 'location', data.location)}
          ${field('Profile link', 'link', data.link)}
        </fieldset>
        <div class="cvi-editor-actions">
          <button class="cvi-editor-save" type="submit">Save person</button>
          <button class="cvi-editor-delete" type="button" data-delete-item>Delete person</button>
        </div>
      </form>`;
  }

  function updatePersonConditionalFields(form) {
    if (!form?.matches('[data-editor-form="person"]')) return;
    const statusValue = form.elements.status.value;
    const categoryValue = form.elements.category.value;
    form.querySelectorAll('[data-person-status]').forEach((section) => {
      section.hidden = section.dataset.personStatus !== statusValue;
    });
    form.querySelectorAll('[data-person-category]').forEach((section) => {
      section.hidden = section.dataset.personCategory !== categoryValue;
    });
  }

  function renderForm() {
    if (!state.item) {
      formContainer.innerHTML = '<p class="cvi-editor-empty">No content item selected.</p>';
      return;
    }
    formContainer.innerHTML = state.type === 'project'
      ? projectForm(state.item)
      : state.type === 'publication'
        ? publicationForm(state.item)
        : personForm(state.item);
    updatePersonConditionalFields(formContainer.querySelector('form'));
  }

  async function loadItem(id) {
    if (!id) return;
    setStatus('Loading…');
    try {
      state.item = await api(`item?type=${encodeURIComponent(state.type)}&id=${encodeURIComponent(id)}`);
      state.id = id;
      itemSelect.value = id;
      renderForm();
      setStatus('');
      persistState();
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }

  async function loadType(type, preferredId, options = {}) {
    closeCreateForm();
    state.type = type;
    state.item = undefined;
    if (options.newEntry) state.id = undefined;
    shell.querySelectorAll('[data-editor-type]').forEach((button) => {
      button.setAttribute('aria-current', button.dataset.editorType === type ? 'page' : 'false');
    });
    setStatus(`Loading ${typeLabels[type].toLowerCase()}…`);
    formContainer.innerHTML = '';
    if (options.newEntry) {
      itemSelect.innerHTML = `<option value="${newEntryValue}">New Entry</option>`;
    }
    try {
      const result = await api(`items?type=${encodeURIComponent(type)}`);
      state.items = result.items;
      itemSelect.innerHTML = `
        <option value="${newEntryValue}">New Entry</option>
        ${result.items.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join('')}`;
      if (options.newEntry) {
        await showCreateForm();
        return;
      }
      const id = result.items.some((item) => item.id === preferredId) ? preferredId : result.items[0]?.id;
      if (id) await loadItem(id);
      else {
        state.id = undefined;
        await showCreateForm();
      }
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }

  async function openEditor(context = inferredContext(), options = {}) {
    if (!context) return;
    state.open = true;
    panel.hidden = false;
    backdrop.hidden = false;
    launch.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('cvi-editor-open');
    await loadType(context.type, context.id, { newEntry: options.newEntry });
    persistState();
  }

  function closeEditor() {
    state.open = false;
    panel.hidden = true;
    backdrop.hidden = true;
    launch.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('cvi-editor-open');
    persistState();
    if (!launch.hidden) launch.focus();
  }

  installCardEditButtons();
  installSortables();
  installInlineEditButtons();
  launch.addEventListener('click', () => {
    if (pageContext) openEditor({ type: pageContext.type }, { newEntry: true });
  });
  closeButton.addEventListener('click', closeEditor);
  backdrop.addEventListener('click', closeEditor);
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-card-edit]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    openEditor({ type: button.dataset.editType, id: button.dataset.editId });
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-inline-edit-button]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    openInlineEditor(button);
  });
  document.addEventListener('pointerdown', (event) => {
    if (inlinePopover.hidden || inlinePopover.contains(event.target) || event.target.closest('[data-inline-edit-button]')) return;
    closeInlineEditor({ restoreFocus: false });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !inlinePopover.hidden) {
      closeInlineEditor();
      return;
    }
    if (event.key !== 'Escape' || !state.open) return;
    if (!createContainer.hidden) {
      cancelCreateForm();
      return;
    }
    closeEditor();
  });
  inlinePopover.addEventListener('click', (event) => {
    if (event.target.closest('[data-inline-close], [data-inline-cancel]')) closeInlineEditor();
  });
  inlineForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const context = inlineEditContext;
    if (!context) return;
    inlineForm.querySelectorAll('button, textarea').forEach((control) => { control.disabled = true; });
    inlineStatus.textContent = 'Saving…';
    inlineStatus.dataset.kind = '';
    try {
      let result;
      if (context.kind === 'project') {
        const value = inlineTextarea.value.trim();
        if (!value) throw new Error('Project text cannot be empty.');
        const data = structuredClone(context.item.data);
        let body = context.item.body;
        if (context.field === 'title') data.title = value;
        else if (context.field === 'subtitle') data.subtitle = value;
        else if (context.field === 'tags') {
          const tags = lines(value);
          if (!tags.length) throw new Error('Add at least one project tag.');
          data.tags = tags;
        } else if (context.field === 'imageCaption') data.image.caption = value;
        else if (context.field === 'body') body = value;
        else throw new Error('This project field cannot be edited inline.');
        result = await api('item', {
          method: 'PUT',
          body: JSON.stringify({ type: 'project', id: context.item.id, data, body }),
        });
      } else {
        result = await api('copy', {
          method: 'PUT',
          body: JSON.stringify({ key: context.key, value: inlineTextarea.value }),
        });
      }
      inlineStatus.textContent = `Saved. Backup: ${result.backup}`;
      inlineStatus.dataset.kind = 'success';
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      inlineStatus.textContent = error.message;
      inlineStatus.dataset.kind = 'error';
      inlineForm.querySelectorAll('button, textarea').forEach((control) => { control.disabled = false; });
      inlineTextarea.focus();
    }
  });
  shell.querySelector('.cvi-editor-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-editor-type]');
    if (button) loadType(button.dataset.editorType);
  });
  itemSelect.addEventListener('change', () => {
    if (itemSelect.value === newEntryValue) {
      showCreateForm();
      return;
    }
    closeCreateForm();
    loadItem(itemSelect.value);
  });
  shell.querySelector('.cvi-editor-new').addEventListener('click', showCreateForm);

  createContainer.addEventListener('click', async (event) => {
    if (!event.target.closest('[data-create-cancel]')) return;
    await cancelCreateForm();
    itemSelect.focus();
  });

  createContainer.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const creationType = form.dataset.editorCreate;
    const formData = new FormData(form);
    const id = formData.get('identifier').trim();
    const displayName = formData.get('displayName').trim();
    const seed = creationType === 'person'
      ? { name: displayName }
      : { title: displayName };
    if (creationType === 'project') seed.publication = formData.get('publication').trim();

    setStatus(`Creating ${creationType}…`);
    form.querySelectorAll('button, input, select').forEach((control) => { control.disabled = true; });
    try {
      await api('item', {
        method: 'POST',
        body: JSON.stringify({ type: creationType, id, seed }),
      });
      closeCreateForm();
      await loadType(creationType, id);
      setStatus('Created. Complete the remaining fields and save.', 'success');
    } catch (error) {
      setStatus(error.message, 'error');
      form.querySelectorAll('button, input, select').forEach((control) => { control.disabled = false; });
    }
  });

  formContainer.addEventListener('change', (event) => {
    if (!event.target.matches('[name="status"], [name="category"]')) return;
    updatePersonConditionalFields(event.target.form);
  });

  formContainer.addEventListener('click', (event) => {
    const linked = event.target.closest('[data-linked-publication]');
    if (linked) loadType('publication', linked.dataset.linkedPublication);

    const deleteButton = event.target.closest('[data-delete-item]');
    if (!deleteButton || !state.item) return;
    const label = state.item.data.title ?? state.item.data.name ?? state.id;
    const confirmed = window.confirm(
      `Delete "${label}" from the website?\n\nThe source file will be moved to a recoverable backup.`,
    );
    if (!confirmed) return;

    setStatus('Deleting…');
    formContainer.querySelectorAll('button, input, textarea, select').forEach((control) => {
      control.disabled = true;
    });
    api('item', {
      method: 'DELETE',
      body: JSON.stringify({ type: state.type, id: state.id }),
    }).then((result) => {
      setStatus(`Deleted. Recoverable backup: ${result.backup}`, 'success');
      const destination = state.type === 'project'
        ? '/projects/'
        : state.type === 'publication'
          ? '/publications/'
          : '/people/';
      window.setTimeout(() => {
        window.location.href = editorUrl(destination);
      }, 900);
    }).catch((error) => {
      setStatus(error.message, 'error');
      formContainer.querySelectorAll('button, input, textarea, select').forEach((control) => {
        control.disabled = false;
      });
    });
  });

  formContainer.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const original = state.item.data;
    let data;
    let body;

    if (state.type === 'project') {
      data = {
        ...original,
        title: formData.get('title').trim(),
        subtitle: formData.get('subtitle').trim(),
        summary: formData.get('summary').trim(),
        publication: formData.get('publication').trim(),
        image: {
          ...original.image,
          src: formData.get('imageSrc').trim(),
          alt: formData.get('imageAlt').trim(),
          caption: formData.get('imageCaption').trim(),
        },
        tags: lines(formData.get('tags')),
        featured: formData.get('featured') === 'on',
      };
      body = formData.get('body');
    } else if (state.type === 'publication') {
      data = {
        ...original,
        title: formData.get('title').trim(),
        authors: lines(formData.get('authors')),
        venue: formData.get('venue').trim(),
        year: Number(formData.get('year')),
        links: {
          project: optional(formData.get('projectUrl')),
          paper: optional(formData.get('paperUrl')),
          code: optional(formData.get('codeUrl')),
        },
        bibtex: formData.get('bibtex').trim(),
      };
      for (const [key, value] of [
        ['venueShort', optional(formData.get('venueShort'))],
        ['month', optional(formData.get('month'))],
        ['pages', optional(formData.get('pages'))],
        ['project', optional(formData.get('project'))],
      ]) {
        if (value) data[key] = value;
        else delete data[key];
      }
      data.links = Object.fromEntries(Object.entries(data.links).filter(([, value]) => value));
    } else {
      data = {
        ...original,
        name: formData.get('name').trim(),
        status: formData.get('status'),
        category: formData.get('category'),
        role: formData.get('role').trim(),
        avatar: formData.get('avatar').trim(),
      };
      for (const [key, value] of [
        ['email', optional(formData.get('email'))],
        ['researchInterests', optional(formData.get('researchInterests'))],
        ['research', optional(formData.get('research'))],
        ['currentPosition', optional(formData.get('currentPosition'))],
        ['currentOrganization', optional(formData.get('currentOrganization'))],
        ['location', optional(formData.get('location'))],
        ['link', optional(formData.get('link'))],
      ]) {
        if (value) data[key] = value;
        else delete data[key];
      }
      const biography = paragraphs(formData.get('biography'));
      if (biography.length) data.biography = biography;
      else delete data.biography;
    }

    setStatus('Saving…');
    form.querySelectorAll('button, input, textarea, select').forEach((control) => { control.disabled = true; });
    try {
      const result = await api('item', {
        method: 'PUT',
        body: JSON.stringify({ type: state.type, id: state.id, data, body }),
      });
      state.item.data = data;
      if (body != null) state.item.body = body;
      setStatus(`Saved. Backup: ${result.backup}`, 'success');
      persistState();
      window.setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      setStatus(error.message, 'error');
      form.querySelectorAll('button, input, textarea, select').forEach((control) => { control.disabled = false; });
    }
  });

  let restoredEditor = false;
  try {
    const restored = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (restored?.open && typeLabels[restored.type]) {
      restoredEditor = true;
      openEditor({ type: restored.type, id: restored.id });
    }
  } catch {
    sessionStorage.removeItem(storageKey);
  }

  if (!restoredEditor && new URLSearchParams(window.location.search).get('edit') === '1') {
    openEditor();
  }
}
