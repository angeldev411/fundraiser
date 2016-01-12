import counterpart from 'counterpart';

counterpart.registerTranslations(
    'en',
    require('../lang/english')
);

counterpart.registerTranslations(
    'fr',
    require('../lang/french')
);

module.exports = {
    counterpart,
};
