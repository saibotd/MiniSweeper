import React from 'react';
import {render} from 'react-dom';
import UI from './UI';

render(
    <UI />,
    document.getElementById('root')
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
    
    window.addEventListener('beforeinstallprompt', function(e) {
        // beforeinstallprompt Event fired
        e.prompt();
        // e.userChoice will return a Promise.
        // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
        e.userChoice.then(function(choiceResult) {
            
            console.log(choiceResult.outcome);
            
            if(choiceResult.outcome == 'dismissed') {
                console.log('User cancelled home screen install');
            }
            else {
                console.log('User added to home screen');
            }
        });
    });
}
