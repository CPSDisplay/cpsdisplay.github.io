
async function onReady() {
    e_mod_sources = document.getElementById("mod-sources");
    latest_release = await download_release_data();
    if (latest_release) {
        for (const asset of latest_release.assets) {
            if (asset.name.includes("source")) {
                let new_a = document.createElement("h6");
                new_a.innerHTML = asset.name;
                new_a.href = asset.browser_download_url;

                e_mod_sources.appendChild(new_a);
            }
        }
    }
}