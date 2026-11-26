const editor = document.getElementById("codeEditor");
const preview = document.getElementById("preview");
const starterCode = editor.value;
const defaultQuiz = {
  question: "HTML 中，哪个标签通常用来表示一段普通文字？",
  correct: "b"
};

function updatePreview() {
  // srcdoc 把编辑器里的 HTML 放进预览框中显示
  preview.srcdoc = editor.value;
}
editor.addEventListener("input", updatePreview);
updatePreview();

document.getElementById("restoreCode").addEventListener("click", () => {
  editor.value = starterCode;
  updatePreview();
});

function getProgress() {
  try { return JSON.parse(localStorage.getItem("codelab-progress")) || { lessons: [], quizDone: false }; }
  catch { return { lessons: [], quizDone: false }; }
}
function saveProgress(progress) {
  localStorage.setItem("codelab-progress", JSON.stringify(progress));
  renderProgress();
}
function renderProgress() {
  const p = getProgress();
  const count = p.lessons.length;
  document.getElementById("completedCount").textContent = count;
  const percent = Math.round(count / 6 * 100);
  document.getElementById("progressPercent").textContent = percent + "%";
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("streakCount").textContent = count ? "1" : "0";
}
document.querySelector('[data-lesson="html"]').addEventListener("click", () => {
  const p = getProgress();
  if (!p.lessons.includes("html-intro")) p.lessons.push("html-intro");
  saveProgress(p);
  document.getElementById("practice").scrollIntoView({behavior:"smooth"});
});

document.querySelectorAll(".answer").forEach(button => {
  button.addEventListener("click", () => {
    const feedback = document.getElementById("quizFeedback");
    const all = document.querySelectorAll(".answer");
    all.forEach(b => { b.disabled = true; });
    if (button.dataset.answer === defaultQuiz.correct) {
      button.classList.add("correct");
      feedback.textContent = "答对了！<p> 标签表示段落（paragraph），适合放一段普通文字。";
      const p = getProgress(); p.quizDone = true; saveProgress(p);
    } else {
      button.classList.add("wrong");
      document.querySelector('[data-answer="b"]').classList.add("correct");
      feedback.textContent = "再记一下：<p> 表示段落；<h1> 是一级标题；<img> 用来显示图片。";
    }
    document.getElementById("nextQuiz").classList.remove("hidden");
  });
});
document.getElementById("nextQuiz").addEventListener("click", () => {
  document.querySelectorAll(".answer").forEach(b => { b.disabled = false; b.classList.remove("correct","wrong"); });
  document.getElementById("quizFeedback").textContent = "选择一个答案，看看你是否掌握了这个知识点。";
  document.getElementById("nextQuiz").classList.add("hidden");
});
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("确定清除本浏览器保存的学习进度吗？")) {
    localStorage.removeItem("codelab-progress");
    renderProgress();
  }
});
renderProgress();
