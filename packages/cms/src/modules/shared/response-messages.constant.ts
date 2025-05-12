export const apiResponseMessage = {
  CONFLICT: 'api response conflict',
  OUT_OF_TIME: 'Response out of time',
  NOT_FOUND: 'Resource not found.',
  GET_SUCCESS: 'Get request successful.',
  GET_FAIL: 'Get request failed.',
  POST_SUCCESS: 'Post request successful.',
  POST_FAIL: 'Post request failed.',
  PATCH_SUCCESS: 'Patch request successful.',
  PATCH_FAIL: 'Patch request failed.',
  PUT_SUCCESS: 'Put request successful.',
  PUT_FAIL: 'Put request failed.',
  DELETE_SUCCESS: 'Delete request successful.',
  DELETE_FAIL: 'Delete request failed.',
  UPLOAD_SUCCESS: 'File uploaded successfully.',
  UPLOAD_FAILED: 'File uploaded failed.',
  UPLOAD_MISSING: 'Upload file is missing.',
  UPLOAD_MEDIA_UNSUPPORTED: 'File type does not match.',
  INVALID_OBJECTID: 'Not a valid object id.',
  MOVE_USER_TO_TOP: 'User moved to top successfully.',
  SHOW_WAIT_USER:'Show Wait user successfully.',
};

export const authResponseMessage = {
  NOBLE_FAIL_SEND:'Noble send failed',
  NOBLE_SEND: 'Noble send success',
  TYHO_SEND: 'TYHO send success',
  UNAUTHORIZED: 'Unauthorized.',
  AUTHENTICATION_FAILED: 'Your login ID or password was incorrect.',
  LOGIN_SUCCESS: 'Login successfully.',
  LOGOUT_SUCCESS: 'Logout successfully.',
  JWT_EXPIRED: 'JWT expired. Please login again.',
  JWT_INVALID_SIGNATURE: 'JWT invalid signature.',
  OTP_EXPIRED: 'OTP expired. Please generate a new one.',
  OTP_INVALID: 'OTP invalid. Please generate a new one.',
  OTP_VALID: 'OTP verified succussfully.',
  GENERATE_OTP_SUCCESS:
    'OTP has been sent to the email address associated with the registered user.',
  PASSWORD_NOT_MATCH: 'Password does not match.',
  REGISTER_SUCCESS:
    'Registered successfully. Please check email for OTP verification.',
  REGISTER_FAILED:
    '<p>We cannot proceed, please double check your entries. If all are correct, please contact <a href="mailto:workwell.enquiry@aia.com" >workwell.enquiry@aia.com</a> for assistance.</p>',
};

export const genericCodesResponseMessage = {
  CODE_EXPIRED: 'This Generic code is already expired.',
  CODE_INVALID: 'This Generic code is already used.',
  NOT_FOUND: 'Generic code not found.',
  GENERATE_SUCCESS: 'Generic code generated successfully.',
  UPDATE_STATUS_SUCCESS: 'Generic code updated successfully.',
};

export const articlesResponseMessage = {
  ASSIGN_QUIZ_SUCCESS: 'Quiz assigned to Article successfully.',
  CLAIM_TOKENS_FAILED:
    'Tokens claimed failed. User already claimed the article before.',
  CLAIM_TOKENS_SUCCESS: 'Tokens claimed successfully.',
  LIKE_FAILED: 'Like failed. User already liked the article before.',
  LIKE_SUCCESS: 'Like successfully.',
  UNLIKE_FAILED: 'Unlike failed. User already unliked the article before.',
  UNLIKE_SUCCESS: 'Unlike successfully.',
  NOT_FOUND: 'Article not found.',
  UPDATE_SUCCESS: 'Article updated successfully.',
  TRANSACTION_TITLE: 'You have read an article.',
  TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have read an article.',
    zh: '你已閱讀文章。',
    cn: '你已阅读文章。',
  },
  UPDATE_PUBLISH_DATE_FAIL: 'Publish date must be in the future.',
};

export const quizzesResponseMessage = {
  NOT_FOUND: 'Quiz not found.',
  UPDATE_SUCCESS: 'Quiz updated successfully.',
  DELETE_ANSWERS_SUCCESS: 'Quiz answers deleted successfully.',
  SUBMIT_ANSWERS_FAILED: 'Quiz answers already submitted.',
  SUBMIT_ANSWERS_SUCCESS: 'Quiz answers submitted successfully.',
  TRANSACTION_TITLE: 'You have completed a quiz.',
  TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have completed a quiz.',
    zh: '你已完成測驗。',
    cn: '你已完成测验。',
  },
};

