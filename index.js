import fs from "fs";
import path from "path";
import { typeObjectMaintainer } from "./utils/maintainer/type_objects.js";
import { file_types } from "./utils/file/file_types.js";

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

const a = extractFiles("/home/santhosh/Desktop/Motovolt/ev.app/djangoAdminPanel");
let returned_file_types = typeObjectMaintainer.return_type_object()
for (const key in returned_file_types) {
    let filter_file_extension = key.replace(".", "").toUpperCase()
    if (file_types[filter_file_extension]) {
        console.log(`File Type:${key} || Count:${returned_file_types[key]} || File Name: ${file_types[filter_file_extension]["descriptions"]}`);
    }
}

