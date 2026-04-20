import {
  initData,
  getData,
  addBook,
  deleteBook,
  addSection,
  deleteSection,
  addWord,
  updateWord,
  deleteWord,
  toggleFavorite,
  isDuplicateWordInSection,
  getStorageSummary
} from '../core/storage.js';
import { getCurrentUser } from '../core/supabase.js';
import {
  POS_OPTIONS,
  TAG_OPTIONS,
  TONE_OPTIONS,
  getPosLabel,
  getTagLabel,
  getToneLabel
} from '../core/tags.js';
import { escapeHtml, formatDateTime } from '../core/utils.js';

let selectedBookId = null;
let selectedSectionId = null;
let editingWordId = null;
let entryDrafts = [];

/* =========================
   DOM refs
========================= */

const authGuard = document.getElementById('auth-guard');
const app = document.getElementById('archive-app');

const bookList = document.getElementById('bookList');
const sectionList = document.getElementById('sectionList');
const wordList = document.getElementById('wordList');

const bookTitleInput = document.getElementById('bookTitleInput');
const sectionTitleInput = document.getElementById('sectionTitleInput');

const selectedBookInfo = document.getElementById('selectedBookInfo');
const selectedSectionInfo = document.getElementById('selectedSectionInfo');

const wordForm = document.getElementById('wordForm');
const wordSearchInput = document.getElementById('wordSearchInput');
const wordFilterFavorite = document.getElementById('wordFilterFavorite');

const wordInput = document.getElementById('wordInput');
const meaningsInput = document.getElementById('meaningsInput');
const posSelect = document.getElementById('posSelect');
const toneSelect = document.getElementById('toneSelect');
const tagSelect = document.getElementById('tagSelect');
const exampleInput = document.getElementById('exampleInput');
const memoInput = document.getElementById('memoInput');

const cancelEditBtn = document.getElementById('cancelEditBtn');

/* =========================
   Dynamic editor refs
========================= */

let dynamicEntryArea = null;
let dynamicEntryList = null;
let addEntryBtn = null;
let entryHelpText = null;

/* =========================
   Basic helpers
========================= */

function getTagOptionsByPos(pos) {
  return TAG_OPTIONS.filter((item) => {
    if (!item.pos) return true;
    if (Array.isArray(item.pos)) return item.pos.includes(pos);
    return item.pos === pos;
  });
}

