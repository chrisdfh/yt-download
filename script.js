const dataContainer = document.querySelector(".data-container");
const img = document.querySelector("#img-thumb");
const length = document.querySelector("#time");
const desc = document.querySelector("#desc");
const veil = document.querySelector(".veil");
const btnMore = document.querySelector("#more-less");


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

    dataContainer.innerHTML = ytData.title + " (" + prettyTime(ytData.duration) + ")";
    img.src = ytData.thumbnail;
    // length.innerHTML = prettyTime(ytData.duration)
    desc.innerText = ytData.description

    drawTable(ytData.formats);
}

function drawTable(data) {
    const tbody = document.querySelector("#tbody");
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
        desc.style.maxHeight = "2000px";
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
