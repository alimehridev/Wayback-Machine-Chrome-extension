function get_item_object(item, columns){
    let parts = item.split(" "); // جدا کردن بر اساس فاصله
    let obj = {};
    columns.forEach((col, idx) => {
    obj[col] = parts[idx];
    });
    return obj;
}


document.getElementById("get_snapshots").addEventListener("click", () => {
    if(document.getElementById("get_snapshots").innerText == "Sending request to archive.org..."){
        return
    }
    let targetElement = document.getElementById("target");
    if (!targetElement) {
        console.error('Element with id "target" not found.');
        return;
    }
    let domain = encodeURIComponent(targetElement.value);
    let filters = {
        collapse:Object.values(document.getElementsByName("collapse")).filter(i => i.checked)[0].value,
        columns: Object.values(document.getElementsByName("columns")).filter(i => i.checked).map(i => i.value).join(","),
        customFilter: getCustomFilters()
    }
    if(filters.columns.length == 0){
        alert("You should select a column at least in filters")
        return
    }
    filters.columns = [...new Set(["timestamp", "original"].concat(filters.columns.split(",")))].join(",")
    let xhr = new XMLHttpRequest();
    let requestURL = filters.collapse ? `http://web.archive.org/cdx/search/cdx?url=${domain}&collapse=${filters.collapse}&fl=${filters.columns}&${filters.customFilter}` : `http://web.archive.org/cdx/search/cdx?url=${domain}&fl=${filters.columns}&${filters.customFilter}`
    xhr.open("GET", requestURL, true);
    let result_box = document.getElementById("snapshot_resultBox")
    result_box.innerText = ""
    document.getElementById("snapshot_resultBox_numbers").innerText = `Number of snapshots: ${document.getElementById("snapshot_resultBox").childElementCount}`
    document.getElementById("get_snapshots").innerText = `Sending request to archive.org...`
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200){
            snapshots_string = xhr.responseText
            let response = snapshots_string.split('\n')
            response.reverse()
            document.getElementById("get_snapshots").innerText = "Get Snapshots"
            createVirtualList(document.getElementById('snapshot_resultBox'), response, {
                itemHeight: 20,
                renderItem: (item) => {
                    let item_object = get_item_object(item, filters.columns.split(","))
                    let span = document.createElement("span")
                    span.classList.add("snapshot_result")
                    span.classList.add("result")
                    let watch_anchor = document.createElement("a")
                    watch_anchor.setAttribute("title", `Go to snapshot on archive.org`)
                    watch_anchor.setAttribute("target", "_blank")
                    let watch_anchor_icon = document.createElement("img")
                    watch_anchor_icon.src = "/assets/images/watch_anchor.png"
                    watch_anchor.appendChild(watch_anchor_icon)
                    watch_anchor.classList.add("watch_anchor")
                    watch_anchor.href = `https://web.archive.org/web/${item_object.timestamp}if_/${item_object.original}`
                    let span2 = document.createElement("span")
                    span2.innerText = Object.values(document.getElementsByName("columns")).filter(i => i.checked).map(i => i.value).map(item => item_object[item]).join(" ")
                    span2.classList.add("item_span")
                    span.appendChild(span2)
                    span.appendChild(watch_anchor)
                    return span;
                }
            });
            document.getElementById("snapshot_resultBox_numbers").innerText = `Number of snapshots: ${response.length}`
        }
    }
    xhr.onprogress = function(event){
        document.getElementById("get_snapshots").innerText = `Downloading / ${event.loaded/1000000} MB downloaded`
        if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;

        } else {
        }
    }
    xhr.send();
})


document.getElementById("add_start_to_target").addEventListener("click", (el) => {
    let targetElement = document.getElementById("target");
    let domain = targetElement.value;
    if(domain){
        if(domain.startsWith("*.") && domain.endsWith("/*")){
            domain = domain.replace("*.", "")
            domain = domain.replace("/*", "")
            targetElement.value = domain
            el.target.innerText = "Notice: to get snapshots from all files add '*.' before and '/*' after your target, for example: '*.google.com/*' [Click on me to do for you]"
        }else {
            if(!domain.endsWith("/")){
                targetElement.value = "*." + domain + "/*"
            }else {
                targetElement.value = "*." + domain + "*"
            }
            el.target.innerText = "Notice: to get snapshots from all files add '*.' before and '/*' after your target, for example: '*.google.com/*' [Click on me to undo]"
        }
    }
  
})

document.getElementById("snapshot_resultBox_copy_btn").addEventListener("click", (e) => {
    e.target.innerText = "Copied"
    let snapshots_string_array = snapshots_string.split("\n")
    let columns = [...new Set(["timestamp", "original"].concat(Object.values(document.getElementsByName("columns")).filter(i => i.checked).map(i => i.value)))]
    snapshots_string_array.forEach(i => {
        console.log(Object.values(get_item_object(i, columns)))
    })
    
    copyToClipboard(snapshots_string)
    setTimeout(() => {
        e.target.innerText = "Copy all to clipboard"
    }, 500)
})
const toggleBtn = document.getElementById('toggleFilterBoxBtn');
const filterBox = document.getElementById('filterBox');
toggleBtn.addEventListener('click', () => {
  if (filterBox.style.display === 'none' || filterBox.style.display === '') {
    filterBox.style.display = 'block';
  } else {
    filterBox.style.display = 'none';
  }
});