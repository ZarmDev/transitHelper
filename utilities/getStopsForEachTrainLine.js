import { JSDOM } from 'jsdom';
import fs from 'fs/promises'

// const getSubwayLinks = await fetch('https://new.mta.info/maps/subway-line-maps')

// const document = new JSDOM(getSubwayLinks.text());

// const content = document.getElementsByClassName('content')[0]
// const links = content.getElementsByTagName('a')

// for (var i = 0; i < 22; i++) {
//     console.log(links[i].getAttribute('href'));
//     links[i].getAttribute('href')
// }
const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]

// var eachRoute = {}

// delay by AI
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const trainAssetsFolder = './assets/trains/routes'

await fs.mkdir(trainAssetsFolder, { recursive: true })

for (var i = 0; i < trainLinesWithIcons.length; i++) {
    var content = null;
    const currentTrainLine = trainLinesWithIcons[i];
    // content = await fs.readFile('./htmlResult.html', 'utf-8')
    try {
        const url = `https://new.mta.info/maps/subway-line-maps/${currentTrainLine}-line`
        content = await fetch(url)
    } catch {
        continue
    }
    const htmlResult = await content.text()
    // fs.writeFile('./htmlResult.html', htmlResult)
    // console.log(htmlResult)
    const dom = new JSDOM(htmlResult);
    const document = dom.window.document;
    const fieldItems = document.getElementsByClassName('field--item')
    // console.log(fieldItems.length)
    var eachBorough = {}
    // A seperate file made for quick lookups
        var justStops = ""
    for (var j = 4; j < fieldItems.length; j += 2) {
        // console.log(fieldItems[j].getElementsByTagName('h2')[0])
        const header = fieldItems[j].getElementsByTagName('h2')[0].textContent.replace('\n', '').trim()
        const trTags = fieldItems[j].getElementsByTagName('tr')
        var stopsAtBorough = []
        for (var z = 1; z < trTags.length; z++) {
            var info = {}
            const currentBorough = trTags[z]
            const tdTags = currentBorough.getElementsByTagName('td')
            for (var t = 0; t < tdTags.length; t++) {
                const currentTdTag = tdTags[t]
                let dataTitle = currentTdTag.getAttribute('data-title').trim()
                const data = currentTdTag.getElementsByTagName('p')[0].textContent
                // If there's a Byte Order Mark (I'm not really sure why it's there)
                // if (dataTitle.charCodeAt(0) === 0xFEFF) {
                //     // Then, remove the first character
                //     dataTitle = dataTitle.slice(1);
                // }
                const removeWhitespaces = data.trim()
                if (dataTitle.includes("Subway Station")) {
                    dataTitle = "Subway Station"
                    justStops += removeWhitespaces + '\n'
                }
                info[dataTitle] = removeWhitespaces
            }
            stopsAtBorough.push(info)
        }
        // console.log(stopsAtBorough)
        eachBorough[header] = stopsAtBorough
    }
    // console.log(eachBorough)
    await fs.writeFile(`${trainAssetsFolder}/${currentTrainLine}.txt`, JSON.stringify(eachBorough, null, 4))
    await fs.writeFile(`${trainAssetsFolder}/stops-${currentTrainLine}.txt`, justStops)
    // eachRoute[currentTrainLine] = eachBorough
    // console.log(eachRoute)
    await delay(100);
}
console.log('Finished!')
// console.log(eachRoute);