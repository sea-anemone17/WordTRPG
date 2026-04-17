import { initData, getData, getRecentStudyStats } from "./storage.js";

async function main() {
  await initData();
  const data = getData();
  const recentStats = getRecentStudyStats();

  const bookCount = document.getElementById("bookCount");
  const sectionCount = document.getElementById("sectionCount");
  const wordCount = document.getElementById("wordCount");
  const recordCount = document.getElementById("recordCount");

  if (bookCount) bookCount.textContent = data.books.length;
  if (sectionCount) sectionCount.textContent = data.sections.length;
  if (wordCount) wordCount.textContent = data.words.length;

  if (recordCount) {
    recordCount.textContent = `최근 ${recentStats.total}문제 · 정확도 ${recentStats.accuracy}%`;
  }
}

main();
