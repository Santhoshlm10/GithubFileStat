#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { typeObjectMaintainer } from "../utils/maintainer/type_objects.js";
import { file_types } from "../utils/file/file_types.js";
// init values
function FileType(filetype, count, percentage, description) {
    this.filetype = filetype;
    this.count = count;
    this.percentage = percentage;
    this.description = description;
}
function FileDirectory(dirpath) {
    this.dirpath = dirpath
}
let temp_list = []

async function extractFiles(startPath) {
    if (!fs.existsSync(startPath)) {
        throw new Error("Directory doesnot exist")
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            extractFiles(filename);
        } else if (stat.isFile()) {
            const file_ext_type = path.extname(filename);
            typeObjectMaintainer.update_type_object(file_ext_type)
        };
    };
};

async function extractFilesByName(startPath, findexp) {
    if (!fs.existsSync(startPath)) {
        throw new Error("Directory doesnot exist")
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            extractFilesByName(filename, findexp);
        } else if (stat.isFile()) {
            if (filename.includes(findexp)) {
                temp_list.push(new FileDirectory(filename))
            }
        };
    };
};


// argument parsing
const args = process.argv
if (args.includes("find")) {
    extractFilesByName(".", process.argv[3]);
    console.log(`Found ${temp_list.length} files which includes "${process.argv[3]}"`)
    console.table(temp_list)
} else {
    getGhfs()
}


function getGhfs() {
    extractFiles(process.argv[2]);
    let returned_file_types = typeObjectMaintainer.return_type_object()
    let total_files = 0
    let unknown_file_types_count = 0
    let unknown_file_types = []
    let files_finished = 0
    Object.keys(returned_file_types).map((item) => {
        total_files += returned_file_types[item]
    })
    for (const key in returned_file_types) {
        let filter_file_extension = key.replace(".", "").toUpperCase()
        // check for the upper case key value
        if (file_types[filter_file_extension]) {
            temp_list.push(new FileType(key, returned_file_types[key], parseFloat(returned_file_types[key] / total_files * 100).toFixed(2) + "%", file_types[filter_file_extension]["descriptions"].toString()))
            files_finished = files_finished + returned_file_types[key]
        } else {
            // automatically checks for lower key value
            if (file_types[key]) {
                temp_list.push(new FileType(key, returned_file_types[key], parseFloat(returned_file_types[key] / total_files * 100).toFixed(2) + "%", file_types[key]["descriptions"].toString()))
                files_finished = files_finished + returned_file_types[key]
            } else {
                unknown_file_types_count = unknown_file_types_count + 1
                unknown_file_types.push(key)
            }
        }
    }
    console.log(`${total_files} files found in directory ${process.argv[2]}`)
    console.log(`${files_finished} analyzed out of ${total_files} files,${total_files - files_finished} file types are unknown`)
    console.log(`Unkown file type count: ${unknown_file_types_count} ${unknown_file_types_count == 0 ? "" : `includes ${[...new Set(unknown_file_types)]}`}`)
    console.table(temp_list)
}