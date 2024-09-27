const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (value === undefined) {
            switch (key) {
                case 'content':
                    printContent('.');
                    break;
                default:
                    console.log(`${key}: true`);
            }
        } else if (value === '') {
            console.log('Value is missing!');
        } else {
            switch (key) {
                case 'exist':
                    checkFile(value);
                    break;
                case 'create':
                    createFolder(value);
                    break;
                case 'remove':
                    removeFolder(value);
                    break;
                case 'isFolder':
                    checkIsFolder(value);
                    break;
                case 'size':
                    checkSize(value);
                    break;
                case 'content':
                    printContent(value);
                    break;
                default:
                    console.log(`${key}: ${value}`);
            }
        }
    } else if (arg.startsWith('-')) {
        console.log(`${arg.slice(1)}: true`);
    }
});

function checkFile(filename) {
    if (fs.existsSync(filename)) {
        console.log(`The file ${filename} exists!`);
    } else {
        console.log(`The file ${filename} doesn't exist!`);
    }
}

function createFolder(foldername) {
    const fullPath = path.resolve(foldername);
    fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating folder "${foldername}":`, err);
        } else {
            const message = foldername.includes('/') ? `The folders ${foldername} were created!` : `The folder ${foldername} was created!`;
            console.log(message);
        }
    });
}

function removeFolder(foname) {
    const fullPath = path.resolve(foname);
    if (!fs.existsSync(fullPath)) {
        console.log(`This ${foname} folder doesn't exist!`);
        return;
    }
    fs.rm(fullPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(`Error deleting folder "${foname}":`, err);
        } else {
            const message = foname.includes('/') ? `The folder ${foname.split('/')[0]} in ${foname.split('/')[1]} folder was deleted!` : `The folder ${foname} was deleted!`;
            console.log(message);
        }
    });
}

function checkIsFolder(name) {
    const fullPath = path.resolve(name);
    if (!fs.existsSync(fullPath)) {
        console.log(`It seems that some specified files don't exist!`);
        return;
    }
    const stats = fs.lstatSync(fullPath);
    if (stats.isDirectory()) {
        console.log(`The ${name} is a folder!`);
    } else {
        console.log(`The ${name} is not a folder!`);
    }
}

function checkSize(names) {
    const files = names.split('-');
    let totalSize = 0;
    for (const file of files) {
        const fullPath = path.resolve(file);
        if (!fs.existsSync(fullPath)) {
            console.log(`It seems that some specified files don't exist!`);
            return;
        }
        const stats = fs.statSync(fullPath);
        totalSize += stats.size;
    }
    const sizeInKilobytes = totalSize / 1024;
    console.log(`The size of the specified files is ${sizeInKilobytes} kilobytes`);
}

function printContent(foldname) {
    const fullPath = path.resolve(foldname);
    if (!fs.existsSync(fullPath)) {
        console.log(`The folder ${foldname} doesn't exist!`);
        return;
    }
    fs.readdir(fullPath, (err, files) => {
        if (err) {
            console.error(`Error reading folder "${foldname}":`, err);
        } else {
            files.forEach(file => {
                console.log(file);
            });
        }
    });
}