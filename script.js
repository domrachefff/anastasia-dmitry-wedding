const RSVP_EMAIL = "dimarudenko19997@gmail.com";
const WEDDING_DATE = new Date("2026-09-26T15:00:00+03:00");

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const intro = document.querySelector(".intro");
const body = document.body;

function openInvitation() {
  if (intro.classList.contains("is-open")) return;
  intro.classList.add("is-open");
  body.classList.add("has-opened");
  window.setTimeout(() => {
    body.classList.remove("is-locked");
  }, 1250);
}

intro.addEventListener("click", openInvitation);
intro.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openInvitation();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
);

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

function setupScratchCards() {
  const cards = [...document.querySelectorAll(".scratch-card")];
  const dateSection = document.querySelector(".date-section");

  cards.forEach((card) => {
    const canvas = card.querySelector("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let isDrawing = false;
    let dpr = window.devicePixelRatio || 1;
    let checkFrame = 0;

    function drawCover() {
      const rect = card.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#f4f7f8");
      gradient.addColorStop(0.35, "#cddde4");
      gradient.addColorStop(0.55, "#ffffff");
      gradient.addColorStop(1, "#b7cfda");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.strokeStyle = "rgba(255,255,255,0.46)";
      ctx.lineWidth = 1;
      for (let x = -rect.height; x < rect.width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, rect.height);
        ctx.lineTo(x + rect.height, 0);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(40, 57, 64, 0.45)";
      ctx.font = "700 13px Segoe UI, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("потрите", rect.width / 2, rect.height / 2);
    }

    function scratch(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const radius = Math.max(26, Math.min(rect.width, rect.height) * 0.22);

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      cancelAnimationFrame(checkFrame);
      checkFrame = requestAnimationFrame(checkProgress);
    }

    function checkProgress() {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = image.data.length / 4;
      let cleared = 0;

      for (let i = 3; i < image.data.length; i += 4) {
        if (image.data[i] < 35) cleared += 1;
      }

      if (cleared / pixels > 0.3) {
        card.classList.add("is-revealed");
        canvas.style.pointerEvents = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (cards.every((item) => item.classList.contains("is-revealed"))) {
          dateSection.classList.add("is-complete");
        }
      }
    }

    canvas.addEventListener("pointerdown", (event) => {
      isDrawing = true;
      canvas.setPointerCapture(event.pointerId);
      scratch(event);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (isDrawing) scratch(event);
    });

    canvas.addEventListener("pointerup", () => {
      isDrawing = false;
    });

    canvas.addEventListener("pointercancel", () => {
      isDrawing = false;
    });

    canvas.addEventListener("mousedown", (event) => {
      isDrawing = true;
      scratch(event);
    });

    window.addEventListener("mousemove", (event) => {
      if (isDrawing) scratch(event);
    });

    window.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    canvas.addEventListener(
      "touchstart",
      (event) => {
        isDrawing = true;
        scratch(event.touches[0]);
        event.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      (event) => {
        if (isDrawing) scratch(event.touches[0]);
        event.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener("touchend", () => {
      isDrawing = false;
    });

    drawCover();
    window.addEventListener("resize", () => {
      if (!card.classList.contains("is-revealed")) drawCover();
    });
  });
}

setupScratchCards();

function updateCountdown() {
  const now = Date.now();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now);
  const secondsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  const values = { days, hours, minutes, seconds };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-count="${key}"]`);
    if (node) node.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const root = document.documentElement;
let ticking = false;

function updateMotion() {
  const y = window.scrollY || 0;
  root.style.setProperty("--ribbon-a", `${Math.sin(y / 170) * 34}px`);
  root.style.setProperty("--ribbon-b", `${Math.cos(y / 150) * 38}px`);
  updateTimeline();
  ticking = false;
}

function requestMotionUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateMotion);
    ticking = true;
  }
}

window.addEventListener("scroll", requestMotionUpdate, { passive: true });
window.addEventListener("resize", requestMotionUpdate);
window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
});

const timelineSection = document.querySelector(".timeline-section");
const timelinePath = document.querySelector("#timelinePath");
const timelineHeart = document.querySelector("#timelineHeart");
const timelineItems = [...document.querySelectorAll(".timeline-item")];
let pathLength = 0;

function setupTimelinePath() {
  if (!timelinePath) return;
  pathLength = timelinePath.getTotalLength();
  timelinePath.style.strokeDasharray = pathLength;
  timelinePath.style.strokeDashoffset = pathLength;
}

function updateTimeline() {
  if (!timelineSection || !timelinePath || !pathLength) return;

  const rect = timelineSection.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  const progress = clamp((-rect.top + window.innerHeight * 0.08) / Math.max(1, travel));
  const point = timelinePath.getPointAtLength(pathLength * progress);

  timelinePath.style.strokeDashoffset = pathLength * (1 - progress);
  timelineHeart.setAttribute("transform", `translate(${point.x} ${point.y})`);

  timelineItems.forEach((item) => {
    const pointValue = Number(item.dataset.point);
    item.classList.toggle("is-active", progress + 0.035 >= pointValue);
  });
}

setupTimelinePath();
updateMotion();

const rsvpForm = document.querySelector("#rsvpForm");
const formStatus = document.querySelector("#formStatus");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const guestName = String(formData.get("guestName") || "").trim();

  if (!guestName) {
    formStatus.textContent = "Пожалуйста, укажите имя и фамилию.";
    return;
  }

  const subject = encodeURIComponent("Подтверждение присутствия на свадьбе");
  const bodyText = encodeURIComponent(
    `Здравствуйте! Подтверждаю присутствие на свадьбе 26.09.2026.\n\nИмя и фамилия: ${guestName}`
  );
  const receiver = RSVP_EMAIL.includes("example.com") ? "" : RSVP_EMAIL;

  formStatus.textContent = receiver
    ? "Спасибо! Открываем почтовое приложение для отправки."
    : "Спасибо! Открываем почтовое приложение. Для реальной отправки замените почту в script.js.";

  window.location.href = `mailto:${receiver}?subject=${subject}&body=${bodyText}`;
});

function setupPetals() {
  const petals = document.querySelector(".petals");
  if (!petals) return;

  const count = window.matchMedia("(max-width: 640px)").matches ? 18 : 28;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.style.setProperty("--petal-x", `${Math.random() * 100}%`);
    petal.style.setProperty("--petal-delay", `${Math.random() * -12}s`);
    petal.style.setProperty("--petal-duration", `${9 + Math.random() * 8}s`);
    petal.style.setProperty("--petal-drift", `${-28 + Math.random() * 56}px`);
    petal.style.setProperty("--petal-scale", `${0.62 + Math.random() * 0.72}`);
    fragment.appendChild(petal);
  }

  petals.appendChild(fragment);
}

setupPetals();
