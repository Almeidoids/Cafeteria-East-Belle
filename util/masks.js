export function createMaskOf(input, regex, formatMasks) {
    let updatedText = input.value.replace(regex, (match, ...args) => {
        return formatText(args.slice(0, -2), formatMasks);
    });

    updatedText = removeExcess(updatedText, input.maxLength);
    return updatedText;
}

function formatText(args, formatMasks) {
    let finalFormat = "";

    args.forEach(function (value, i) {
        finalFormat += i >= formatMasks.length ? value : value + formatMasks[i];
    })

    return finalFormat;
}

function removeExcess(text, maxLen) {
    if (text.length > maxLen) {
        let numberOfTextToBeRemoved = text.length - maxLen;
        text = text.slice(0, -numberOfTextToBeRemoved);
    }

    return text;
}


export function removeMask(text) {
    return text.replace(/\D/g, "");
}
