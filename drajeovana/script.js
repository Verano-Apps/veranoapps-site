const EMAIL_CONFIG = {
    // TROQUE AQUI o e-mail que deve receber a mensagem.
    toEmail: "pedraoh498@gmail.com",

    // TROQUE AQUI com suas credenciais do EmailJS.
    publicKey: "1Lqg-FDTIhZLQWX_7",
    serviceId: "service_0ncum9q",
    templateId: "template_w68y7sy",
};

// ALTERE AQUI a data mostrada e enviada no e-mail.
const APPOINTMENT_DATE = "domingo, 19/04";

const state = {
    selectedOption: "",
};

const elements = {
    steps: document.querySelectorAll("[data-step]"),
    yesButton: document.getElementById("yesButton"),
    noButton: document.getElementById("noButton"),
    noModal: document.getElementById("noModal"),
    closeNoModal: document.getElementById("closeNoModal"),
    changeMindButton: document.getElementById("changeMindButton"),
    successModal: document.getElementById("successModal"),
    closeSuccessModal: document.getElementById("closeSuccessModal"),
    backToIntro: document.getElementById("backToIntro"),
    backToOptions: document.getElementById("backToOptions"),
    choiceButtons: document.querySelectorAll(".choice-card"),
    selectedOptionLabel: document.getElementById("selectedOptionLabel"),
    notes: document.getElementById("notes"),
    confirmButton: document.getElementById("confirmButton"),
    statusMessage: document.getElementById("statusMessage"),
};

function showStep(stepName) {
    elements.steps.forEach((step) => {
        const isActive = step.dataset.step === stepName;
        step.classList.toggle("is-active", isActive);
        step.setAttribute("aria-hidden", String(!isActive));
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleModal(modal, isOpen) {
    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", String(!isOpen));
}

function updateChoice(choice) {
    state.selectedOption = choice;
    elements.selectedOptionLabel.textContent = choice;

    elements.choiceButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.choice === choice);
    });
}

function updateStatus(message, tone = "") {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.remove("is-error", "is-success");

    if (tone) {
        elements.statusMessage.classList.add(tone);
    }
}

function resetExperience() {
    state.selectedOption = "";
    elements.selectedOptionLabel.textContent = "Aguardando seleção";
    elements.notes.value = "";
    updateStatus("");

    elements.choiceButtons.forEach((button) => {
        button.classList.remove("is-selected");
    });

    toggleModal(elements.successModal, false);
    showStep("intro");
}

function hasEmailJsConfig() {
    return (
        EMAIL_CONFIG.publicKey &&
        EMAIL_CONFIG.serviceId &&
        EMAIL_CONFIG.templateId &&
        !EMAIL_CONFIG.publicKey.includes("AQUI") &&
        !EMAIL_CONFIG.serviceId.includes("AQUI") &&
        !EMAIL_CONFIG.templateId.includes("AQUI")
    );
}

function initEmailJs() {
    if (!hasEmailJsConfig()) {
        return;
    }

    if (window.emailjs?.init) {
        window.emailjs.init({
            publicKey: EMAIL_CONFIG.publicKey,
        });
    }
}

function buildTemplateParams() {
    return {
        to_email: EMAIL_CONFIG.toEmail,
        subject: "Resposta da Dra. Jeovana Caroline",
        appointment_date: APPOINTMENT_DATE,
        selected_option: state.selectedOption,
        observations: elements.notes.value.trim() || "Sem observações adicionais.",
        message: [
            "Resposta da Dra. Jeovana Caroline",
            `Data escolhida: ${APPOINTMENT_DATE}`,
            `Opção escolhida: ${state.selectedOption}`,
            `Observações: ${elements.notes.value.trim() || "Sem observações adicionais."}`,
        ].join("\n"),
    };
}

async function sendWithEmailJs(templateParams) {
    await window.emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
    );
}

function sendWithMailto(templateParams) {
    const body = [
        "Resposta da Dra. Jeovana Caroline",
        "",
        `Data escolhida: ${templateParams.appointment_date}`,
        `Opção escolhida: ${templateParams.selected_option}`,
        `Observações: ${templateParams.observations}`,
    ].join("\n");

    const mailtoUrl =
        `mailto:${encodeURIComponent(EMAIL_CONFIG.toEmail)}` +
        `?subject=${encodeURIComponent(templateParams.subject)}` +
        `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
}

async function handleConfirmation() {
    if (!state.selectedOption) {
        updateStatus("Escolha primeiro o tipo da consulta para eu registrar direitinho.", "is-error");
        showStep("options");
        return;
    }

    const templateParams = buildTemplateParams();
    elements.confirmButton.disabled = true;
    updateStatus("Registrando a consulta com todo o carinho...", "");

    try {
        if (hasEmailJsConfig() && window.emailjs?.send) {
            await sendWithEmailJs(templateParams);
            updateStatus("Consulta enviada com sucesso. Domingo já ficou oficialmente mais bonito.", "is-success");
        } else {
            updateStatus(
                "EmailJS ainda não configurado. Vou abrir seu app de e-mail como plano B.",
                ""
            );
            sendWithMailto(templateParams);
        }

        toggleModal(elements.successModal, true);
    } catch (error) {
        console.error("Falha ao enviar consulta:", error);
        updateStatus(
            "Não consegui enviar automaticamente agora. Você pode revisar as chaves do EmailJS ou usar o fallback por e-mail.",
            "is-error"
        );
    } finally {
        elements.confirmButton.disabled = false;
    }
}

function registerEvents() {
    elements.yesButton.addEventListener("click", () => {
        showStep("options");
    });

    elements.noButton.addEventListener("click", () => {
        toggleModal(elements.noModal, true);
    });

    elements.closeNoModal.addEventListener("click", () => {
        toggleModal(elements.noModal, false);
    });

    elements.changeMindButton.addEventListener("click", () => {
        toggleModal(elements.noModal, false);
        showStep("options");
    });

    elements.closeSuccessModal.addEventListener("click", () => {
        resetExperience();
    });

    elements.backToIntro.addEventListener("click", () => {
        showStep("intro");
    });

    elements.backToOptions.addEventListener("click", () => {
        showStep("options");
    });

    elements.choiceButtons.forEach((button) => {
        button.addEventListener("click", () => {
            updateChoice(button.dataset.choice);
            updateStatus("");
            showStep("final");
        });
    });

    elements.confirmButton.addEventListener("click", handleConfirmation);

    [elements.noModal, elements.successModal].forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                toggleModal(modal, false);
            }
        });
    });
}

function init() {
    initEmailJs();
    registerEvents();
    showStep("intro");
}

init();
