import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';

const app = express();
const port = process.env.PORT ?? 3000;

// guardar file en memoria temporalmente con el middleware multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData: Array<Record<string, string>> = [];

// para que no nos de problemas con el frontend y el backend por CORS
app.use(cors()); // Enable CORS

app.post('/api/files', upload.single('file'), async (req, res) => {
    //1. Extract file from request
    const { file } = req;
    //2. Validate file 
    if (!file) {
        // segun el challenge, debes devolver un 500 (deberia de ser 400, pero bueno)
        return res.status(500).json({ message: 'El archivo es requerido' });
    }
    //3. Validate MIMETYPE
    if (file.mimetype !== 'text/csv') {
        return res.status(500).json({ message: 'El archivo debe ser de tipo CSV' });
    }

    let json: Array<Record<string, string>> = [];

    try {
        //4. Transform file (Buffer data) to string
        const rawCsv = Buffer.from(file.buffer).toString('utf-8');
        console.log('file', rawCsv)
        //5. Transform string to CSV
        json = csvToJson.csvStringToJson(rawCsv);
    } catch (error) {
        return res.status(500).json({ message: 'Error al procesar el archivo' });
    }

    //6. Save CSV file to database
    userData = json;

    //7. Return 200 with success message
    return res.status(200).json({ message: 'El archivo se cargo correctamente' })
})

app.get('/api/users', async (req, res) => {
    //1. Extract query param 'q' from the request
    const { q } = req.query;
    //2. Validate we have the query param
    if (!q) {
        return res.status(500).json({ message: "El parametro 'q' es requerido" });
    }

    if (Array.isArray(q)) {
        return res.status(500).json({ message: "El parametro 'q' no puede ser un array" });
    }
    //3. Filter the data from the db (or memory) with the query param
    const search = q.toString().toLowerCase();

    const filteredData = userData.filter((row) => {
        return Object.values(row).some(
            value => value.toLowerCase().includes(search)
        )
    })
    //4. Return 200 with the filtered data
    return res.status(200).json({ data: filteredData })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
