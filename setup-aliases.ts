import * as path from 'path';
import * as fs from 'fs';
import moduleAlias from 'module-alias';

const srcPath = path.join(__dirname, 'src');

const getDirectories = (source: string): string[] =>
    fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

getDirectories(srcPath).forEach((dir) => {
  moduleAlias.addAlias(`@${dir}`, path.join(srcPath, dir));
});

moduleAlias.addAlias('@src', srcPath);