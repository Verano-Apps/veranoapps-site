const I18N = {
    "pt-BR": {
        "ui.theme": "Tema",

        "nav.apps": "Apps",
        "nav.about": "Sobre",
        "nav.contact": "Contato",

        "hero.kicker": "Estúdio independente",
        "hero.title": "Apps simples para problemas reais.",
        "hero.subtitle":
            "A Verano Apps cria produtos mobile claros, privados e úteis — começando por ferramentas do dia a dia.",
        "hero.ctaPrimary": "Ver apps",
        "hero.ctaSecondary": "Sobre a Verano",

        // ALTERADO: mensagem de marca (não promessa técnica eterna)
        "hero.note": "Privacidade por padrão. Clareza sempre. Sem ruído.",

        "apps.title": "Apps",
        "apps.subtitle": "Produtos pequenos, úteis e pensados para o uso real.",
        "apps.marmitrack.badge": "Android • Offline-first",
        "apps.marmitrack.desc":
            "Controle alimentar simples, offline e privado — com marmitas, metas e progresso diário.",

        // NOVO: promessa técnica por app
        "apps.marmitrack.privacy": "Sem login. Sem anúncios. Sem coleta de dados.",

        "apps.marmitrack.play": "Disponível na Google Play →",
        "apps.gestao.badge": "Android • Firebase • Freemium",
        "apps.gestao.title": "Verano Gestão",
        "apps.gestao.desc":
            "Gestão simples para pequenos negócios: clientes, serviços, agenda e visão financeira em um só lugar.",
        "apps.gestao.details":
            "Produto em evolução, pensado para rotina real, clareza e agilidade.",

        "status.inprogress": "Em produção",
        "status.published": "Online",

        "about.title": "Sobre",
        "about.subtitle":
            "Um estúdio independente criando aplicativos pequenos, bem cuidados e úteis no dia a dia.",
        "about.principles.title": "Princípios",
        "about.principles.p1": "Simplicidade antes de complexidade",
        "about.principles.p2": "Privacidade por padrão",
        "about.principles.p3": "Design limpo e funcional",
        "about.story.title": "História",
        "about.story.text":
            "A Verano Apps nasceu como um estúdio independente para criar aplicativos reais, simples e bem cuidados — do primeiro lançamento aos próximos produtos.",

        "contact.title": "Contato",
        "contact.subtitle": "Feedback e oportunidades são bem-vindos.",
        "contact.emailLabel": "Email:",

        "footer.tagline": "Minimalista • Privado • Útil",
    },

    en: {
        "ui.theme": "Theme",

        "nav.apps": "Apps",
        "nav.about": "About",
        "nav.contact": "Contact",

        "hero.kicker": "Independent app studio",
        "hero.title": "Simple apps for real problems.",
        "hero.subtitle":
            "Verano Apps creates clear, private and useful mobile products — starting with everyday tools.",
        "hero.ctaPrimary": "View apps",
        "hero.ctaSecondary": "About Verano",

        // ALTERADO
        "hero.note": "Privacy by default. Always clear. No noise.",

        "apps.title": "Apps",
        "apps.subtitle": "Small, useful products designed for real use.",
        "apps.marmitrack.badge": "Android • Offline-first",
        "apps.marmitrack.desc":
            "Simple, offline and private food tracking — with meals, goals and daily progress.",

        // NOVO
        "apps.marmitrack.privacy": "No login. No ads. No data collection.",

        "apps.marmitrack.play": "Available on Google Play →",
        "apps.gestao.badge": "Android • Firebase • Freemium",
        "apps.gestao.title": "Verano Gestão",
        "apps.gestao.desc":
            "Simple management for small businesses: clients, services, scheduling, and financial clarity in one place.",
        "apps.gestao.details":
            "An evolving product designed for real routines, clarity, and speed.",

        "status.inprogress": "In progress",
        "status.published": "Live",

        "about.title": "About",
        "about.subtitle":
            "An independent studio creating small, thoughtful and useful apps for everyday life.",
        "about.principles.title": "Principles",
        "about.principles.p1": "Simplicity before complexity",
        "about.principles.p2": "Privacy by default",
        "about.principles.p3": "Clean, functional design",
        "about.story.title": "Story",
        "about.story.text":
            "Verano Apps started as an independent studio to create real, simple and thoughtful apps — from the first launch to the next products.",

        "contact.title": "Contact",
        "contact.subtitle": "Feedback and opportunities are welcome.",
        "contact.emailLabel": "Email:",

        "footer.tagline": "Minimal • Private • Useful",
    },
};

const STORAGE = {
    lang: "verano_lang",
    theme: "verano_theme",
};

function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE.theme, theme);
}

function setLanguage(lang) {
    const dict = I18N[lang] || I18N.en;

    document.documentElement.lang = lang === "pt-BR" ? "pt-BR" : "en";
    localStorage.setItem(STORAGE.lang, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = dict[key];
        if (typeof value !== "string") return;
        el.textContent = value;
    });

    const pill = document.getElementById("langPill");
    if (pill) pill.textContent = lang === "pt-BR" ? "PT" : "EN";
}

function init() {
    document.getElementById("year").textContent = new Date().getFullYear();

    applyTheme(getPreferredTheme());
    document.getElementById("themeToggle")?.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
    });

    const savedLang = localStorage.getItem(STORAGE.lang);
    const defaultLang = savedLang || "pt-BR";
    setLanguage(defaultLang);

    document.getElementById("langToggle")?.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE.lang) || defaultLang;
        setLanguage(current === "pt-BR" ? "en" : "pt-BR");
    });
}

init();
