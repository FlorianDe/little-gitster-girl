const en = {
    yourPlaylists: ', your playlists:',
    language: 'Language',
    thisLang: 'English',
    welcome: 'Welcome',
    logout: 'Logout',
    login: 'Login',
    loginRequiredMessage: 'You have to log into your Spotify Account before you can use this site.',
    loginWithSpotify: 'Login with Spotify',
    somethingWentWrong: 'Something went wrong',
    pleaseTryAgainLater: 'Please try again later.',
    webPlayerNotActiveErrorMsg: 'Instance not active. Transfer your playback using your Spotify app.',
    requestCameraPermission: 'Request Camera Permission',
    cameraPermissionDenied: 'Camera permission denied.',
    cameraPermissionUserManualChangeAdvice: 'You need to change this in your settings.',
    scanNextSong: 'Scan Next Song',
    generateCodesViewAuthMissingErrorMsg:
        'Before you can generate playlists for the game you have to login via Spotify!',
    notFound404: '404 Not Found',
    pageNotFoundMessage: 'The page you are looking for does not exist.',
    goBackToHome: 'Go back to Home',
    cancelSelection: 'Cancel Selection',
    selectPlaylists: 'Select Playlists',
    generate: 'Generate',
    playGame: 'Play Game',
    generateCodes: 'Generate Codes',
    resetSelection: 'Reset Selection',
    generateQrCodesFor: 'Generate QR Codes for',
    playlists: 'playlists',
    dark: 'Dark',
    light: 'Light',
    tracks: 'tracks',
    toastTransferedPlayback: 'Transfered the playback.',
    toastFromDevice: 'From device:',
    toastTransferPlaybackError: 'Error when trying to transfer playback to the web',
    toastStartResumeError:
        `Playback was not possible try to transfer the playback via a device you have spotify on to "${import.meta.env.VITE_APP_NAME}" or try restarting the website!`,
    toastYouNeedToBeLoggedInToAccessPage: 'You need to be logged in to access this page.',
};

export type TranslationKeys = keyof typeof en;
export type Translation = Record<TranslationKeys, string>;
export type SupportedLanguage = 'de' | 'en';

const de: Translation = {
    yourPlaylists: ', deine Playlisten:',
    language: 'Sprache',
    thisLang: 'Deutsch',
    welcome: 'Willkommen',
    logout: 'Ausloggen',
    login: 'Anmelden',
    loginRequiredMessage: 'Sie müssen sich in Ihr Spotify-Konto einloggen, bevor Sie diese Seite nutzen können.',
    loginWithSpotify: 'Mit Spotify anmelden',
    somethingWentWrong: 'Etwas ist schiefgelaufen',
    pleaseTryAgainLater: 'Bitte versuchen Sie es später erneut.',
    webPlayerNotActiveErrorMsg: 'Instanz nicht aktiv. Übertragen Sie Ihre Wiedergabe mit Ihrer Spotify-App.',
    requestCameraPermission: 'Kameraerlaubnis anfordern',
    cameraPermissionDenied: 'Kameraerlaubnis verweigert.',
    cameraPermissionUserManualChangeAdvice: 'Sie müssen dies in Ihren Einstellungen ändern.',
    scanNextSong: 'Nächsten Song scannen',
    generateCodesViewAuthMissingErrorMsg:
        'Bevor Sie Playlists für das Spiel generieren können, müssen Sie sich über Spotify einloggen!',
    notFound404: '404 Nicht Gefunden',
    pageNotFoundMessage: 'Die Seite, die Sie suchen, existiert nicht.',
    goBackToHome: 'Zurück zur Startseite',
    cancelSelection: 'Auswahl abbrechen',
    selectPlaylists: 'Playlists auswählen',
    generate: 'Generieren',
    playGame: 'Spiel starten',
    generateCodes: 'Codes generieren',
    resetSelection: 'Auswahl zurücksetzen',
    generateQrCodesFor: 'QR-Codes generieren für',
    playlists: 'Playlists',
    dark: 'Dunkel',
    light: 'Hell',
    tracks: 'Tracks',
    toastTransferedPlayback: 'Wiedergabe übertragen.',
    toastFromDevice: 'Vom Gerät:',
    toastTransferPlaybackError: 'Fehler beim Übertragen der Wiedergabe zum Web',
    toastStartResumeError:
        `Wiedergabe war nicht möglich. Versuchen Sie, die Wiedergabe über ein Gerät, auf dem Sie Spotify haben, zu "${import.meta.env.VITE_APP_NAME}" zu übertragen, oder versuchen Sie, die Website neu zu starten!`,
    toastYouNeedToBeLoggedInToAccessPage: 'Sie müssen eingeloggt sein, um auf diese Seite zuzugreifen.',
};

export const translations: Record<SupportedLanguage, Translation> = {
    de,
    en,
};