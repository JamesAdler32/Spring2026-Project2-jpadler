let API_KEY = "";

fetch("key.txt")
    .then(response => response.text())
    .then(text => {API_KEY = text;});


const requestOptions = {
    method: "GET",
    redirect: "follow"
};

let bg_idx = 0;
const bg_imgs = [
    "https://images.unsplash.com/photo-1516823989326-bd1bd7d6f4f2?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1490131681458-a08259e7627d?q=80&w=1624&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1490128748265-cd43d3de45a9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1498477386155-805b90bf61f7?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1507475983216-3caee89a6fea?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1475727946784-2890c8fdb9c8?q=80&w=1768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1531226208074-94fb5a1bb26c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1752102057402-c68606f3da8f?q=80&w=2202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

async function fetch_query_json(query) {
    const URI = `https://google.serper.dev/search?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`

    try {
        const response = await fetch(URI, requestOptions);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    };

    return "";
}

function get_HH_MM() {
    const date = new Date;
    let h = date.getHours();
    let m = date.getMinutes();

    if (h < 10) {
        h = "0" + h;
    }

    if (m < 10) {
        m = "0" + m;
    }

    return h + ":" + m;
}

function search_div(title, link, description) {
    return `<div class="search_div">
        <a href="${link}">${title}</a>
        <p>${description}</p>
    </div>`;
}
function paa_sub_div(title, link, description) {
    return `<div class="paa_sub_div">
        <p>${description}</p>
        <a href="${link}">${title}</a>
    </div>`;
}

function paa_div(paa_arr) {
    let div = `<div class="acord">`;
    for (let i = 0; i < paa_arr.length; i++) {
        const question = paa_arr[i].question;
        const title = paa_arr[i].title;
        const link = paa_arr[i].link;
        const desc = paa_arr[i].snippet;

        div += `<h3>${question}</h3> ${paa_sub_div(title, link, desc)} \n`;
    }
    div += "</div>";
    return div;
}

function related_search_div(rs_arr) {
    let div = `<div class="related_search"><ul>`;
    for (let i = 0; i < rs_arr.length; i++) {
        const query = rs_arr[i].query;
        div += `<li>${query}</li>`;
    }
    div += "</ul></div>";
    return div;
}

$(document).ready(function () {
    $("#searchButton").click(function () {
        $("#searchResults").empty();

        const query = $("#query").val();
        fetch_query_json(query).then(function (data) {
            for (let i = 0; i < data.organic.length; i++) {
                const title = data.organic[i].title;
                const link = data.organic[i].link;
                const desc = data.organic[i].snippet;
                $("#searchResults").append(search_div(title, link, desc));
            }

            if (data.peopleAlsoAsk) {
                $("#searchResults").append(`<h1>People Also Ask:</h1>`);
                $("#searchResults").append(paa_div(data.peopleAlsoAsk));
                $(".acord").accordion({
                    collapsible: true,
                    active: false,
                    heightStyle: "content",
                });
            }

            if (data.relatedSearches) {
                $("#searchResults").append(`<h1>Related Searches:</h1>`);
                $("#searchResults").append(related_search_div(data.relatedSearches));
            }
        });
    });

    $("#timeButton").click(function () {
        $("#time").empty();

        const time_p = `<p class="time">${get_HH_MM()}</p>`;
        $("#time").append(time_p);
        $("#time").dialog();
    });

    $("#title").click(function () {
        bg_idx = (bg_idx + 1) % bg_imgs.length;

        const img_url = bg_imgs[bg_idx];
        $("body").css("background-image", `url("${img_url}")`);
    })

    // let user click the entire div to be redirected
    $(document).on("click", "div.search_div", function () {
        const href = $(this).find("a").attr("href");
        if (href) window.location.href = href;
    });

    $("#luckyButton").click(function () {
        const query = $("#query").val();
        fetch_query_json(query).then(function (data) {
            if (data.organic.length > 0) {
                window.location.href = data.organic[0].link;
            }
        });
    });

});
