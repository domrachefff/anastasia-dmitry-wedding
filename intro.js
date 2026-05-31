const envelope = document.querySelector('.envelope-wrapper');
const flap =
document.querySelector('.envelope-flap');
const letter =
document.querySelector('.letter');
const seal = document.querySelector('.seal');

let opened = false;

envelope.addEventListener('click', () => {

    if(opened) return;

    opened = true;

    gsap.to(seal,{
        scale:0,
        rotation:180,
        duration:0.6
    });

    gsap.to(flap,{

        rotateX:-180,

        duration:1.3,

        ease:"power3.inOut"

    });

    gsap.to(letter,{

        y:-170,

        duration:1.4,

        ease:"power3.inOut"

    });

    gsap.to("#intro",{
        scale:1.03,
        duration:1.5
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

    },1400);

});