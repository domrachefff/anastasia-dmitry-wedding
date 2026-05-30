// ----------------------------
// GSAP
// ----------------------------

gsap.registerPlugin(ScrollTrigger);

// ----------------------------
// КОНВЕРТ
// ----------------------------

const envelope = document.querySelector('.envelope-wrapper');
const topPart = document.querySelector('.envelope-top');
const bottomPart = document.querySelector('.envelope-bottom');
const heroImage = document.querySelector('.hero-image');

let opened = false;

envelope.addEventListener('click', () => {

    if(opened) return;

    opened = true;

    gsap.to(topPart,{
        y:-180,
        duration:1.2,
        ease:"power3.inOut"
    });

    gsap.to(bottomPart,{
        y:180,
        duration:1.2,
        ease:"power3.inOut"
    });

    gsap.to('.seal',{
        scale:0,
        duration:.5
    });

    gsap.to(heroImage,{
        filter:"blur(0px)",
        scale:1,
        duration:2
    });

    setTimeout(()=>{
        document
        .getElementById("hero")
        .scrollIntoView({
            behavior:"smooth"
        });
    },1000);

});

// ----------------------------
// СТРЕЛКА
// ----------------------------

gsap.to(".scroll-indicator",{

    y:15,

    repeat:-1,

    yoyo:true,

    duration:1.2

});

// ----------------------------
// ТАЙМЕР
// ----------------------------

const weddingDate = new Date(
    "2026-09-26T15:00:00"
);

function updateTimer(){

    const now = new Date();

    const diff =
    weddingDate - now;

    if(diff <= 0) return;

    const days =
    Math.floor(
        diff / (1000*60*60*24)
    );

    const hours =
    Math.floor(
        (diff % (1000*60*60*24))
        /(1000*60*60)
    );

    const minutes =
    Math.floor(
        (diff % (1000*60*60))
        /(1000*60)
    );

    const seconds =
    Math.floor(
        (diff % (1000*60))
        /1000
    );

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

}

updateTimer();

setInterval(
    updateTimer,
    1000
);

// ----------------------------
// ТАЙМЛАЙН
// ----------------------------

gsap.to(".heart-marker",{

    y:650,

    ease:"none",

    scrollTrigger:{

        trigger:"#timeline",

        start:"top center",

        end:"bottom bottom",

        scrub:true

    }

});

// ----------------------------
// АНИМАЦИИ БЛОКОВ
// ----------------------------

gsap.utils.toArray("section")
.forEach(section=>{

    gsap.from(section,{

        opacity:0,

        y:80,

        duration:1,

        scrollTrigger:{

            trigger:section,

            start:"top 80%"

        }

    });

});

// ----------------------------
// СТИРАНИЕ ДАТЫ
// ----------------------------

let openedCards = 0;

function createScratch(id){

    const canvas =
    document.getElementById(id);

    const ctx =
    canvas.getContext("2d");

    canvas.width = 140;
    canvas.height = 140;

    ctx.fillStyle = "#b5a38f";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "18px Montserrat";

    ctx.textAlign = "center";

    ctx.fillText(
        "СОТРИТЕ",
        70,
        75
    );

    let scratching = false;

    function scratch(e){

        if(!scratching) return;

        const rect =
        canvas.getBoundingClientRect();

        const x =
        (e.touches
        ? e.touches[0].clientX
        : e.clientX)
        - rect.left;

        const y =
        (e.touches
        ? e.touches[0].clientY
        : e.clientY)
        - rect.top;

        ctx.globalCompositeOperation =
        "destination-out";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            18,
            0,
            Math.PI*2
        );

        ctx.fill();
    }

    canvas.addEventListener(
        "mousedown",
        ()=> scratching = true
    );

    canvas.addEventListener(
        "mouseup",
        ()=>{
            scratching = false;
            checkReveal(canvas);
        }
    );

    canvas.addEventListener(
        "mousemove",
        scratch
    );

    canvas.addEventListener(
        "touchstart",
        ()=> scratching = true
    );

    canvas.addEventListener(
        "touchend",
        ()=>{
            scratching = false;
            checkReveal(canvas);
        }
    );

    canvas.addEventListener(
        "touchmove",
        scratch
    );

}

function checkReveal(canvas){

    const ctx =
    canvas.getContext("2d");

    const pixels =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    ).data;

    let transparent = 0;

    for(let i=3;i<pixels.length;i+=4){

        if(pixels[i] === 0){

            transparent++;

        }

    }

    const percent =
    transparent /
    (pixels.length / 4);

    if(percent > 0.45){

        if(canvas.style.pointerEvents !== "none"){

            canvas.style.pointerEvents = "none";

            openedCards++;

        }

        if(openedCards === 3){

            document
            .getElementById("date-reveal")
            .classList.add("show");

            document
            .getElementById("invited-text")
            .classList.add("show");

        }

    }

}

createScratch("scratch-day");
createScratch("scratch-month");
createScratch("scratch-year");

// ----------------------------
// ЛЕПЕСТКИ
// ----------------------------

const canvas =
document.getElementById("petals");

const ctx =
canvas.getContext("2d");

function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

const petals = [];

for(let i=0;i<40;i++){

    petals.push({

        x:Math.random()*canvas.width,

        y:Math.random()*canvas.height,

        size:8+Math.random()*8,

        speed:1+Math.random()*2,

        drift:Math.random()*2

    });

}

function drawPetals(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    petals.forEach(p=>{

        ctx.beginPath();

        ctx.ellipse(
            p.x,
            p.y,
            p.size,
            p.size*0.6,
            Math.PI/4,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        "rgba(255,220,220,.8)";

        ctx.fill();

        p.y += p.speed;

        p.x += Math.sin(p.y/50)*p.drift;

        if(p.y > canvas.height){

            p.y = -20;

            p.x =
            Math.random()*canvas.width;

        }

    });

    requestAnimationFrame(
        drawPetals
    );

}

drawPetals();