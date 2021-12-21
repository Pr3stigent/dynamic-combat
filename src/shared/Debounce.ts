interface validateData {
    id: string, 
    validateTime: number,
    autoSet?: boolean,
    conditionType?: ">=" | "<="
}
const getDebounce = (id: string) => script.GetAttribute(id)

function setDebounce(id: string) {
    script.SetAttribute(id, time())
}

function validateDebounce(data: validateData) {
    const debounce = getDebounce(data.id) as number
    let conditionTrue
    
    switch(data.conditionType) {
        case ">=":
            conditionTrue = time() - debounce >= data.validateTime
        case "<=":
             conditionTrue = time() - debounce <= data.validateTime
        default:
            conditionTrue = time() - debounce >= data.validateTime
    }
    
    if (conditionTrue && data.autoSet) {
        setDebounce(data.id)
    }
    
    return conditionTrue
}

export = {
    Get: getDebounce,
    Set: setDebounce,
    Validate: validateDebounce
}