export const challengesResponseMessage = {
  ID_NOT_MATCH: 'ChallengeId does not match',
  TYPE_NOT_MATCH: 'Challenge type does not match',
  NOT_FOUND: 'Challenge not found.',
  PROGRESS_NOT_FOUND: 'Challenge progress not found.',
  PROGRESS_RESET_SUCCESS: 'Challenge progress reset successfully.',
  SEND_ECARD_SUCCESS: 'Challenge completed. E-Card sent successfully.',
  ENTER_DEPARTMENT_SUCCESS:
    'Challenge completed. Enter department successfully.',
  ALREADY_ENTER_DEPARTMENT_SUCCESS:
    'Challenge had complete. You have entered department successfully.',
  UPLOAD_CHALLENGE_FAILED:
    'Uploaded failed. User already completed the challenge.',
  UPLOAD_CHALLENGE_SUCCESS: 'Challenge completed. File uploaded successfully.',
  UPDATE_LIKES_SUCCESS: 'Like status updated successfully.',
  CONNECTEDNESS_TRANSACTION_TITLE:
    'You have completed Connectedness Challenge.',
  CONNECTEDNESS_TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have completed Connectedness Challenge.',
    zh: '你已完成語言達人挑戰。',
  },
  ECARD_TRANSACTION_TITLE: 'You have completed Relationship Challenge.',
  ECARD_TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have completed Relationship Challenge.',
    zh: '你已完成社交能手挑戰。',
  },
  ENVIRONMENTAL_TRANSACTION_TITLE:
    'You have completed Environmental Challenge.',
  ENVIRONMENTAL_TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have completed Environmental Challenge.',
    zh: '你已完成環境保護挑戰。',
  },
  SOCIAL_TRANSACTION_TITLE: 'You have completed Social Challenge.',
  SOCIAL_TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have completed Social Challenge.',
    zh: '你已完成好人好報挑戰。',
  },
  ALREADY_COMPLETED_CHALLENGEBOOTH: 'You already completed this challenge booth.',
  CHALLENGEBOOTH_BOOTH_NOT_FOUND: 'Challenge booth not found.',
};

export const challengeTemplatesResponseMessage = {
  NOT_FOUND: 'Challenge template not found.',
  PROGRESS_NOT_FOUND: 'Challenge progress not found.',
  UPDATE_SUCCESS: 'Challenge template updated successfully.',
};

export const communitiesResponseMessage = {
  NOT_FOUND: 'Community not found.',
};

export const eCardsResponseMessage = {
  NOT_FOUND: 'E-Card not found.',
  SEND_SUCCESS: 'E-Card sent successfully,',
};

export const eventsResponseMessage = {
  YOU_ALREADY_UNENROLLD: 'You already unenrolled the event.',
  FEED_BACK_SUBMIT:'Feedback submitted successfully.',
  YOU_ARE_IN_BLACKLISTED: 'you are in black list',
  BLACKLISTED:'you are in black list',
    WAITING:'you are in waiting list',
  NOT_FOUND: 'Event not found.',
  SURVEY_NOT_FOUND: 'Survey not found.',
  OUT_OF_RANGE: 'The survey submitted is out of range.',
  SUBMIT_ANSWERS_SUCCESS: 'Survey answers submitted successfully.',
  REWARD_NOT_FOUND: 'There are no rewards in this event',
  ENROLLMENT_ALREADY_ENROLLED: 'User already enrolled the event.',
  ENROLLMENT_FULL: 'Event enrollment is full.',
  ENROLLMENT_EMPTY: 'Event enrollment is empty.',
  ENROLLMENT_CAPACITY: 'Event enrollment capacity cannot be decreased.',
  ENROLLMENT_NOT_OPEN: 'Event is not open for enrollment at the moment.',
  ENROLL_SUCCESS: 'Event enrolled successfully.',
  UNENROLL_SUCCESS: 'Event unenrolled successfully.',
  ENROLLMENT_RESET_SUCCESS: 'Event enrollment reset successfully.',
  UPDATE_SUCCESS: 'Event updated successfully.',
  TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have enrolled an event.',
    zh: '你已成功登記活動。',
    cn: '你已成功登记活动。',
  },
};

