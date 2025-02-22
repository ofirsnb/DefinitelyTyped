import loadImage = require('blueimp-load-image');

// Test image taken from package tests: https://github.com/blueimp/JavaScript-Load-Image/blob/master/test/test.js

// 2x1px JPEG (color white, with the Exif orientation flag set to 6 and the
// IPTC ObjectName (2:5) set to 'objectname'):
const b64DataJPEG =
    '/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAABABIBAwABAAAA' +
    'BgASAAAAAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAA8cAgUACm9iamVj' +
    'dG5hbWUA/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEB' +
    'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB' +
    '/8AAEQgAAQACAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYH' +
    'CAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGh' +
    'CCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldY' +
    'WVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1' +
    'tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8B' +
    'AAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAEC' +
    'dwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBka' +
    'JicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWG' +
    'h4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ' +
    '2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooA/9k=';
const imageUrlJPEG = 'data:image/jpeg;base64,' + b64DataJPEG;
const imageBlob = new Blob([imageUrlJPEG]);

// Callback style
loadImage(
    imageUrlJPEG,
    (image: Event | HTMLCanvasElement | HTMLImageElement, data?: loadImage.MetaData): void => {
        const canvas = image as HTMLCanvasElement;
        console.log(data);
        canvas.toBlob((blob: Blob | null): void => {
            const url = canvas.toDataURL('image/png');
            console.log(url);
        });
    },
    { canvas: true, orientation: true, maxWidth: 100, maxHeight: 100, crop: true },
);

// Promise style
loadImage(imageUrlJPEG, { canvas: true, orientation: true, maxWidth: 100, maxHeight: 100, crop: true }).then(data => {
    const canvas = data.image as any as HTMLCanvasElement;
    console.log(data);
    canvas.toBlob((blob: Blob | null): void => {
        const url = canvas.toDataURL('image/png');
        console.log(url);
    });
});

// Parse metadata using callback
loadImage.parseMetaData(imageUrlJPEG, metadata => {
    console.log(metadata.exif && metadata.exif.get('Orientation'));
    console.log(metadata.exif && metadata.exif[0x0112]);
});

// Parse metadata using promise
loadImage.parseMetaData(imageUrlJPEG).then(metadata => {
    console.log(metadata.exif && metadata.exif.get('Orientation'));
    console.log(metadata.exif && metadata.exif[0x0112]);
});

// Replace image head, using callback
loadImage(
    imageUrlJPEG,
    (_: Event | HTMLCanvasElement | HTMLImageElement, data?: loadImage.MetaData): void => {
        if (data?.imageHead) {
            loadImage.replaceHead(imageBlob, data.imageHead, blob => {
                console.log(blob?.size);
            });
        }
    },
    {},
);

// Replace image head, using promise
loadImage(
    imageUrlJPEG,
    (_: Event | HTMLCanvasElement | HTMLImageElement, data?: loadImage.MetaData): void => {
        if (data?.imageHead) {
            loadImage.replaceHead(imageBlob, data.imageHead).then(blob => {
                console.log(blob?.size);
            });
        }
    },
    {},
);

// Write Exif data
loadImage(
    imageUrlJPEG,
    (_: Event | HTMLCanvasElement | HTMLImageElement, data?: loadImage.MetaData): void => {
        if (data?.imageHead && data?.exif && data?.exifOffsets) {
            const newBuffer: ArrayBuffer | Uint8Array = loadImage.writeExifData(
                data.imageHead,
                { exifOffsets: data.exifOffsets, exif: data.exif },
                'Orientation',
                1,
            );
            console.log(newBuffer.byteLength);
        }
    },
    {},
);
