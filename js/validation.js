/**
 * validation.js — validação do formulário de contato (contato.html).
 * Validação em tempo real (evento "input"/"blur") + bloqueio do submit
 * quando há campos inválidos, sem depender de nenhuma biblioteca externa.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById("name"),
      validate: (value) => value.trim().length >= 3,
      message: "Informe seu nome completo (mínimo 3 caracteres)."
    },
    email: {
      el: document.getElementById("email"),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Informe um e-mail válido, ex: nome@dominio.com."
    },
    phone: {
      el: document.getElementById("phone"),
      validate: (value) => value.trim() === "" || /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(value.trim()),
      message: "Informe um telefone válido, ex: (41) 98865-7834."
    },
    subject: {
      el: document.getElementById("subject"),
      validate: (value) => value.trim() !== "",
      message: "Selecione um assunto."
    },
    message: {
      el: document.getElementById("message"),
      validate: (value) => value.trim().length >= 10,
      message: "Sua mensagem deve ter pelo menos 10 caracteres."
    }
  };

  const charCounter = document.getElementById("message-counter");
  const messageMax = 500;

  if (charCounter && fields.message.el) {
    fields.message.el.addEventListener("input", () => {
      const len = fields.message.el.value.length;
      charCounter.textContent = `${len}/${messageMax}`;
    });
  }

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.el) return true;

    const group = field.el.closest(".form-group");
    const isValid = field.validate(field.el.value);

    if (group) {
      group.classList.toggle("has-error", !isValid);
      group.classList.toggle("has-success", isValid && field.el.value.trim() !== "");
      const errorEl = group.querySelector(".field-error");
      if (errorEl) errorEl.innerHTML = `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> ${field.message}`;
    }

    return isValid;
  }

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field.el) return;
    field.el.addEventListener("blur", () => validateField(key));
    field.el.addEventListener("input", () => {
      const group = field.el.closest(".form-group");
      if (group && group.classList.contains("has-error")) {
        validateField(key);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isFormValid = true;
    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) isFormValid = false;
    });

    const statusEl = document.getElementById("form-status");

    if (!isFormValid) {
      if (statusEl) {
        statusEl.innerHTML = '<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> Corrija os campos destacados antes de enviar.';
        statusEl.className = "form-status error";
      }
      const firstError = form.querySelector(".has-error input, .has-error textarea, .has-error select");
      firstError?.focus();
      return;
    }

    // Sem backend nesta atividade acadêmica: simulamos o envio bem-sucedido.
    if (statusEl) {
      statusEl.innerHTML = '<i class="bi bi-check-circle" aria-hidden="true"></i> Mensagem enviada com sucesso! Retornaremos em breve.';
      statusEl.className = "form-status success";
    }

    form.reset();
    if (charCounter) charCounter.textContent = `0/${messageMax}`;
    form.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("has-error", "has-success");
    });
  });
});
