var select_menus = {}

async function loadDiscordPresenceCount() {
    const discordResponse = await fetch("https://discord.com/api/guilds/1094713373758865449/widget.json");
    const discordData = await discordResponse.json();
    element = document.getElementById("discord-presence-count");
    element.innerText = discordData["presence_count"] + " online";
}

async function onReady() {
    setupSelectMenus();
    
    let assets_menu = select_menus[document.getElementById("assets-menu")];
    let asset_links = await loadAssetItems(assets_menu);
    assets_menu.list.callSelectItem(assets_menu.list.e_items[0]);

    let download_button = document.getElementById("download-button");
    download_button.addEventListener("click", (e) => {downloadAsset(assets_menu.getSelected(), asset_links)});

    await setupDownloadBar();
}

async function setupDownloadBar() {
    let ceiling = document.getElementById("download-ceiling");
    let floor = document.getElementById("download-floor");
    let download_completion = document.getElementById("download-completion");
    let download_description = document.getElementById("download-description");
    
    let total_downloads = await get_github_downloads();
    total_downloads += await get_modrinth_downloads();
    total_downloads += await get_curseforge_downloads();
    
    let download_level = downloadLevel(total_downloads);
    let percentage = (total_downloads - download_level.floor)/download_level.factor * 100;

    download_completion.style.width = percentage + "%";
    floor.innerText = download_level.floor;
    ceiling.innerText = download_level.ceiling;
    download_description.innerText = total_downloads + " (" + percentage.toPrecision(3) + "%)";
}

async function loadAssetItems(assets_menu) {
    let asset_links = {}

    let data = await download_release_data();
    let assets = data["assets"];
    
    let assets_to_download = {};
    for (const asset of assets) {
        let name = asset["name"];
        if (name.includes("source")) continue;
        
        let parts = name.replace(".jar", "").split("-");
        let mc_version = parts[1].replace("mc", "");
        mc_version = mc_version.split(".").map(n => +n+100000).join(".");
        assets_to_download[mc_version] = asset;
    }
    
    let assets_to_download_keys = Object.keys(assets_to_download);
    assets_to_download_keys.sort();
    for (var i = 0; i < assets_to_download_keys.length; i++) {
        let key = assets_to_download_keys[i];
        let asset = assets_to_download[key];

        let id = "asset-" + asset["id"];
        let parts = asset["name"].replace(".jar", "").split("-");
        let mc_version = parts[1];
        
        asset_links[id] = asset["browser_download_url"];
        assets_menu.addItem(mc_version.replace("mc", "mc "), id);
    }

    return asset_links;
}

function getAssetParts(name) {
    return name.replace(".jar", "").split("-");
}

function downloadAsset(item_selected, asset_links) {
    let item_id = item_selected.id;

    let url = asset_links[item_id];
    if (url) {
        window.open(url);
    }
}

function setupSelectMenus() {
    //- Add listeners to all select-button divs
    var e_select_menus = document.getElementsByClassName("select-menu");
    for (const e_select_menu of e_select_menus) {
        select_menus[e_select_menu] = new SelectMenu(e_select_menu);
    }
}

function downloadLevel(total_downloads) {
    var length = total_downloads.toString().length;
    var factor = Math.pow(10, length-2);
    var floor = Math.floor(total_downloads / factor) * factor;

    return {"floor": floor, "factor": factor, "ceiling": floor + factor};
}