export const chatResponseMessage = {
  CHATROOM_ALREADY_EXIST: 'A chatroom with the same users already exists.',
  CHATROOM_NOT_FOUND: 'Chatroom not found.',
  CONTENT_MISSING: 'Message content is missing.',
  PARAMS_MISSING: 'Required parameters are missing.',
  USER_NOT_JOINED: 'Recipient or sender did not joined the chatroom.',
  RECIPIENT_NOT_FOUND: 'Recipient not found.',
  SENDER_NOT_FOUND: 'Sender not found.',
  SEND_SUCCESS: 'Message sent successfully,',
  UPDATE_SUCCESS: 'Chatroom updated successfully.',
};

export const goalsResponseMessage = {
  RESET_GOAL_SUCCESS: 'Goal reset successfully.',
  ALREADY_EXIST: 'User has already set a goal.',
  DAILY_NOT_FOUND: 'Daily goals not found.',
  NOT_FOUND: 'User goal not found.',
  OUT_OF_RANGE: 'The goal submitted is out of range.',
  DAY_OUT_OF_RANGE: 'The day submitted is out of range.',
  SUBMIT_ANSWERS_SUCCESS: 'Survey answers submitted successfully.',
  DELETE_ANSWERS_SUCCESS: 'Survey answers deleted successfully.',
  SUBMIT_ACTIVITIES_SUCCESS: 'Daily activities submitted successfully.',
  DELETE_ACTIVITIES_SUCCESS: 'Daily activities deleted successfully.',
};

export const promotionsResponseMessage = {
  NOT_FOUND: 'Promotion not found.',
};

export const tokenhuntsResponseMessage = {
  NOT_FOUND: 'Tokenhunt not found.',
  PROGRESS_NOT_FOUND: 'Tokenhunt progress not found.',
  TEMPLATE_NOT_FOUND: 'Tokenhunt template not found.',
  UPDATE_PROGRESS_SUCCESS: 'Tokenhunt progress updated successfully.',
  DELETE_PROGRESS_SUCCESS: 'All tokenhunt progress deleted successfully.',
  ALREADY_CLAIMED: 'Tokens claimed failed. User already claimed before.',
  CLAIM_SUCCESS: 'Tokens claimed successfully.',
  TRANSACTION_TITLE: 'You have claimed token from token hunt.',
  TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have claimed token from token hunt.',
    zh: '您已獲得獎勵。',
  },
};

export const companiesResponseMessage = {
  ALREADY_EXIST: 'A company with the same name already exists.',
  NOT_FOUND: 'Company not found.',
  REGISTER_SUCCESS: 'Company registered successfully.',
  UPDATE_SUCCESS: 'Company information updated successfully.',
  UPDATE_USER_SUCCESS: 'User updated successfully.',
  REMOVE_USER_SUCCESS: 'User removed successfully.',
};

export const usersResponseMessage = {
  ALREADY_EXIST: 'An user with that email already exists.',
  NOT_FOUND: 'An user with that email does not exists.',
  CHANGE_LANGUAGE_SUCCESS: 'Preferred language changed successfully.',
  UPDATE_PASSWORD_SUCCESS: 'Password changed successfully.',
  UPDATE_PROFILE_SUCCESS: 'Profile changed successfully.',
};

export const StarbucksResponseMessage = {
  NOT_FOUND: 'StarBuck coupon not found.',
};

export const RewardsResponseMessage = {
  NOT_FOUND: 'Coupon not found.',
  REWARDS_FULL: "All rewards'enrolled is full",
};

export const MyRewardsResponseMessage = {
  NOT_FOUND: 'Coupon not found.',
};

export const departmentsResponseMessage = {
  NOT_FOUND: 'A department does not exists',
};

export const CDMAssessmentSurveyResponseMessage = {
  NOT_FOUND: 'CDM Assessment Survey does not exists',
  SUBMIT_ANSWERS_FAILED: 'Survey answers already submitted.',
};

export const stretchesResponseMessage = {
  CLAIM_TOKENS_FAILED:
    'Tokens claimed failed. User already claimed the stretch before.',
  CLAIM_TOKENS_SUCCESS: 'Tokens claimed successfully.',
  NOT_FOUND: 'Stretch not found.',
  TRANSACTION_TITLE: 'You have read a stretch.',
  TRANSACTION_LOCALIZED_TITLE: {
    en: 'You have read a stretch.',
    zh: '你已閱讀课程。',
    cn: '你已阅读课程。',
  },
  UPDATE_PUBLISH_DATE_FAIL: 'Publish date must be in the future.',
};