import { generateId, nowISO } from "./utils.js";

const STORAGE_KEY = "word_trpg_data_v1";

function createEmptyData() {
  return {
    books: [],
    sections: [],
    words: [],
    studyRecords: []
  };
}

export function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptyData();
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      books: parsed.books || [],
      sections: parsed.sections || [],
      words: parsed.words || [],
      studyRecords: parsed.studyRecords || []
    };
  } catch (error) {
    console.error("데이터 파싱 실패:", error);
    return createEmptyData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function initData() {
  const existing = getData();
  if (
    existing.books.length ||
    existing.sections.length ||
    existing.words.length ||
    existing.studyRecords.length
  ) {
    return existing;
  }

  try {
    const response = await fetch("./data/defaultBooks.json");
    if (!response.ok) {
      throw new Error("기본 데이터 로드 실패");
    }
    const defaultData = await response.json();
    saveData(defaultData);
    return defaultData;
  } catch (error) {
    console.warn("기본 데이터 없이 빈 데이터로 시작합니다.", error);
    const empty = createEmptyData();
    saveData(empty);
    return empty;
  }
}

export function addBook(title) {
  const data = getData();
  const book = {
    id: generateId("book"),
    title: title.trim(),
    createdAt: nowISO()
  };
  data.books.push(book);
  saveData(data);
  return book;
}

export function deleteBook(bookId) {
  const data = getData();

  const relatedSectionIds = data.sections
    .filter((section) => section.bookId === bookId)
    .map((section) => section.id);

  const relatedWordIds = data.words
    .filter((word) => word.bookId === bookId)
    .map((word) => word.id);

  data.books = data.books.filter((book) => book.id !== bookId);
  data.sections = data.sections.filter((section) => section.bookId !== bookId);
  data.words = data.words.filter((word) => word.bookId !== bookId);
  data.studyRecords = data.studyRecords.filter(
    (record) => !relatedWordIds.includes(record.wordId)
  );

  saveData(data);
}

export function addSection(bookId, title) {
  const data = getData();
  const order =
    data.sections.filter((section) => section.bookId === bookId).length + 1;

  const section = {
    id: generateId("section"),
    bookId,
    title: title.trim(),
    order
  };

  data.sections.push(section);
  saveData(data);
  return section;
}

export function deleteSection(sectionId) {
  const data = getData();

  const wordIds = data.words
    .filter((word) => word.sectionId === sectionId)
    .map((word) => word.id);

  data.sections = data.sections.filter((section) => section.id !== sectionId);
  data.words = data.words.filter((word) => word.sectionId !== sectionId);
  data.studyRecords = data.studyRecords.filter(
    (record) => !wordIds.includes(record.wordId)
  );

  saveData(data);
}

export function addWord(wordData) {
  const data = getData();

  const word = {
    id: generateId("word"),
    bookId: wordData.bookId,
    sectionId: wordData.sectionId,
    word: wordData.word.trim(),
    meaning: wordData.meaning.trim(),
    pos: wordData.pos,
    tone: wordData.tone,
    tags: Array.isArray(wordData.tags) ? wordData.tags : [],
    example: wordData.example?.trim() || "",
    memo: wordData.memo?.trim() || "",
    createdAt: nowISO()
  };

  data.words.push(word);
  saveData(data);
  return word;
}

export function deleteWord(wordId) {
  const data = getData();
  data.words = data.words.filter((word) => word.id !== wordId);
  data.studyRecords = data.studyRecords.filter((record) => record.wordId !== wordId);
  saveData(data);
}

export function addStudyRecord(recordData) {
  const data = getData();
  const record = {
    id: generateId("record"),
    wordId: recordData.wordId,
    correct: Boolean(recordData.correct),
    userAnswer: recordData.userAnswer || "",
    studiedAt: nowISO()
  };
  data.studyRecords.push(record);
  saveData(data);
  return record;
}
