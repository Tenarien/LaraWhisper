import {formatBytes, isPDF, isPreviewable} from "@/helpers.jsx";
import {PaperClipIcon} from "@heroicons/react/24/solid";

const AttachmentPreview = ({ file }) => {

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-neutral-800">
            <div>
                {isPDF(file.file) && <img src="/img/pdf.png" className="w-8 h-8"  alt="" />}
                {!isPreviewable(file.file) && (
                    <div className="flex justify-center items-center w-10 h-10 bg-neutral-700 rounded">
                            <PaperClipIcon className="w-5" />
                    </div>
                )}
            </div>
            <div className="flex-1 text-neutral-400 text-nowrap text-ellipsis overflow-hidden">
                <h3>{file.file.name}</h3>
                <p className="text-xs">{formatBytes(file.file.size)}</p>
            </div>
        </div>
    );
};

export default AttachmentPreview;
