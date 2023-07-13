GITHUB_URL = "https://api.github.com/repos/dams4k/minecraft-cpsdisplay/releases"
MODRINTH_URL = "https://api.modrinth.com/v2/project/cpsdisplay"
CURSEFORGE_URL = "https://www.curseforge.com/api/v1/mods/search?gameId=432&index=0&classId=6&filterText=cpsdisplay&gameVersion=1.8.9&pageSize=20&sortField=1&categoryIds%5B0%5D=424&categoryIds%5B1%5D=423&gameFlavors%5B0%5D=1"
CURSEFORGE_MOD_ID = 618222

const LASTEST_RELEASE_URL = "https://api.github.com/repos/dams4k/minecraft-cpsdisplay/releases/latest"

async function download_release_data() {
    const response = await fetch(LASTEST_RELEASE_URL);
    return await response.json();
}

async function get_data(url) {
    if (sessionStorage[url]) {
        console.log("from cache");
        return JSON.parse(sessionStorage[url]);
    }

    let response = await fetch(url);
    let data = await response.json();
    sessionStorage[url] = JSON.stringify(data);
    return data;
}

async function get_curseforge_data() {
    let mods_data = await get_data(CURSEFORGE_URL);
    if (mods_data.data) {
        for (const mod_data of mods_data.data) {
            if (mod_data.id == CURSEFORGE_MOD_ID) {
                return mod_data;
            }
        }
    }

    return {}
}

async function get_github_downloads() {
    let downloads = 0;
    let releases = await get_data(GITHUB_URL);
    if (releases) {
        for (const release of releases) {
            for (const asset of release.assets) {
                if (!asset.name.includes("source") && asset.download_count) {
                    downloads += asset.download_count;
                }
            }
        }
    }
    return downloads
}

async function get_modrinth_downloads() {
    let downloads = 0;
    let data = await self.get_data(MODRINTH_URL);

    if (data && data.downloads) {
        downloads = data.downloads;
    }

    return downloads
}

async function get_curseforge_downloads() {
    let downloads = 0;
    let data = await self.get_curseforge_data();
    if (data && data.downloads) {
        downloads = data.downloads;
    }

    return downloads
}