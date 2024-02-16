// module to flatten a nested array || object

import { useCallback, useEffect, useState } from "react";

const FlattenView = () => {
        
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    
    const flattenArray = useCallback((input: Array<any>) => {
        return input.reduce((acc: any, val: any) => {
            if(Array.isArray(val)) acc.push(...flattenArray(val));
            else acc.push(val);

            return acc;
        }, [])
    },[]);
    
    const flattenObject = useCallback((obj:any, parentKey = '', result:Record<string,any> = {}) => {
        for (let [key, value] of Object.entries(obj)) {
            let newKey = parentKey ? `${parentKey}.${key}` : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                flattenObject(value, newKey, result);
            } else {
                result[newKey] = value;
            }
        }
        return result;
    }, []);
      

    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
    if (input) {
        try {
            const inputString = input.replaceAll("'", '"');
            const parsed = JSON.parse(inputString);
            let flattened;
            if (Array.isArray(parsed)) {
                flattened = flattenArray(parsed);
            } else if (typeof parsed === 'object' && parsed !== null) {
                flattened = flattenObject(parsed);
            }
            setResult(JSON.stringify(flattened));
            setIsValid(true);
        } catch (e) {
            console.log(e);
            setIsValid(false);
        }
    } else {
        setIsValid(true);
    }
    }, [input, flattenArray, flattenObject, setIsValid]);

    return (
        <div>
            <h1>Flatten Array + Object</h1>
            <div>
                <input
                    type="text"
                    placeholder="Input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={isValid ? 'valid-input' : 'invalid-input'}
                />
            </div>
            <div>
                <h2>Flattened:</h2>
                {result && <div>{result}</div>}
            </div>
        </div>
    );
}


export default FlattenView;