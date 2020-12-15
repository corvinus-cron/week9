export default (express, bodyParser, fs, crypto, http, mongodb, path, cors, puppeteer) => {
    const app = express();
    const author = 'itmo287666'
    const __dirname = path.resolve();
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'public'));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.json());
    app.use(express.urlencoded());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        next()
    });

    app.use(cors());
    app.options('*', cors());

    app 
        .get('/wordpress/wp-json/wp/v2/posts/1', (req, res) => res.status(200).json({title: {id: 1, rendered: "itmo282167"}}))
        .post('/render/', (req, res) => {
            const {random2, random3} = req.body;


            let { addr } = req.query;

            console.log(addr);
            
            res.render('random', {random2: random2, random3: random3,});


            // http.get(addr, (response) => {
            //     response.setEncoding('utf8');
            //     let rawData = '';
            //     response.on('data', (chunk) => { rawData += chunk; });
            //     response.on('end', () => {
            //         try {
            //             const parsedData = JSON.parse(rawData);
            //             console.log(parsedData);
            //             res.render('random', {random2: random2, random3: random3, login: "itmo282167"});
            //         } catch (e) {
            //             console.error(e.message);
            //         }
            //     });
            // }).on('error', (e) => {
            //     console.error(`Got error: ${e.message}`);
            // });
        })
        .get('/wordpress/', (req, res) => res.status(200).render('wordpress'))
        .post('/insert/', async (req, res) => {
            const {login, password, URL} = req.body;

            console.log(URL);

            const client = new mongodb.MongoClient(URL);

            try {
                await client.connect();

                const database = client.db('readusers');
                const collection = database.collection('users');
                const doc = { login: login, password: password };
                const result = await collection.insertOne(doc);

            } catch(error) {
                console.log(error);
            } finally {
                await client.close();
            }

            res.status(200).end();
        
        })
        .get('/login/', (req, res) => res.send(author))
        .get('/code/', (req, res) => fs.createReadStream(import.meta.url.substring(7)).pipe(res))   
        .get('/sha1/:input/', (req, res) => {
            const { input } = req.params;
            res.setHeader('content-type', 'text/plain');
            res.send(crypto.createHash('sha1').update(input).digest('hex'));
        })
    
        .get('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let { addr } = req.query;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
            
             .get('/test/', async (req, res) => {
        const { URL } = req.query
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        })
        const page = await browser.newPage()
        await page.goto(URL)
        await page.click('#bt')
        const value = await page.evaluate(async () => {
            const input = document.getElementById('inp')
            return input.value
        })
        res.send(value)
        })

        })
        .post('/req', (req, res) => {
            res.setHeader('content-type', 'text/plain');

            let addr = req.body.addr;

            http.get(addr, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        console.log(parsedData);
                        res.send(JSON.stringify(parsedData));
                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        
        })
               .all('*', (req, res) => {
            res.send('itmo282167');
        });


    return app;
}