function parseMeaningLines(raw) {
  return String(raw ?? '')
    .split(/\n+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function makeEmptyEntryDraft() {
  return {
    id: null,
    pos: 'noun',
    meanings: [''],
    tone: 'neutral',
    tags: [],
    example: '',
    memo: ''
  };
}

function normalizeEntryDraft(entry) {
  return {
    id: entry?.id || null,
    pos: entry?.pos || 'noun',
    meanings: Array.isArray(entry?.meanings) && entry.meanings.length ? [...entry.meanings] : [''],
    tone: entry?.tone || 'neutral',
    tags: Array.isArray(entry?.tags) ? [...entry.tags] : [],
    example: String(entry?.example || ''),
    memo: String(entry?.memo || '')
  };
}

function ensureSelection() {
  const data = getData();

  if (!selectedBookId) selectedBookId = data.books[0]?.id || null;
  if (!data.books.some((book) => book.id === selectedBookId)) {
    selectedBookId = data.books[0]?.id || null;
  }

  const sections = data.sections
    .filter((section) => section.bookId === selectedBookId)
    .sort((a, b) => a.order - b.order);

  if (!selectedSectionId) selectedSectionId = sections[0]?.id || null;
  if (!sections.some((section) => section.id === selectedSectionId)) {
    selectedSectionId = sections[0]?.id || null;
  }
}

function getWordByIdLocal(wordId) {
  return getData().words.find((item) => item.id === wordId) || null;
}

function getFilteredWords() {
  const search = wordSearchInput.value.trim().toLowerCase();
  const favOnly = wordFilterFavorite.value === 'favorite';

  return getData().words.filter((word) => {
    if (word.sectionId !== selectedSectionId) return false;
    if (favOnly && !word.favorite) return false;

    if (!search) return true;

    const entryBlob = (word.entries || [])
      .flatMap((entry) => [
        ...(entry.meanings || []),
        entry.example || '',
        entry.memo || '',
        entry.pos || '',
        entry.tone || '',
        ...((entry.tags || []).map(String))
      ])
      .join(' ');

    const blob = [word.headword || word.word || '', entryBlob].join(' ').toLowerCase();
    return blob.includes(search);
  });
}

/* =========================
   Legacy field hiding + dynamic UI
========================= */

function hideLegacySingleEntryFields() {
  [
    meaningsInput,
    posSelect,
    toneSelect,
    tagSelect,
    exampleInput,
    memoInput
  ].forEach((element) => {
    if (!element) return;
    const wrapper = element.closest('.input-group') || element.closest('.form-block') || element.parentElement;
    if (wrapper) wrapper.style.display = 'none';
  });
}

function buildDynamicEntryEditor() {
  if (!wordForm || dynamicEntryArea) return;

  hideLegacySingleEntryFields();

  dynamicEntryArea = document.createElement('div');
  dynamicEntryArea.className = 'form-block';
  dynamicEntryArea.id = 'dynamicEntryArea';

  const title = document.createElement('div');
  title.className = 'study-sub';
  title.textContent = '품사별 entry';

  entryHelpText = document.createElement('div');
  entryHelpText.className = 'muted small-note';
  entryHelpText.textContent = '한 단어 아래에 여러 품사를 추가할 수 있습니다. 뜻은 줄바꿈으로 입력하세요.';

  dynamicEntryList = document.createElement('div');
  dynamicEntryList.id = 'dynamicEntryList';
  dynamicEntryList.className = 'entry-list';

  addEntryBtn = document.createElement('button');
  addEntryBtn.type = 'button';
  addEntryBtn.className = 'button';
  addEntryBtn.id = 'addEntryBtn';
  addEntryBtn.textContent = '품사 entry 추가';

  dynamicEntryArea.appendChild(title);
  dynamicEntryArea.appendChild(entryHelpText);
  dynamicEntryArea.appendChild(dynamicEntryList);
  dynamicEntryArea.appendChild(addEntryBtn);

  const submitRow = cancelEditBtn?.parentElement || null;
  if (submitRow) {
    wordForm.insertBefore(dynamicEntryArea, submitRow);
  } else {
    wordForm.appendChild(dynamicEntryArea);
  }
}

function createOptionsMarkup(options, currentValue) {
  return options
    .map((item) => {
      const value = item.value ?? item;
      const label = item.label ?? item;
      return `<option value="${escapeHtml(String(value))}" ${value === currentValue ? 'selected' : ''}>${escapeHtml(String(label))}</option>`;
    })
    .join('');
}

function renderEntryDrafts() {
  if (!dynamicEntryList) return;

  if (!entryDrafts.length) {
    entryDrafts = [makeEmptyEntryDraft()];
  }

  dynamicEntryList.innerHTML = entryDrafts
    .map((entry, index) => {
      const tagOptions = getTagOptionsByPos(entry.pos);

      return `
        <div class="list-item entry-editor-block" data-entry-index="${index}">
          <div class="word-head">
            <div>
              <strong>Entry ${index + 1}</strong>
              <div class="muted small-note">품사 · 뜻 · 태그 · 예문 · 메모</div>
            </div>
            <button
              type="button"
              class="button danger"
              data-entry-action="remove-entry"
              data-entry-index="${index}"
              ${entryDrafts.length === 1 ? 'disabled' : ''}
            >
              삭제
            </button>
          </div>

          <label class="input-group">
            <span>품사</span>
            <select data-entry-field="pos" data-entry-index="${index}">
              ${createOptionsMarkup(POS_OPTIONS, entry.pos)}
            </select>
          </label>

          <label class="input-group">
            <span>뜻</span>
            <textarea
              data-entry-field="meanings"
              data-entry-index="${index}"
              rows="4"
              placeholder="한 줄에 뜻 하나씩 입력"
            >${escapeHtml((entry.meanings || []).join('\n'))}</textarea>
          </label>

          <label class="input-group">
            <span>톤</span>
            <select data-entry-field="tone" data-entry-index="${index}">
              ${createOptionsMarkup(TONE_OPTIONS, entry.tone)}
            </select>
          </label>

          <label class="input-group">
            <span>태그</span>
            <select data-entry-field="tag" data-entry-index="${index}">
              <option value="">선택 안 함</option>
              ${tagOptions
                .map((item) => {
                  const selected = entry.tags?.[0] === item.value ? 'selected' : '';
                  return `<option value="${escapeHtml(item.value)}" ${selected}>${escapeHtml(item.label)}</option>`;
                })
                .join('')}
            </select>
          </label>

          <label class="input-group">
            <span>예문</span>
            <input
              type="text"
              data-entry-field="example"
              data-entry-index="${index}"
              value="${escapeHtml(entry.example || '')}"
              placeholder="예문"
            />
          </label>

          <label class="input-group">
            <span>메모</span>
            <textarea
              data-entry-field="memo"
              data-entry-index="${index}"
              rows="3"
              placeholder="메모"
            >${escapeHtml(entry.memo || '')}</textarea>
          </label>
        </div>
      `;
    })
    .join('');
}

function syncEntryDraftFromElement(element) {
  if (!element) return;

  const index = Number(element.dataset.entryIndex);
  const field = element.dataset.entryField;
  if (!Number.isInteger(index) || !entryDrafts[index]) return;

  const draft = entryDrafts[index];

  if (field === 'meanings') {
    draft.meanings = parseMeaningLines(element.value);
    if (!draft.meanings.length) draft.meanings = [''];
    return;
  }

  if (field === 'tag') {
    draft.tags = element.value ? [element.value] : [];
    return;
  }

  draft[field] = element.value;
}

function addEntryDraft() {
  entryDrafts.push(makeEmptyEntryDraft());
  renderEntryDrafts();
}

function removeEntryDraft(index) {
  if (entryDrafts.length <= 1) {
    entryDrafts = [makeEmptyEntryDraft()];
  } else {
    entryDrafts.splice(index, 1);
  }
  renderEntryDrafts();
}

/* =========================
   Renderers
========================= */

function renderOptions() {
  posSelect.innerHTML = POS_OPTIONS
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join('');

  toneSelect.innerHTML = TONE_OPTIONS
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join('');

  tagSelect.innerHTML =
    `<option value="">선택 안 함</option>` +
    TAG_OPTIONS.map((item) => `<option value="${item.value}">${item.label}</option>`).join('');
}

function renderBooks() {
  const data = getData();

  if (!data.books.length) {
    bookList.innerHTML = `<div class="empty-state">아직 책이 없습니다.</div>`;
    return;
  }

  bookList.innerHTML = data.books
    .map((book) => {
      const sectionCount = data.sections.filter((section) => section.bookId === book.id).length;
      const wordCount = data.words.filter((word) => word.bookId === book.id).length;

      return `
        <div class="list-item">
          <strong>${escapeHtml(book.title)}</strong>
          <div class="muted small-note">섹션 ${sectionCount}개 · 표제어 ${wordCount}개</div>
          <div class="small-actions">
            <button class="button ${book.id === selectedBookId ? 'primary' : ''}" data-action="select-book" data-id="${book.id}">
              ${book.id === selectedBookId ? '선택됨' : '선택'}
            </button>
            <button class="button danger" data-action="delete-book" data-id="${book.id}">
              삭제
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderSections() {
  const data = getData();
  const book = data.books.find((item) => item.id === selectedBookId);

  selectedBookInfo.textContent = book ? `선택한 책: ${book.title}` : '책을 선택하세요.';

  const sections = data.sections
    .filter((item) => item.bookId === selectedBookId)
    .sort((a, b) => a.order - b.order);

  if (!sections.length) {
    sectionList.innerHTML = `<div class="empty-state">아직 섹션이 없습니다.</div>`;
    return;
  }

  sectionList.innerHTML = sections
    .map((section) => {
      const wordCount = data.words.filter((word) => word.sectionId === section.id).length;

      return `
        <div class="list-item">
          <strong>${escapeHtml(section.title)}</strong>
          <div class="muted small-note">표제어 ${wordCount}개</div>
          <div class="small-actions">
            <button class="button ${section.id === selectedSectionId ? 'primary' : ''}" data-action="select-section" data-id="${section.id}">
              ${section.id === selectedSectionId ? '선택됨' : '선택'}
            </button>
            <button class="button danger" data-action="delete-section" data-id="${section.id}">
              삭제
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderWords() {
  const section = getData().sections.find((item) => item.id === selectedSectionId);
  selectedSectionInfo.textContent = section ? `선택한 섹션: ${section.title}` : '섹션을 선택하세요.';

  const words = getFilteredWords();

  if (!words.length) {
    wordList.innerHTML = `<div class="empty-state">조건에 맞는 단어가 없습니다.</div>`;
    return;
  }

  wordList.innerHTML = words
    .map((word) => {
      const entriesHtml = (word.entries || [])
        .map((entry) => {
          const tags = (entry.tags || [])
            .map((tag) => `<span class="tag">${escapeHtml(getTagLabel(entry.pos, tag))}</span>`)
            .join('');

          return `
            <div class="study-card" style="margin-top: 10px;">
              <div class="muted small-note">${getPosLabel(entry.pos)} · ${getToneLabel(entry.tone)}</div>
              <ul class="meaning-list">
                ${(entry.meanings || []).map((meaning) => `<li>${escapeHtml(meaning)}</li>`).join('')}
              </ul>
              <div>${tags}</div>
              ${entry.example ? `<div class="muted small-note">예문: ${escapeHtml(entry.example)}</div>` : ''}
              ${entry.memo ? `<div class="muted small-note">메모: ${escapeHtml(entry.memo)}</div>` : ''}
            </div>
          `;
        })
        .join('');

      return `
        <div class="list-item">
          <div class="word-head">
            <div>
              <strong>${escapeHtml(word.headword || word.word)}</strong>
              <div class="muted small-note">
                품사 ${word.entries?.length || 0}개 · ${formatDateTime(word.updatedAt)}
              </div>
            </div>
            <button class="favorite-btn ${word.favorite ? 'favorite-on' : ''}" data-action="favorite" data-id="${word.id}">
              ${word.favorite ? '⭐' : '☆'}
            </button>
          </div>

          ${entriesHtml}

          <div class="small-actions">
            <button class="button" data-action="edit-word" data-id="${word.id}">수정</button>
            <button class="button danger" data-action="delete-word" data-id="${word.id}">삭제</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderAll() {
  ensureSelection();
  renderBooks();
  renderSections();
  renderWords();
}

/* =========================
   Form state
========================= */

function resetWordForm() {
  editingWordId = null;
  wordForm.reset();
  entryDrafts = [makeEmptyEntryDraft()];
  renderEntryDrafts();

  if (toneSelect) toneSelect.value = 'neutral';
  if (posSelect) posSelect.value = 'noun';

  cancelEditBtn.classList.add('hidden');
}

function setEditMode(word) {
  editingWordId = word.id;
  wordInput.value = word.headword || word.word || '';

  entryDrafts = (word.entries || []).map((entry) =>
    normalizeEntryDraft({
      id: entry.id,
      pos: entry.pos,
      meanings: entry.meanings,
      tone: entry.tone,
      tags: entry.tags,
      example: entry.example,
      memo: entry.memo
    })
  );

  if (!entryDrafts.length) {
    entryDrafts = [makeEmptyEntryDraft()];
  }

  renderEntryDrafts();
  cancelEditBtn.classList.remove('hidden');
}

/* =========================
   Submit
========================= */

function collectValidEntries() {
  return entryDrafts
    .map((entry) => ({
      id: entry.id || undefined,
      pos: entry.pos || 'other',
      meanings: parseMeaningLines(entry.meanings),
      tone: entry.tone || 'neutral',
      tags: Array.isArray(entry.tags) ? entry.tags.filter(Boolean) : [],
      example: String(entry.example || '').trim(),
      memo: String(entry.memo || '').trim()
    }))
    .filter((entry) => entry.meanings.length > 0 || entry.example || entry.memo);
}

function hasDuplicatePos(entries) {
  const seen = new Set();

  for (const entry of entries) {
    const key = entry.pos || 'other';
    if (seen.has(key)) return true;
    seen.add(key);
  }

  return false;
}

function handleWordSubmit(event) {
  event.preventDefault();

  if (!selectedBookId || !selectedSectionId) return;

  const headword = wordInput.value.trim();
  if (!headword) return;

  if (isDuplicateWordInSection(selectedSectionId, headword, editingWordId)) {
    alert('같은 섹션에 같은 표제어가 이미 있습니다.');
    return;
  }

  const entries = collectValidEntries();
  if (!entries.length) {
    alert('최소 한 개 이상의 품사 entry를 입력해 주세요.');
    return;
  }

  if (hasDuplicatePos(entries)) {
    alert('같은 단어 안에서 같은 품사를 중복으로 넣을 수 없습니다.');
    return;
  }

  const payload = {
    bookId: selectedBookId,
    sectionId: selectedSectionId,
    headword,
    entries
  };

  if (editingWordId) {
    updateWord(editingWordId, payload);
  } else {
    addWord(payload);
  }

  resetWordForm();
  renderAll();
}

/* =========================
   Event wiring
========================= */

function attachEvents() {
  document.getElementById('addBookBtn')?.addEventListener('click', () => {
    const title = bookTitleInput.value.trim();
    if (!title) return;

    addBook(title);
    bookTitleInput.value = '';
    renderAll();
  });

  document.getElementById('addSectionBtn')?.addEventListener('click', () => {
    if (!selectedBookId) return;

    const title = sectionTitleInput.value.trim();
    if (!title) return;

    addSection(selectedBookId, title);
    sectionTitleInput.value = '';
    renderAll();
  });

  wordForm?.addEventListener('submit', handleWordSubmit);

  cancelEditBtn?.addEventListener('click', resetWordForm);

  wordSearchInput?.addEventListener('input', renderWords);
  wordFilterFavorite?.addEventListener('change', renderWords);

  bookList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'select-book') {
      selectedBookId = id;
      selectedSectionId = null;
    } else if (action === 'delete-book') {
      if (confirm('이 책을 삭제할까요?')) deleteBook(id);
    }

    renderAll();
  });

  sectionList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'select-section') {
      selectedSectionId = id;
    } else if (action === 'delete-section') {
      if (confirm('이 섹션을 삭제할까요?')) deleteSection(id);
    }

    renderAll();
  });

  wordList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === 'favorite') {
      toggleFavorite(id);
    } else if (action === 'edit-word') {
      const word = getWordByIdLocal(id);
      if (word) setEditMode(word);
    } else if (action === 'delete-word') {
      if (confirm('이 단어를 삭제할까요?')) deleteWord(id);
    }

    renderAll();
  });

  dynamicEntryList?.addEventListener('input', (event) => {
    const element = event.target.closest('[data-entry-field]');
    if (!element) return;
    syncEntryDraftFromElement(element);
  });

  dynamicEntryList?.addEventListener('change', (event) => {
    const element = event.target.closest('[data-entry-field]');
    if (!element) return;

    syncEntryDraftFromElement(element);

    if (element.dataset.entryField === 'pos') {
      const index = Number(element.dataset.entryIndex);
      if (Number.isInteger(index) && entryDrafts[index]) {
        entryDrafts[index].tags = [];
        renderEntryDrafts();
      }
    }
  });

  dynamicEntryList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-entry-action]');
    if (!button) return;

    const action = button.dataset.entryAction;
    const index = Number(button.dataset.entryIndex);

    if (action === 'remove-entry' && Number.isInteger(index)) {
      removeEntryDraft(index);
    }
  });

  addEntryBtn?.addEventListener('click', addEntryDraft);
}

/* =========================
   Init
========================= */

(async function init() {
  renderOptions();
  buildDynamicEntryEditor();

  const user = await getCurrentUser();
  if (!user) {
    authGuard.classList.remove('hidden');
    return;
  }

  await initData();

  const summary = getStorageSummary();
  document.title = `VOCA Quest - Archive (${summary.wordCount} words)`;

  app.classList.remove('hidden');

  entryDrafts = [makeEmptyEntryDraft()];
  renderEntryDrafts();
  attachEvents();
  renderAll();
  resetWordForm();
})();
