// Just a useful file to let you serve the bundle.js to your HTML file or whatever
// You can do <script src="http://x.x.x.x:8082/bundle.js"></script>
// Fill the x's with "the" ip address. I don't know if it's your ip or wifi ip
import express from 'express';

const app = express();
const PORT = 8082;

app.use(express.static('dist'))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});