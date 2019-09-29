const Sharp = require('sharp');
const Path = require('path');
const Uuidv4 = require('uuid/v4');


class Resize {
    constructor(folder) {
        this.folder = folder;
    }

    async save(buffer) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        await Sharp(buffer)
            .resize(300, 300, {
                fit: Sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);

        return filename;
    }

    static filename() {
        return `${Uuidv4()}.png`;
    }

    filepath(filename) {
        return Path.resolve(`${this.folder}/${filename}`)
    }
}

module.exports = Resize;