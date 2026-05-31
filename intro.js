const envelope =
document.querySelector(".envelope-wrapper");

const topPart =
document.querySelector(".envelope-top");

const bottomPart =
document.querySelector(".envelope-bottom");

const seal =
document.querySelector(".wax-seal");

let opened = false;

envelope.addEventListener("click",()=>{

    if(opened) return;

    opened = true;

    gsap.to(seal,{

        scale:0,

        opacity:0,

        rotation:90,

        duration:.6

    });

    gsap.to(topPart,{

        y:-window.innerHeight,

        duration:1.8,

        ease:"power4.inOut"

    });

    gsap.to(bottomPart,{

        y:window.innerHeight,

        duration:1.8,

        ease:"power4.inOut"

    });

    setTimeout(()=>{

        gsap.to("#intro",{

            opacity:0,

            duration:1,

            onComplete:()=>{

                window.location.href =
                "invitation.html";

            }

        });

    },1200);

});