const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid'); // uuidv4() -> '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const { promisify } = require('util') // promisify(fs.writeFile) -> writeFileAsync (promise) 
const writeFileAsync = promisify(fs.writeFile) // fs.writeFile -> writeFileAsync (promise)

/* ใช้กับ Google Cloud Storage */
const { Storage } = require('@google-cloud/storage');
const stream = require('stream');

async function saveImageToDisk(baseImage) {
    // หา path จริงของโปรเจค
    const projectPath = path.resolve('./');
    // โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    // หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));

    // สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    // Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    // เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath + filename, image.data, 'base64');
    // return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1]; // content-type ของไฟล์
    image.data = matches[2]; // base64 data ของไฟล์

    return image;
}

/* ใช้กับ Google Cloud Storage */
async function saveImageToGoogle(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./');

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
    console.log(ext);

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(image.data, 'base64'));

    // Creates a client and upload to storage
    const storage = new Storage({
        projectId: 'your-project-id',
        keyFilename: `${projectPath}/key.json`
    });

    const myBucket = storage.bucket('your-bucket-name');
    var newFilename = myBucket.file(filename);
    // Upload file to bucket
    bufferStream.pipe(newFilename.createWriteStream({
        gzip: true,
        contentType: image.type,
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
        public: true,
        validation: "md5"
    }).on('error', (err) => {
        console.log('err =>' + err);
    }).on('finish', () => {
        console.log('upload successfully...');
    }));

    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

module.exports = { decodeBase64Image, saveImageToDisk };