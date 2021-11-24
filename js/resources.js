"use strict";

let categoriesR = [];
let categoriesO = [];
let searchTerm = "";
let filtersR = [];
let filtersO = [];
let allData;

function setUpDropdowns(){
    // build and add behavior
    categoriesR.sort(function(a,b){
        return a > b ? 1 : a < b ? -1 : 0;
    });
    categoriesO.sort(function(a,b){
        return a > b ? 1 : a < b ? -1 : 0;
    });

    let rDrop = document.querySelector("#resource-drops");
    let oDrop = document.querySelector("#organization-drops");

    for(let i=0;i<categoriesR.length;i++){
        let li = buildLi(categoriesR[i], "resources");
        rDrop.append(li);
    }
    for(let i=0;i<categoriesO.length;i++){
        let li = buildLi(categoriesO[i], "organizations");
        oDrop.append(li);
    }
    
    // dropdown button behavior
    let dropdowns = document.querySelectorAll(".dropdown-button");
    for(let i=0;i<dropdowns.length;i++){
        dropdowns[i].addEventListener("click", toggleDropdown);
    }

    function buildLi(v, c){
        let li = document.createElement("li");
        li.classList.add("check-holder");

        let l = document.createElement("label");
        let i = document.createElement("input");
            i.checked = true; // start all checked
            i.setAttribute("type", "checkbox");
            i.setAttribute("tabindex", "-1");
            i.setAttribute("value", v);
            i.setAttribute("name", c);
            i.addEventListener("click", checkboxClick)
        let d = document.createElement("div");
            d.classList.add("checkbox-overlay");
        let s = document.createElement("span");
            s.classList.add("checkbox-text");
            s.textContent = v;

        if(c==="resources"){
          filtersR.push(v);
        }else if(c==="organizations"){
          filtersO.push(v);
        }

        l.append(i);
        l.append(d);
        l.append(s);

        li.append(l);

        return li;
    }

    function checkboxClick(e){
        if(e.target){
          let val = e.target.value;
          let grp = e.target.name;
          let checked = e.target.checked;
          if(grp === "resources"){
            if(checked === true && !filtersR.includes(val)){
              filtersR.push(val);
            }else{
              // remove from group
              filtersR = filtersR.filter(function(f){ return f!==val; });
            }
          }else if(grp === "organizations"){
            if(checked === true && !filtersO.includes(val)){
              filtersO.push(val);
            }else{
              // remove from group
              filtersO = filtersO.filter(function(f){ return f!==val; });
            }
          }
        }
        buildRows();
    }

}
function setUpSearch(){
    // add behavior
    // search Title, Description
    let search = document.querySelector("#search");
    let searchFunc = function(){
      searchTerm = search.value;
      buildRows();
    }
    search.addEventListener("keyup", debounceFunc(searchFunc));

    function debounceFunc(func, timeout){
        let timer;
        if(!timeout){
            timeout = 500;
        }
        return () => {
          clearTimeout(timer);
          timer = setTimeout(() => { func(); }, timeout);
        };
    }
}

function anyFilters(){
  // return true/false
  let filters = false;
  if(searchTerm !== "" && searchTerm !== " "){
    filters = true;
  }
  if(filtersR.length > 0 && filtersR.length !== categoriesR.length){
    filters = true;
  }
  if(filtersO.length > 0 && filtersO.length !== categoriesO.length){
    filters = true;
  }
  return filters;
}

