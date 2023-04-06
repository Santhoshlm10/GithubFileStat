class TypeObjectMaintainer{
    
    // This object maintains the file type object with the count of the file
    // {
    //     ".py":"34,
    //     ".js":23,
    //     ".json":34
    // }
    constructor(){
        this.type_objects = {}
    }

    update_type_object(file_type){
        if(this.type_objects[file_type]){
            this.type_objects[file_type] += 1
        }else{
            this.type_objects[file_type] = 1
        }
    }

    return_type_object(){
        return this.type_objects
    }
}

export const typeObjectMaintainer = new TypeObjectMaintainer()