// all variables below are passed in via gulp and output to 'constants.js'
// was the easiest way to accomplish dynamic constants for various environments

export const DOMAIN = `${DOMAIN}`;
export const API_URL = '/api/v1';

export const TWITTER_USERNAME = 'raiserve';
export const CONTACT_EMAIL = 'contact@raiserve.org';
export const VOLUNTEER_CONTACT_EMAIL = 'volunteer@raiserve.org';

export const FACEBOOK_PAGE = 'https://www.facebook.com/raiserve';
export const TWITTER_PAGE = 'https://twitter.com/raiserve';

export const TEAM_IMAGES_FOLDER = '/assets/images/team';
export const USER_IMAGES_FOLDER = '/assets/images/users';
export const DEFAULT_AVATAR = 'default-user.png';
export const DEFAULT_LOGO = 'default-logo.png';

export const RAISERVE_LOGO = `${RAISERVE_LOGO}`;
export const DEFAULT_COVER = 'default-cover.png';

export const USER_PROGRESS_WIDTH = 7.5;
export const STAT_PROGRESS_WIDTH = 8.5;

export const USER_LIST_SCROLL_INCREMENT = 150;
export const GRAPH_SCROLL_INCREMENT = 50;
export const GRAPH_ACTIVATE_EMPTY_BARS = false; // SWITCH TO TRUE TO RESTORE EMPTY BARS BETWEEN DATES CONTAINING HOURS

export const EMAIL_RAISERVE_LOGO = `${DOMAIN}/${RAISERVE_LOGO}`;

export const FILESTACK_KEY = `${FILESTACK_KEY}`;
export const RESIZE_QUALITY = `${RESIZE_QUALITY}`;
export const RESIZE_COVER_MD = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=width:900,align:top/${RESIZE_QUALITY}`;
export const RESIZE_COVER_LG = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=width:1400,align:top/${RESIZE_QUALITY}`;
export const RESIZE_COVER_XL = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=width:1800,align:top/${RESIZE_QUALITY}`;
export const RESIZE_LOGO = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=height:100,align:top/${RESIZE_QUALITY}`;
export const RESIZE_PROFILE = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=width:180,height:180,fit:crop,align:top/${RESIZE_QUALITY}`;
export const RESIZE_PROFILE_EDIT = `https://process.filestackapi.com/${FILESTACK_KEY}/resize=width:115,height:115,fit:crop,align:top/${RESIZE_QUALITY}`;
