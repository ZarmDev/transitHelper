// This file is to generate bus svgs and download all of them.
// Pretty cool huh? (Ahem, A LOT of AI was used here)

// AI
import { SVG, registerWindow } from '@svgdotjs/svg.js';
import { createSVGWindow } from 'svgdom';
import fs from 'fs/promises'

// generated using AI
var bBusRoutes = `M1, M2, M3, M4, M5, M7, M8, M9, M10, M11, M12, M14A, M14D, M15, M15 SBS, M20, M21, M22, M23 SBS, M31, M34 SBS, M34A SBS, M35, M42, M50, M55, M57, M60 SBS, M66, M72, M79 SBS, M86 SBS, M96, M98, M100, M101, M102, M103, M104, M106, M116`
var bXBusRoutes = `Bx1, Bx2, Bx3, Bx4, Bx4A, Bx5, Bx6, Bx6 SBS, Bx7, Bx8, Bx9, Bx10, Bx11, Bx12, Bx12 SBS, Bx13, Bx15, Bx16, Bx17, Bx18, Bx19, Bx20, Bx21, Bx22, Bx23, Bx24, Bx26, Bx27, Bx28, Bx29, Bx30, Bx31, Bx32, Bx33, Bx34, Bx35, Bx36, Bx38, Bx39, Bx40, Bx41, Bx41 SBS, Bx42, Bx46`
var mBusRotues = `M1, M2, M3, M4, M5, M7, M8, M9, M10, M11, M12, M14A, M14D, M15, M15 SBS, M20, M21, M22, M23 SBS, M31, M34 SBS, M34A SBS, M35, M42, M50, M55, M57, M60 SBS, M66, M72, M79 SBS, M86 SBS, M96, M98, M100, M101, M102, M103, M104, M106, M116`
var qBusRoutes = `Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q15A, Q16, Q17, Q18, Q19, Q20A, Q20B, Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30, Q31, Q32, Q33, Q34, Q35, Q36, Q37, Q38, Q39, Q40, Q41, Q42, Q43, Q44 SBS, Q46, Q47, Q48, Q49, Q50, Q52 SBS, Q53 SBS, Q54, Q55, Q56, Q58, Q59, Q60, Q64, Q65, Q66, Q67, Q69, Q70 SBS, Q72, Q76, Q77, Q83, Q84, Q85, Q88, Q100, Q101, Q102, Q103, Q104, Q110, Q111, Q112, Q113, Q114`
var sBusRotues = `S40, S42, S44, S46, S48, S51, S52, S53, S54, S55, S56, S57, S59, S61, S62, S66, S74, S76, S78, S79 SBS, S81, S84, S86, S89, S90, S91, S92, S93, S94, S96, S98`

async function createSVGForBuses(arr, fontColor, backgroundColor) {
    for (var i = 0; i < arr.length; i++) {
        // Create a DOM-like environment (AI)
        const window = createSVGWindow();
        const document = window.document;

        // Register the window and document
        registerWindow(window, document);

        // Create an SVG drawing
        const draw = SVG(document.documentElement).size(200, 100);

        // Create a blue rectangle
        const rect = draw.rect(200, 100).fill(backgroundColor).radius(10);

        const text = draw.text(arr[i]).font({
            size: 40,
            family: 'Arial', // Set the font family
            weight: 'bold',  // Set the font weight
            // style: 'italic', // Set the font style
            fill: fontColor    // Set the font fill color
        });

        // Center the text in the rectangle
        text.cx(rect.cx()).cy(rect.cy());

        // Get the SVG markup as a string
        const svgString = draw.svg();

        let filename = arr[i]

        // Save the SVG string to a file
        await fs.writeFile(`./src/otherfunctions/busSvgs/${filename}.svg`, svgString);

        console.log(`SVG file has been saved as ${filename}.svg`);
    }
}

// colors generated by AI
createSVGForBuses(bBusRoutes.split(','), 'blue', '#FF5733');
createSVGForBuses(bXBusRoutes.split(','), 'red', 'rgba(255, 87, 51, 0.5)');
createSVGForBuses(mBusRotues.split(','), 'green', 'hsl(9, 100%, 60%)');
createSVGForBuses(qBusRoutes.split(','), 'purple', 'hsla(9, 100%, 60%, 0.5)');
createSVGForBuses(sBusRotues.split(','), 'orange', 'white');