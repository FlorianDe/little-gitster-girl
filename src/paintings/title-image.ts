export type ArtworkImage = {
    imageDataUrl: string;
    dimensionsString: string;
    imageMimeType: string;
}

export const createArtworkTitleImage = (opts?: {size?: number}): ArtworkImage => {
    const {
        size = 512
    } = opts ?? {};

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const destroyCanvas = () => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
    }

    if (ctx) {
        const drawRectangle = function(x: number, y: number, w: number, h: number, border: number){
            ctx.beginPath();
            ctx.moveTo(x+border, y);
            ctx.lineTo(x+w-border, y);
            ctx.quadraticCurveTo(x+w-border, y, x+w, y+border);
            ctx.lineTo(x+w, y+h-border);
            ctx.quadraticCurveTo(x+w, y+h-border, x+w-border, y+h);
            ctx.lineTo(x+border, y+h);
            ctx.quadraticCurveTo(x+border, y+h, x, y+h-border);
            ctx.lineTo(x, y+border);
            ctx.quadraticCurveTo(x, y+border, x+border, y);
            ctx.closePath();
            ctx.stroke();
        }

        const neonRect = function(ctx: CanvasRenderingContext2D, x: number,y: number,w: number,h: number,r: number,g: number,b: number){
            ctx.shadowColor = "rgb("+r+","+g+","+b+")";
            ctx.shadowBlur=20;

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=20;
            drawRectangle(x,y,w,h,1.5);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=15;
            drawRectangle(x,y,w,h,1.5);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=10;
            drawRectangle(x,y,w,h,1.5);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=5;
            drawRectangle(x,y,w,h,1.5);

            ctx.strokeStyle= '#fff';
            ctx.lineWidth=2;
            drawRectangle(x,y,w,h,1.5);
        };

        const drawNote = function(ctx: CanvasRenderingContext2D, x: number,y: number,radius: number){
            const beamHeight = 200;
            const beamWidth = 200;
            const beamSteep = 50;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + radius, y - beamHeight);
            ctx.lineTo(x + radius+beamWidth, y - beamHeight - beamSteep);
            ctx.lineTo(x + radius+beamWidth, y - beamSteep);
            ctx.arc(x+beamWidth, y-beamSteep, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const neonNote = function(ctx: CanvasRenderingContext2D, x: number,y: number,radius: number,r: number,g: number,b: number){
            ctx.shadowColor = "rgb("+r+","+g+","+b+")";
            ctx.shadowBlur=10;

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=60;
            drawNote(ctx, x,y,radius);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=40;
            drawNote(ctx, x,y,radius);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=25;
            drawNote(ctx, x,y,radius);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=15;
            drawNote(ctx, x,y,radius);

            ctx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
            ctx.lineWidth=5;
            drawNote(ctx, x,y,radius);

            ctx.strokeStyle= '#fff';
            ctx.lineWidth=5;
            drawNote(ctx, x,y,radius);
        }
        const drawBackground = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        drawBackground();
        neonRect(ctx, 0, 0, canvas.width, canvas.height, 0, 88, 255)
        neonNote(ctx, 145, 350, 50, 255, 2, 0)
    }

    const imageMimeType = 'image/png';
    const imageDataUrl = canvas.toDataURL(imageMimeType);
    destroyCanvas();

    return {
        imageDataUrl,
        dimensionsString: `${size}x${size}`,
        imageMimeType
    }
};