import { SectionContent } from '../models/index.js';
import { validateIds } from '../utils/index.js';

const toggleVideoToSectionContent = async (
    sectionId,
    videoId,
    toggle = true,
    order = 1
) => {
    validateIds(videoId);

    let section;
    if (sectionId && toggle) {
        section = await SectionContent.create({
            section: sectionId,
            video: videoId,
            order,
        });
    } else {
        section = await SectionContent.findOneAndDelete({
            video: videoId,
        });
    }

    if (!section) {
        return false;
        // throw new ApiError(
        //     StatusCodes.INTERNAL_SERVER_ERROR,
        //     'Something went wrong while toggling video'
        // );
    }

    return true;
};

export default {
    toggleVideoToSectionContent,
};