function buildRows(){
    let holder = document.querySelector("#results");
    holder.innerHTML = "";

    // if filters are on, use here
    let filteredData = [];
    let filters = anyFilters();
    if(!filters){
      filteredData = allData;
    }else{
      // use filters
      let sUse = (searchTerm !=="" && searchTerm !== " ");
      let oUse = filtersO.length > 0 && filtersO.length !== categoriesO.length;
      let rUse = filtersR.length > 0 && filtersR.length !== categoriesR.length;

      filteredData = allData.filter(function(f){
        let s = sUse ? (f.Title.toLowerCase().includes(searchTerm.toLowerCase()) || f.Description.toLowerCase().includes(searchTerm.toLowerCase())) : true;
        let o = oUse ? filtersO.includes(f.o_type) : true;
        let r = true;
        if(rUse){
          r = false;
          for(let i=0;i<f.r_list.length;i++){
            if(filtersR.includes(f.r_list[i])){
              r = true;
            }
          }
        }
        // current behavior: OR within each dropdown list, AND between search + resources + organizations
        return s && o && r;
      });

      if(filteredData.length === 0){
        // append no-results message
        let m = document.createElement("li");
        m.classList.add("no-results-li");
        m.textContent = "No resources match your search term and filters. Please try clearing the search term, or remove one or more filters.";
        holder.append(m);
      }
    }

    for(let i=0;i<filteredData.length;i++){
        let d = filteredData[i];
        let rType = d.r_list[0];
        let iName = "img/icon_" + rType + ".png";

        let li = document.createElement("li");
            li.classList.add("resource-li");
        let img = document.createElement("img");
            img.setAttribute("src", iName);
            img.setAttribute("alt", rType);
            img.classList.add("resource-img");
        let inner = document.createElement("div");
            inner.classList.add("resource-inner");

        let title = document.createElement("p");
            title.classList.add("resource-title");
        
        let a = document.createElement("a");
            a.setAttribute("href", d["Link"]);
            a.setAttribute("rel", "noopener noreferrer");
            a.setAttribute("target","_blank");
            a.textContent = d["Title"];

        title.append(a);

        let desc = document.createElement("p");
            desc.classList.add("resource-description");
            desc.textContent = d["Description"];

        inner.append(title);
        inner.append(desc);

        li.append(img);
        li.append(inner);

        holder.append(li);
    }
}

function loadData(){
    d3.csv("data/resources.csv").then(function(data){
        for(let i=0;i<data.length;i++){
            let row = data[i];
            let o = row["Organization Type"].trim().toLowerCase().replace("organization","").trim();
            row["o_type"] = o;
            if(!categoriesO.includes(o)){
                categoriesO.push(o);
            }
            
            let r = row["Resource Type"].trim().toLowerCase().split("/"); // some are doubled-up in the data
            row["r_list"] = r; // assign property to row as well
            for(let j=0;j<r.length;j++){
              if(!categoriesR.includes(r[j].trim())){
                categoriesR.push(r[j].trim());
              }
            }
        }

        allData = data.sort(function(a,b){
          return a.Title > b.Title ? 1 : a.Title < b.Title ? -1 : 0;
        });
        setUpDropdowns();
        setUpSearch();
        buildRows();
    });
}

loadData();


////////////////////////////////////////
// Utility functions
///////////////////////////////////////
function toggleDropdown(e){
    let t = e.target;
    if(t.getAttribute("aria-expanded")=="true"){
      closeDropdown(e);
    }else{
      openDropdown(e);
    }
}

function openDropdown(e){
    let t = e.target;
    let p = t.parentNode;
    t.setAttribute("aria-expanded", "true");
  
    // close anything that's currently opened
    let currentOpen = document.querySelector(".dropdown-list[aria-hidden='false']");
    if(currentOpen){
      closeDropdown(null, currentOpen);
    }
  
    let u = p.querySelector("ul");
    u.setAttribute("aria-hidden", "false");
    if(u.clientHeight===0){
      u.style.height = u.scrollHeight+"px";
    }
  
    let inners = u.querySelectorAll("li");
    for(let i=0;i<inners.length;i++){
      inners[i].querySelector("input").setAttribute("tabindex", "0");
    }
  
    // add listener
    document.querySelector("body").addEventListener("click", closeAnyDropdown);
  
    p = null;
    u = null;
    inners = null;
  }
  
  function closeDropdown(e, blur){
    let p,
    u;
  
    if(!blur){
      // mouseleave the outermost li
      p = e.target.parentNode;
      u = p.querySelector("ul");
      e.target.setAttribute("aria-expanded", "false");
  
    }else{
      // blur from the inner ul
      p = blur.parentNode.querySelector("button");
      u = blur;
      p.setAttribute("aria-expanded", "false");
    }
  
    u.setAttribute("aria-hidden", "true");
  
    if(u.style.height){
      u.removeAttribute("style");
    }
  
    let inners = u.querySelectorAll("li");
    for(let i=0;i<inners.length;i++){
      inners[i].querySelector("input").setAttribute("tabindex", "-1");
    }
  
    // remove listener
    document.querySelector("body").removeEventListener("click", closeAnyDropdown);
  
    p = null;
    u = null;
    inners = null;
  }
  // prevent dropdown staying open
  function closeAnyDropdown(e){
    // close anything that's currently opened
    if(!e.target.classList.contains("dropdown-button") && !document.querySelector("#organization-drops").contains(e.target) && !document.querySelector("#resource-drops").contains(e.target)){
      let currentOpen = document.querySelector(".dropdown-list[aria-hidden='false']");
      if(currentOpen){
        closeDropdown(null, currentOpen);
      }    
    }
  }