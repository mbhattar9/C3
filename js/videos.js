"use strict";

function buildIframes(d){
    let holder = document.querySelector("#video-holder");
    holder.innerHTML = "";

    for(let i=0;i<d.length;i++){
        let v = d[i];
        let outer = document.createElement("div");
            outer.classList.add("video-group");
        let title = document.createElement("p");
            title.classList.add("video-title");
            title.textContent = v.name;
        let description = document.createElement("p");
            description.classList.add("video-description");
            description.textContent = v.description;
        let iframeOuter = document.createElement("div");
            iframeOuter.classList.add("iframe-holder");
        let iframe = document.createElement("iframe");
            iframe.setAttribute("src", v.link);
            iframe.setAttribute("width", "560");
            iframe.setAttribute("height", "315");
            iframe.setAttribute("title", "YouTube video player");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allow", "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("allowfullscreen", true);

        iframeOuter.append(iframe);
        outer.append(title);
        outer.append(description);
        outer.append(iframeOuter);
        holder.append(outer);
    }
}

function loadData(){
    d3.csv("data/videos.csv").then(function(data){
        buildIframes(data);
    });
}

loadData();