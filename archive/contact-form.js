document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const toast = document.getElementById("toast");
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("nutricode-lead", JSON.stringify(data));
  toast.innerHTML = "Спасибо. Ваш запрос отправлен специалисту.<br />В ближайшее время Ксения с вами свяжется.";
  toast.style.display = "block";
  form.reset();
});
