import {isToday, isYesterday} from "date-fns";

export const formatMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleTimeString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleTimeString()
    }
};

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return "Yesterday";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
};

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")
    return mime[0].toLowerCase() === "image";
};

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")
    return mime[0].toLowerCase() === "video";
};

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/")
    return mime[0].toLowerCase() === "audio";
};

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    return mime === "application/pdf"
};

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const kbit = 1024;
    const decimal = decimals <0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    let i = 0;
    let size = bytes;

    while (size >= kbit) {
        size /= kbit;
        i++;
    }

    return parseFloat(size.toFixed(decimal)) + " " + sizes[i];
};
