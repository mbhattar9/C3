"use strict";

function setUpTestimonials(){
  if(testimonialsList){
    let tHolder = document.querySelector(".carousel-content-holder");
    let bHolder = document.querySelector(".carousel-button-holder")
    tHolder.innerHTML = "";
    bHolder.innerHTML = "";

    // create buttons
    let backButton = document.createElement("button");
    backButton.setAttribute("type", "button");
    backButton.classList.add("carousel-button");
    backButton.classList.add("back-button");
    backButton.addEventListener("click", carouselBack);
    bHolder.append(backButton);

    let forwardButton = document.createElement("button");
    forwardButton.setAttribute("type", "button");
    forwardButton.classList.add("carousel-button");
    forwardButton.classList.add("forward-button");
    forwardButton.addEventListener("click", carouselForward);

    // create testimonials
    for(let i=0;i<testimonialsList.length;i++){
      let t = testimonialsList[i];
      let id = "t-"+i;

      let g = document.createElement("div");
          g.classList.add("testimonial");
          g.setAttribute("id", id);
          if(i===0){
            g.classList.add("current");
          }else if(i===1){
            g.classList.add("next");
          }else if(i===testimonialsList.length-1){
            g.classList.add("prev");
          }

      let oG = document.createElement("div");
          oG.classList.add("testimonial-img-group");

      let img = document.createElement("img");
          img.setAttribute("src", "img/"+t.img);
          img.setAttribute("alt", "");
          img.classList.add("testimonial-img");

      let tG = document.createElement("div");
          tG.classList.add("testimonial-title");
      let n = document.createElement("span");
          n.textContent = t.name;
          n.classList.add("t-name");

      tG.append(n);

      let p = document.createElement("p");
          p.textContent = t.text;
          p.classList.add("testimonial-text");

      tG.append(p);

      oG.append(img);
      oG.append(tG);

      g.append(oG);

      tHolder.append(g);

      // make button associated with this testimonial
      let b = document.createElement("button");
      b.setAttribute("type", "button");
      b.setAttribute("id","b-"+i);
      b.classList.add("carousel-button");
      b.classList.add("circle-button");
      b.addEventListener("click", function(){ carouselSelect(i); });
      if(i===0){
        b.classList.add("active");
      }

      bHolder.append(b);
    }
    bHolder.append(forwardButton)

    // behavior
    let current = 0;
    let moving = false;
    let total = testimonialsList.length;

    // these portions adapted from: https://medium.com/@marcusmichaels/how-to-build-a-carousel-from-scratch-in-vanilla-js-9a096d3b98c9

    function moveCarouselTo(slide) {
      if(!moving) {
        // temporarily disable interactivity
        disableInteraction();
  
        // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
        let newPrevious = slide - 1,
            newNext = slide + 1;

          // Check if current slide is at the beginning or end and sets slide numbers
          if (slide === 0) {
            newPrevious = (total - 1);
          } else if (slide === (total -1)) {
            newPrevious = (slide - 1);
            newNext = 0;
          }
    
          // reset current prev/next slides
          document.querySelector(".testimonial.prev").classList.remove("prev");
          document.querySelector(".testimonial.next").classList.remove("next");
          document.querySelector(".testimonial.current").classList.remove("current");
  
          // update new classes
          document.querySelector("#t-"+newPrevious).classList.add("prev");
          document.querySelector("#t-"+slide).classList.add("current");
          document.querySelector("#t-"+newNext).classList.add("next");
          //
          document.querySelector(".circle-button.active").classList.remove("active");
          document.querySelector("#b-"+slide).classList.add("active");

      }
    }


    function disableInteraction() {
      moving = true;
  
      setTimeout(function(){
        moving = false
      }, 500);
    }

    function carouselBack(){
      // move carousel one back
      if (!moving) {
        // If it's the first slide, set as the last slide, else -1
        if (current === 0) {
          current = (total - 1);
        } else {
          current--;
        }
        // Move carousel to updated slide
        moveCarouselTo(current);
      }
    }
    function carouselForward(){
      //  move carousel one forward
      if (!moving) {
        // If it's the last slide, reset to 0, else +1
        if (current === (total - 1)) {
          current = 0;
        } else {
          current++;
        }
        // Move carousel to updated slide
        moveCarouselTo(current);
      }
    }
    function carouselSelect(id){
      // select specific carousel item
      // note: this only slides if they are next to each other; otherwise blinks in
      if(!moving){
          current = id;
          moveCarouselTo(current);
      }

    }
  }
}

function setUpPartners(){
  if(partnersList){
    let holder = document.querySelector("#partners-group");
    holder.innerHTML = "";
    
    for(let i=0;i<partnersList.length;i++){
        let p = partnersList[i];

        let g = document.createElement("div");
            g.classList.add("partner");

        let l = document.createElement("img");
          l.setAttribute("alt", p.name);
          l.setAttribute("src", "img/"+p.img);
          if(p.img==="swcap_logo.jpg"){
            l.classList.add("long");
          }else if(p.img==="dp_logo.jpg"){
            l.classList.add("short");
          }else if(p.img==="prc_logo.jpg"){
            l.classList.add("full");
          }
          l.classList.add("partner-logo");

        let n = document.createElement("h3");
            n.classList.add("partner-name");
        let t = document.createElement("span");
            t.textContent = p.name;
        let w = document.createElement("a");
            w.classList.add("partner-website");
            w.textContent = "Website";

        n.append(t);
        n.append(w);

        let s = document.createElement("p");
            s.classList.add("partner-statement");
            s.textContent = p.text;

        g.append(l);
        g.append(n);
        g.append(s);
        holder.append(g);
    }
  }
}

function setUpBios(){
    if(biosList){
        let holder = document.querySelector("#bios-group");
        holder.innerHTML = "";

        for(let i=0;i<biosList.length;i++){
            let b = biosList[i];
            // b.name, b.title, b.photo, b.bio
            let g = document.createElement("div");
            g.classList.add("person-group");

            let p = document.createElement("img");
            p.classList.add("person-photo");
            p.setAttribute("src", "img/"+b.photo);
            p.setAttribute("alt", b.name);
            
            let gI = document.createElement("div");
            gI.classList.add("person-inner");

            let n = document.createElement("h3");
            n.classList.add("person-name");
            n.textContent = b.name;

            let t = document.createElement("p");
            t.classList.add("person-title");
            t.textContent = b.title;

            let bio = document.createElement("p");
            bio.classList.add("person-bio");
            bio.textContent = b.bio;

            gI.append(n);
            gI.append(t);
            gI.append(bio);

            g.append(p);
            g.append(gI);
            holder.append(g);

        }
    }
}

setUpPartners();
setUpBios();
setUpTestimonials();