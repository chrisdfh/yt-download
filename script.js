const dataContainer = document.querySelector(".data-container");
const img = document.querySelector("#img-thumb");
const length = document.querySelector("#time");
const desc = document.querySelector("#desc");
const veil = document.querySelector(".veil");
const btnMore = document.querySelector("#more-less");
var url = ''

var ytData;
async function getData() {
    const url = document.querySelector("#inputURL").value;
    veil.classList.remove("d-none");
    console.log("fetching...");
    const rawData = await fetch("./yt.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: url,
        }),
    });
    const data = await rawData.json();
    console.log("fetched");
    veil.classList.add("d-none");
    printData(data);
}

function printData(data) {
    document.querySelector(".dl-data").classList.remove("d-none");
    ytData = JSON.parse(data);
    console.log(ytData);

    //AGREGO INFO DEL CANAL
    const infoC = document.querySelector('#chan-info')
    infoC.innerHTML=''
    const info = document.createElement('div')
    const infoLink = document.createElement('a')
    info.classList.add('info-channel')
    info.innerText = ytData.channel
    infoLink.href=ytData.channel_url
    infoLink.append(info)
    infoC.append(infoLink)

    //AGREGO CAPÍTULOS SI LO TUVIESE
    if (ytData.hasOwnProperty('chapters')){
        printChapters(ytData.chapters)
    }

    //AGREGO LINK PARA VER EN YOUTUBE
    const ytLink = document.querySelector('#link-yt')
    ytLink.href = ytData.webpage_url
    url = ytData.webpage_url


    // const vFrame = document.querySelector('#video-container')
    // const iframe = `
    // <iframe  src="https://www.youtube.com/embed/${ytData.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    // `

    // vFrame.innerHTML += iframe;

    dataContainer.innerHTML = ytData.title + " (" + prettyTime(ytData.duration) + ")";
    img.src = ytData.thumbnail;
    // length.innerHTML = prettyTime(ytData.duration)
    desc.innerText = ytData.description

    printTags(ytData.tags);
    drawTable(ytData.formats);
}
const printTags = (tags)=>{
    const tagsC = document.querySelector('#tags')
    tagsC.innerHTML=''
    tags.forEach((tag)=>{
        var tagContainer = document.createElement('div')
        tagContainer.classList.add('tag')
        tagContainer.innerText = tag
        tagsC.append(tagContainer)
    })
}
const printChapters = (chapters)=>{
    const chaptersC = document.querySelector('#chapters')
    const col61 = document.createElement('div')
    col61.classList.add('col-6')
    const col62 = document.createElement('div')
    col62.classList.add('col-6')
    const l = chapters.length
    var c=0
    chaptersC.innerHTML=''
    chapters.forEach(chapter => {
        var col=1
        if (++c > Math.round(l/2)) col=2
        const a = document.createElement('a')
        a.classList.add('chapter')
        a.style.display='block'
        a.innerText = chapter.title
        a.href = `${url}&t=&${chapter.start_time}`
        a.target="_blank"

        if (col == 1){
            col61.appendChild(a)
            chaptersC.appendChild(col61)
        } else if (col == 2){
            col62.appendChild(a)
            chaptersC.appendChild(col62)
        }
    });
    //setHeight to chapters
    chapterHeight()
}

const chapterHeight = ()=>{
    setTimeout(()=>{
        const imgHeightRaw = document.querySelector("#img-thumb").clientHeight;
        const imgHeight = parseFloat(imgHeightRaw);
        const tagsHeightRaw = document.querySelector("#tags").clientHeight;
        const tagsHeight = parseFloat(tagsHeightRaw);
        const footHeightRaw = document.querySelector("#footer-info").clientHeight;
        const footHeight = parseFloat(footHeightRaw);
        const chapters = document.querySelector('#chapters')

        const height = imgHeight - tagsHeight - footHeight + 24;
        chapters.style.height = height + "px";
        chapters.style.overflowY = 'scroll'
    },50)
}

function drawTable(data) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = ''
    data.forEach((format) => {
        const info = `
            <tr>
                <td>
                    ${format.format_id}
                </td>
                <td>
                    ${format.width ? format.width + " x" : ""} ${format.height ? format.height : ""} 
                    (${format.format_note == "tiny" ? "Solo Audio" : format.format_note})
                </td>
                <td>
                    ${format.ext}
                </td>
                <td>
                    ${msgAudioVideo(format)}
                </td>
                <td>
                    ${format.filesize ? Math.floor(format.filesize / (1024 * 1024)) + "MB" : "No Data"}
                </td>
                <td>
                    <a href="${format.url}" target="_blank" class="btn btn-primary">Download</a>
                </td>
            </tr>
            `;
        tbody.innerHTML += info;
    });
}

function msgAudioVideo(format) {
    let msg = null;
    if (format.acodec != "none") {
        msg = "Audio";
    }
    if (format.vcodec != "none") {
        if (msg) {
            msg += " + Video";
        } else {
            msg = "Video";
        }
    }
    return msg;
}

function moreDesc() {
    if (desc.classList.contains("txt-small")) {
        desc.style.maxHeight = "2000vh";
        desc.classList.remove("txt-small");
        desc.classList.add("txt-all");
        btnMore.innerText = "Less";
    } else {
        desc.style.maxHeight = "150px";
        desc.classList.add("txt-small");
        desc.classList.remove("txt-all");
        btnMore.innerText = "More";
    }
}

function prettyTime(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = Math.floor((sec % 3600) % 60);

    //agrego el cero de padding si hace falta
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (m < 10) {
        s = "0" + s;
    }

    return h + ":" + m + ":" + s;
}

onresize = () => {
    console.log('resized')
    chapterHeight()
};
