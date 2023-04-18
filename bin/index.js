import fs from "fs";
import path from "path";
import { typeObjectMaintainer } from "../utils/maintainer/type_objects.js";
import { file_types } from "../utils/file/file_types.js";

// init values
function Program(filetype, count, percentage, about) {
    this.filetype = filetype;
    this.count = count;
    this.percentage = percentage;
    this.about = about;
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
        } else if (true) {
            const file_ext_type = path.extname(filename);
            typeObjectMaintainer.update_type_object(file_ext_type)
        };
    };
};

const a = extractFiles(process.argv[2]);
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
        temp_list.push(new Program(key, returned_file_types[key], parseInt(returned_file_types[key] / total_files * 100) + "%", file_types[filter_file_extension]["descriptions"].toString()))
        files_finished = files_finished + returned_file_types[key]
    } else {
        // automatically checks for lower key value
        if (file_types[key]) {
            temp_list.push(new Program(key, returned_file_types[key], parseInt(returned_file_types[key] / total_files * 100) + "%", file_types[key]["descriptions"].toString()))
            files_finished = files_finished + returned_file_types[key]
        } else {
            unknown_file_types_count = unknown_file_types_count + 1
            unknown_file_types.push(key)
        }
    }
}
console.log(`${total_files} files found in directory ${process.argv[2]}`)
console.log(`${files_finished} analyzed out ${total_files} files,${total_files - files_finished} file types are unknown`)
console.log(`Unkown file type count: ${unknown_file_types_count} ${unknown_file_types_count == 0 ? "" : `includes ${[...new Set(unknown_file_types)]}`}`)
console.table(temp_list)

