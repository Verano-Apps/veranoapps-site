/* =========================================================
   Missão: Primeiro Rolê — lógica da experiência
   Fluxo: intro → opções → confirmação (com gif) → final
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     1. Configuração das opções
     Cada opção define o gif e os textos da tela de confirmação.
     Para editar um rolê, mexa só aqui.
  ------------------------------------------------------- */
  const OPTIONS = {
    boho: {
      id: "boho",
      label: "Bohô Bar & Pista",
      local: "Centro de Florianópolis",
      gif: "drinking.gif",
      tag: "Centro",
      title: "Bohô Bar & Pista, então?",
      desc: "Temos muito o que conversar ainda, hein — aqui é bom pra isso.",
      done: "Vários hahaha e conversas boas.",
    },
    desgosto: {
      id: "desgosto",
      label: "Desgosto",
      local: "Festa e funk",
      gif: "dancing.gif",
      tag: "Centro",
      title: "Desgosto, é isso?",
      desc: "Se quer ouvir funk e beber, é aqui.",
      done: "Bebida, dança e funks duvidosos.",
    },
    sinuca: {
      id: "sinuca",
      label: "Midnight Club",
      local: "Sinuca • Trindade",
      gif: "sinuca.gif",
      tag: "Trindade",
      title: "Sinuca + lanche?",
      desc: "Quem perder vai ter que fazer algo que o outro pedir.",
      done: "Eu nunca fujo de um desafio.",
    },
  };

  /* Endpoint do backend (a ser implementado depois) */
  const ENDPOINT = "/api/escolha-role";

  /* -------------------------------------------------------
     2. Referências de DOM
  ------------------------------------------------------- */
  const screens = document.querySelectorAll(".screen");
  const dots = document.querySelectorAll(".progress__dot");

  const confirmGif = document.getElementById("confirm-gif");
  const confirmTag = document.getElementById("confirm-tag");
  const confirmTitle = document.getElementById("confirm-title");
  const confirmDesc = document.getElementById("confirm-desc");
  const doneDesc = document.getElementById("done-desc");
  const sendStatus = document.getElementById("send-status");
  const confetti = document.getElementById("confetti");

  let currentChoice = null;

  /* -------------------------------------------------------
     3. Navegação entre telas
  ------------------------------------------------------- */
  function goTo(screenId, step) {
    screens.forEach((s) => s.classList.toggle("is-active", s.id === screenId));
    if (step) updateProgress(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateProgress(step) {
    dots.forEach((dot) => {
      dot.classList.toggle("is-active", Number(dot.dataset.step) <= step);
    });
  }

  /* -------------------------------------------------------
     4. Monta a tela de confirmação para a opção escolhida
  ------------------------------------------------------- */
  function openConfirm(choiceKey) {
    const opt = OPTIONS[choiceKey];
    if (!opt) return;

    currentChoice = opt;
    confirmGif.src = opt.gif;
    confirmGif.alt = opt.label;
    confirmTag.textContent = opt.tag;
    confirmTitle.textContent = opt.title;
    confirmDesc.textContent = opt.desc;

    confirmGif.classList.remove("pop");
    void confirmGif.offsetWidth; // reinicia a animação
    confirmGif.classList.add("pop");

    goTo("screen-confirm", 3);
  }

  /* -------------------------------------------------------
     5. Confirmação final + envio ao backend
  ------------------------------------------------------- */
  async function confirmChoice() {
    if (!currentChoice) return;

    doneDesc.textContent = currentChoice.done;
    goTo("screen-done", 4);
    launchConfetti();
    sendChoice(currentChoice);
  }

  /* Chamada HTTP preparada — o backend deve receber e enviar o e-mail.
     Não implementa o servidor; apenas dispara a requisição. */
  async function sendChoice(opt) {
    setStatus("enviando sua escolha…", "");

    const payload = {
      choice: opt.id,
      label: opt.label,
      local: opt.local,
      // timestamp gerado no cliente; o backend pode reescrever se preferir
      chosenAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      setStatus("escolha salva com sucesso ✨", "is-ok");
    } catch (err) {
      // Não trava a experiência dela — só registra o erro pra você.
      console.error("Falha ao enviar a escolha:", err);
      setStatus("", "");
    }
  }

  function setStatus(msg, cls) {
    sendStatus.textContent = msg;
    sendStatus.className = "status" + (cls ? " " + cls : "");
  }

  /* -------------------------------------------------------
     6. Confetes (feedback visual da confirmação)
  ------------------------------------------------------- */
  function launchConfetti() {
    const colors = ["#fafafa", "#a3a3a3", "#737373", "#525252"];
    const total = 26;
    confetti.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const piece = document.createElement("span");
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      confetti.appendChild(piece);
    }

    // limpa depois que a animação termina
    setTimeout(() => (confetti.innerHTML = ""), 3600);
  }

  /* -------------------------------------------------------
     7. Eventos
  ------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    const choiceEl = e.target.closest("[data-choice]");

    if (choiceEl) {
      openConfirm(choiceEl.dataset.choice);
      return;
    }
    if (!actionEl) return;

    switch (actionEl.dataset.action) {
      case "start":
        goTo("screen-options", 2);
        break;
      case "back-to-intro":
        goTo("screen-intro", 1);
        break;
      case "back-to-options":
        goTo("screen-options", 2);
        break;
      case "confirm":
        confirmChoice();
        break;
      case "restart":
        currentChoice = null;
        setStatus("", "");
        goTo("screen-intro", 1);
        break;
    }
  });
})();
