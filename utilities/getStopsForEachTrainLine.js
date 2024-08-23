import { JSDOM } from 'jsdom';
import fs from 'fs/promises'
import axios from 'axios';


// const getSubwayLinks = await fetch('https://new.mta.info/maps/subway-line-maps')

// const document = new JSDOM(getSubwayLinks.text());

// const content = document.getElementsByClassName('content')[0]
// const links = content.getElementsByTagName('a')

// for (var i = 0; i < 22; i++) {
//     console.log(links[i].getAttribute('href'));
//     links[i].getAttribute('href')
// }
const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "7", "7d", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "w", "z"]

var eachRoute = {}

// delay by AI
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    fs.writeFile('./htmlResult.html', htmlResult)
    // console.log(htmlResult)
    const dom = new JSDOM(htmlResult);
    const document = dom.window.document;
    const fieldItems = dom.window.document.getElementsByClassName('field--item')
    // console.log(fieldItems.length)
    var eachBorough = {}
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
                const dataTitle = currentTdTag.getAttribute('data-title')
                const data = currentTdTag.getElementsByTagName('p')[0].textContent
                info[dataTitle] = data.trim()
            }
            stopsAtBorough.push(info)
        }
        // console.log(stopsAtBorough)
        eachBorough[header] = stopsAtBorough
    }
    // console.log(eachBorough)
    eachRoute[currentTrainLine] = eachBorough
    // console.log(eachRoute)
    await delay(100);
    break
}
await fs.writeFile('./eachTrainRoute.txt', JSON.stringify(eachRoute))
// console.log(eachRoute);