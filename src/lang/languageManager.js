import counterpart from 'counterpart';

counterpart.registerTranslations(
    'en',
    require('./english')
);

counterpart.registerTranslations(
    'fr',
    require('./french')
);

module.exports = {
    counterpart,
};
