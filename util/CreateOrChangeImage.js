import styles from "../style/changeImage.module.css";

export function imageEffect(e, input, effect, time) {

    clearTimeout(time);

    const x = e.clientX;
    const y = e.clientY;

    effect.style.setProperty("--xClick", x + "px");
    effect.style.setProperty("--yClick", y + "px");
    effect.className = styles.imageAnimation;

    input.click();

    time = setTimeout(() => {
        effect.className = null;
    }, 1000);
}

export async function cropper(setCropImage, image, ca, setImage, indexImg, sendImage, setSendImage) {
    
    try {
        const img = await promiseImage(image);
        const canvas = document.createElement("canvas");
        
        const ctx = canvas.getContext("2d");
        
        if (!ctx) throw new Error("Erro no canvas");
        
        canvas.width = ca.width;
        canvas.height = ca.height;

        ctx.drawImage(
            img,
            ca.x,
            ca.y,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const blobImage = await new Promise(function (resolve, reject) {
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error("Falha ao cortar imagem"));
                resolve(blob);
            }, "image/jpeg");
        })
        
        let copyArr = sendImage;
        copyArr[indexImg] = blobImage;

        const croppedImage = copyArr.map(item => {
            return URL.createObjectURL(item);
        })

        setCropImage([...croppedImage]);
        setSendImage([...copyArr]);

        setImage(null)
    }
    catch (err) {
        console.log(err);
    }
}

export function getImage(image) {
    image = new Uint8Array(image.data);
    const blobImage = new Blob([image], {type: "image/jpeg"});

    image = URL.createObjectURL(blobImage);

    return {image, blobImage};
}

function promiseImage(image) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    })
}