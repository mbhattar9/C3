// toolkit JS

function buildDownloadList(data){
    let infoList = document.querySelector("#info-posts");
    let testList = document.querySelector("#testimonial-posts");
    let radioList = document.querySelector("#radio-psas");


    for(let i=0;i<data.length;i++){
        let item = data[i];
        let type = item.type;
        let list;

        let hrefStart = "";
        if(type==="info"){
            hrefStart = "documents/info-posts/";
            list = infoList;
        }else if(type==="testimonial"){
            hrefStart = "documents/testimonial-posts/";
            list = testList;
        }else if(id==="radio"){
            hrefStart = "documents/radio-psas/";
            list = radioList;
        }

        let row = document.createElement("li");
        let link = document.createElement("a");
            link.setAttribute("download", true);
            link.setAttribute("href", hrefStart + item.link);
            link.textContent = item.name;
        row.append(link);
        list.append(row);
    }

    row.append(link);
}

function loadData(){
    d3.csv("data/toolkit.csv").then(function(data){
        buildDownloadList(data);
    });
}

loadData();
